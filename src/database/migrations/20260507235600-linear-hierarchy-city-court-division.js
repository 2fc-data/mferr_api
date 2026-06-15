'use strict';

/**
 * Migration: Linear hierarchy City → Court → CourtDivision
 *
 * Changes:
 * 1. Add city_id FK to courts (RESTRICT)
 * 2. Populate courts.city_id from existing court_divisions data
 * 3. Replace unique [name, state] with [name, city_id] on courts
 * 4. Add unique [name, court_id] on court_divisions
 * 5. Remove city_id from court_divisions (now inherited via Court)
 */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Add city_id column to courts
    try {
      await queryInterface.addColumn('courts', 'city_id', {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true, // temporarily nullable for backfill
        references: {
          model: 'cities',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        after: 'state',
      });
    } catch (e) {
      console.log('city_id column may already exist on courts:', e.message);
    }

    // 2. Backfill courts.city_id from court_divisions
    // For each court, pick the city_id from its first division
    try {
      await queryInterface.sequelize.query(`
        UPDATE courts c
        SET c.city_id = (
          SELECT cd.city_id
          FROM court_divisions cd
          WHERE cd.court_id = c.id AND cd.city_id IS NOT NULL
          LIMIT 1
        )
        WHERE c.city_id IS NULL
      `);
    } catch (e) {
      console.log('Backfill error:', e.message);
    }

    // 3. Remove old unique index [name, state]
    try {
      await queryInterface.removeIndex('courts', 'idx_courts_name_state');
    } catch (e) {
      console.log('Index idx_courts_name_state may not exist:', e.message);
    }

    // 4. Add new unique index [name, city_id]
    try {
      await queryInterface.addIndex('courts', ['name', 'city_id'], {
        unique: true,
        name: 'idx_courts_name_city',
      });
    } catch (e) {
      console.log('Index idx_courts_name_city may already exist:', e.message);
    }

    // 5. Add unique [name, court_id] on court_divisions
    try {
      await queryInterface.addIndex('court_divisions', ['name', 'court_id'], {
        unique: true,
        name: 'idx_court_divisions_name_court',
      });
    } catch (e) {
      console.log('Index idx_court_divisions_name_court may already exist:', e.message);
    }

    // 6. Remove city_id from court_divisions (redundant now)
    // Must drop FK constraint first, then index, then column
    try {
      // Find the FK constraint name dynamically
      const [fkRows] = await queryInterface.sequelize.query(`
        SELECT CONSTRAINT_NAME
        FROM information_schema.KEY_COLUMN_USAGE
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = 'court_divisions'
          AND COLUMN_NAME = 'city_id'
          AND REFERENCED_TABLE_NAME = 'cities'
        LIMIT 1
      `);

      if (fkRows.length > 0) {
        const fkName = fkRows[0].CONSTRAINT_NAME;
        await queryInterface.removeConstraint('court_divisions', fkName);
      }
    } catch (e) {
      console.log('FK constraint on court_divisions.city_id may not exist:', e.message);
    }

    try {
      await queryInterface.removeIndex('court_divisions', ['city_id']);
    } catch (e) {
      console.log('Index on court_divisions.city_id may not exist:', e.message);
    }

    try {
      await queryInterface.removeColumn('court_divisions', 'city_id');
    } catch (e) {
      console.log('city_id column may not exist on court_divisions:', e.message);
    }
  },

  down: async (queryInterface, Sequelize) => {
    // 1. Re-add city_id to court_divisions
    try {
      await queryInterface.addColumn('court_divisions', 'city_id', {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'cities',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        after: 'court_id',
      });
      await queryInterface.addIndex('court_divisions', ['city_id']);
    } catch (e) {}

    // 2. Backfill court_divisions.city_id from courts.city_id
    try {
      await queryInterface.sequelize.query(`
        UPDATE court_divisions cd
        INNER JOIN courts c ON cd.court_id = c.id
        SET cd.city_id = c.city_id
      `);
    } catch (e) {}

    // 3. Remove unique [name, court_id] from court_divisions
    try {
      await queryInterface.removeIndex('court_divisions', 'idx_court_divisions_name_court');
    } catch (e) {}

    // 4. Remove unique [name, city_id] from courts
    try {
      await queryInterface.removeIndex('courts', 'idx_courts_name_city');
    } catch (e) {}

    // 5. Re-add unique [name, state] to courts
    try {
      await queryInterface.addIndex('courts', ['name', 'state'], {
        unique: true,
        name: 'idx_courts_name_state',
      });
    } catch (e) {}

    // 6. Remove city_id from courts
    try {
      await queryInterface.removeColumn('courts', 'city_id');
    } catch (e) {}
  },
};

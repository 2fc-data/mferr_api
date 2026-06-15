'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Create table for User-Profile relationship (many-to-many)
    await queryInterface.createTable('user_profiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      user_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      profile_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'profiles',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // 2. Create table for Profile-Rule relationship (many-to-many)
    await queryInterface.createTable('profile_rules', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      profile_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'profiles',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      rule_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'rules',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // 3. Migrate data from users_profiles_rules if it exists
    const tableNames = await queryInterface.showAllTables();
    if (tableNames.includes('users_profiles_rules')) {
      // Migrate User-Profile associations
      await queryInterface.sequelize.query(`
        INSERT INTO user_profiles (user_id, profile_id, created_at, updated_at)
        SELECT DISTINCT user_id, profile_id, NOW(), NOW()
        FROM users_profiles_rules
      `);

      // Migrate Profile-Rule associations
      await queryInterface.sequelize.query(`
        INSERT INTO profile_rules (profile_id, rule_id, created_at, updated_at)
        SELECT DISTINCT profile_id, rule_id, NOW(), NOW()
        FROM users_profiles_rules
      `);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('profile_rules');
    await queryInterface.dropTable('user_profiles');
  }
};

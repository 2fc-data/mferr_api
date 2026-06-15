'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Refactor courts table
    try {
      await queryInterface.removeConstraint('courts', 'courts_city_id_foreign_idx');
    } catch (e) {}
    
    try {
      await queryInterface.removeIndex('courts', 'idx_courts_name_city');
    } catch (e) {}
    
    try {
      await queryInterface.removeColumn('courts', 'city_id');
    } catch (e) {}
    
    try {
      await queryInterface.addIndex('courts', ['name', 'state'], {
        unique: true,
        name: 'idx_courts_name_state'
      });
    } catch (e) {}

    // 2. Refactor court_divisions table
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
        after: 'court_id'
      });
    } catch (e) {}
    
    try {
      await queryInterface.addIndex('court_divisions', ['city_id']);
    } catch (e) {}
  },

  down: async (queryInterface, Sequelize) => {
    // Reverse changes
    await queryInterface.removeIndex('court_divisions', ['city_id']);
    await queryInterface.removeColumn('court_divisions', 'city_id');
    
    await queryInterface.removeIndex('courts', 'idx_courts_name_state');
    
    await queryInterface.addColumn('courts', 'city_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'cities',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      after: 'state'
    });
    
    await queryInterface.addIndex('courts', ['name', 'city_id'], {
      unique: true,
      name: 'idx_courts_name_city'
    });
  }
};

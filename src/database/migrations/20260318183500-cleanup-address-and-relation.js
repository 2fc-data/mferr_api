'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove city_id from addresses
    await queryInterface.removeColumn('addresses', 'city_id');
    
    // Ensure city and state exist (they should from initial schema, but just in case)
    // Actually, according to initial-schema.js, they are already there as STRING(100) and CHAR(2).
  },

  async down(queryInterface, Sequelize) {
    // Re-add city_id to addresses (if needed, but pointing back to cities)
    await queryInterface.addColumn('addresses', 'city_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'cities',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  }
};

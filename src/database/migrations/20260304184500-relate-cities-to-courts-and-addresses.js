'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add city_id to courts
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

    // Add city_id to addresses
    await queryInterface.addColumn('addresses', 'city_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'cities',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      after: 'city'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('addresses', 'city_id');
    await queryInterface.removeColumn('courts', 'city_id');
  }
};

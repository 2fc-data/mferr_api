'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('cities', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      uf: {
        type: Sequelize.STRING(2),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      }
    });

    await queryInterface.addIndex('cities', ['name']);
    await queryInterface.addIndex('cities', ['uf']);

    // Add city_id to causes
    await queryInterface.addColumn('causes', 'city_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'cities',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      after: 'court_division_id'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('causes', 'city_id');
    await queryInterface.dropTable('cities');
  }
};

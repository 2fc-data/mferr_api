'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('status', 'stage_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'stages',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await queryInterface.addIndex('status', ['stage_id']);
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('status', 'stage_id');
  },
};

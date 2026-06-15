'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('status_tasks', 'deleted_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('cause_tasks', 'deleted_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('cause_tasks', 'deleted_at');
    await queryInterface.removeColumn('status_tasks', 'deleted_at');
  }
};

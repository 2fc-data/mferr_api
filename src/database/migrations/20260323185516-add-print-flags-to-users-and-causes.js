'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'print_lgpd_consent', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });
    await queryInterface.addColumn('causes', 'print_contract', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'print_lgpd_consent');
    await queryInterface.removeColumn('causes', 'print_contract');
  }
};

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const usersTable = await queryInterface.describeTable('users');
    
    if (!usersTable.print_lgpd_minor_consent) {
      await queryInterface.addColumn('users', 'print_lgpd_minor_consent', {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      });
    }

    if (!usersTable.lgpd_minor_doc_path) {
      await queryInterface.addColumn('users', 'lgpd_minor_doc_path', {
        type: Sequelize.STRING(255),
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'print_lgpd_minor_consent');
    await queryInterface.removeColumn('users', 'lgpd_minor_doc_path');
  }
};

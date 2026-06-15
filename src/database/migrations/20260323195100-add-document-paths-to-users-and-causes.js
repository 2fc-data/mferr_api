'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add lgpd_doc_path to users IF it doesn't exist (it's in the model but not in migrations)
    const usersTable = await queryInterface.describeTable('users');
    if (!usersTable.lgpd_doc_path) {
      await queryInterface.addColumn('users', 'lgpd_doc_path', {
        type: Sequelize.STRING(255),
        allowNull: true,
      });
    }

    // Add contract_doc_path to causes
    const causesTable = await queryInterface.describeTable('causes');
    if (!causesTable.contract_doc_path) {
      await queryInterface.addColumn('causes', 'contract_doc_path', {
        type: Sequelize.STRING(255),
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'lgpd_doc_path');
    await queryInterface.removeColumn('causes', 'contract_doc_path');
  }
};

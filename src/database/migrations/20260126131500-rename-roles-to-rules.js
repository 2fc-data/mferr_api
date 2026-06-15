'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableNames = await queryInterface.showAllTables();

    // Rename roles to rules if it exists
    if (tableNames.includes('roles')) {
      await queryInterface.renameTable('roles', 'rules');
    }

    // Rename profile_roles to profile_rules if it exists
    if (tableNames.includes('profile_roles')) {
      await queryInterface.renameTable('profile_roles', 'profile_rules');

      // Optionally rename columns if they were role_id
      // For profile_rules, the current schema says rule_id. 
      // If it was role_id, renaming columns might be needed depending on what was actually deployed.
    }
  },

  async down(queryInterface, Sequelize) {
    const tableNames = await queryInterface.showAllTables();

    if (tableNames.includes('rules')) {
      await queryInterface.renameTable('rules', 'roles');
    }

    if (tableNames.includes('profile_rules')) {
      await queryInterface.renameTable('profile_rules', 'profile_roles');
    }
  }
};

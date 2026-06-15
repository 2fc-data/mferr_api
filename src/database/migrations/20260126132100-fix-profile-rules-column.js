'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableNames = await queryInterface.showAllTables();

    // Handle table renaming singular -> plural if needed (to match project standard)
    if (tableNames.includes('profile_role') && !tableNames.includes('profile_rules')) {
      await queryInterface.renameTable('profile_role', 'profile_rules');
    } else if (tableNames.includes('profile_role') && tableNames.includes('profile_rules')) {
      // Both exist? Unusual, but let's favor plural
      console.warn('Both profile_role and profile_rules exist. Renaming will be skipped for the table.');
    }

    // Now fix the column in profile_rules
    if (tableNames.includes('profile_rules') || (await queryInterface.showAllTables()).includes('profile_rules')) {
      const columns = await queryInterface.describeTable('profile_rules');
      if (columns.role_id) {
        await queryInterface.renameColumn('profile_rules', 'role_id', 'rule_id');
      }
    }

    // If the user REALLY wants singular profile_rule, we check that too
    if (tableNames.includes('profile_rule')) {
      const columns = await queryInterface.describeTable('profile_rule');
      if (columns.role_id) {
        await queryInterface.renameColumn('profile_rule', 'role_id', 'rule_id');
      }
    }
  },

  async down(queryInterface, Sequelize) {
    const tableNames = await queryInterface.showAllTables();

    if (tableNames.includes('profile_rules')) {
      const columns = await queryInterface.describeTable('profile_rules');
      if (columns.rule_id) {
        await queryInterface.renameColumn('profile_rules', 'rule_id', 'role_id');
      }
    }

    // We don't necessarily want to revert table names if they were singular before, 
    // but for completeness of a 'down' migration:
    // (Skipping for now as it might be destructive if not careful)
  }
};

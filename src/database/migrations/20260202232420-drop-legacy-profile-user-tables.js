'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.dropTable('profile_rules');
    await queryInterface.dropTable('user_profiles');
  },

  async down(queryInterface, Sequelize) {
    // Recreating these tables exactly as they were is complex for a rollback script.
    // In a real scenario, we'd define the schema here.
    // For this task, we assume no rollback to legacy schema is needed.
  }
};

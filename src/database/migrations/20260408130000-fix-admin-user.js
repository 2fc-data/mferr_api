'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Update the admin user with correct username (lowercase) and password
    await queryInterface.bulkUpdate('users', 
      {
        username: 'admin',
        password_hash: '$2b$10$7rNavB3YAZHLNGBD.GrUiekzfhOB9/1TyojUYqvi0QdbDyJExYa/q'
      },
      { email: 'admin@admin.com' }
    );
    
    // Also fix the other admin user from seed-initial-data
    await queryInterface.bulkUpdate('users',
      { username: 'admin' },
      { email: 'admin@mferr.com' }
    );
  },

  async down(queryInterface, Sequelize) {
  }
};

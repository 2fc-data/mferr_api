'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const userId = await queryInterface.bulkInsert('users', [
      {
        name: 'Admin',
        username: 'admin',
        document: '00000000000',
        email: 'admin@admin.com',
        password_hash: '$2b$10$7rNavB3YAZHLNGBD.GrUiekzfhOB9/1TyojUYqvi0QdbDyJExYa/q',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    // Relate the user with the Administrador profile (ID: 1)
    return queryInterface.bulkInsert('user_profiles', [
      {
        user_id: userId,
        profile_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user_profiles', { profile_id: 1 }, {});
    return queryInterface.bulkDelete('users', { username: 'admin' }, {});
  }
};

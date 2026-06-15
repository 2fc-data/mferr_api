'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Columns deleted_at already exist via commonFields in initial migration.
    // We only need to add the composite index to causes.
    
    try {
      await queryInterface.addIndex('causes', ['is_active', 'city_id', 'court_id'], {
        name: 'idx_causes_active_location'
      });
    } catch (e) {
      console.log('Index idx_causes_active_location might already exist, skipping...');
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.removeIndex('causes', 'idx_causes_active_location');
    } catch (e) {}
  }
};

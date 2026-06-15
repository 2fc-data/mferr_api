'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Get Admin Profile ID
    const [profiles] = await queryInterface.sequelize.query(
      "SELECT id FROM profiles WHERE name = 'Administrador' LIMIT 1;"
    );

    if (!profiles || !profiles.length) {
      console.warn('Profile "Administrador" not found. Skipping seed.');
      return;
    }
    const adminProfileId = profiles[0].id;

    // 2. Get All Rules
    const [rules] = await queryInterface.sequelize.query(
      "SELECT id FROM rules;"
    );

    if (!rules || rules.length === 0) {
      console.warn('No rules found. Skipping seed.');
      return;
    }

    // 3. Prepare Bulk Insert Data
    // Check if relationships already exist to avoid duplicates
    const [existing] = await queryInterface.sequelize.query(
      `SELECT rule_id FROM profile_rules WHERE profile_id = ${adminProfileId}`
    );
    const existingRuleIds = new Set(existing.map(r => r.rule_id));

    const profileRulesData = rules
      .filter(rule => !existingRuleIds.has(rule.id))
      .map(rule => ({
        profile_id: adminProfileId,
        rule_id: rule.id,
        created_at: new Date()
      }));

    if (profileRulesData.length === 0) {
      console.log('Admin profile already has all rules.');
      return;
    }

    // 4. Insert
    await queryInterface.bulkInsert('profile_rules', profileRulesData);
  },

  async down(queryInterface, Sequelize) {
    const [profiles] = await queryInterface.sequelize.query(
      "SELECT id FROM profiles WHERE name = 'Administrador' LIMIT 1;"
    );
    if (!profiles.length) return;
    const adminProfileId = profiles[0].id;

    // Determine created_at > now? Hard to rollback specifically these inserts if mixed.
    // Ideally we assume this script manages ALL admin rules or we just delete all for admin.
    // For safety in dev, deleting all rules for admin profile is probably what we want if we rollback this specific "seed admin rules" task.
    await queryInterface.bulkDelete('profile_rules', { profile_id: adminProfileId });
  }
};

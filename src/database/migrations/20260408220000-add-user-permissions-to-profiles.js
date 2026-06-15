const { DataTypes } = require('sequelize');

module.exports = {
  async up(queryInterface, Sequelize) {
    const profilesResult = await queryInterface.sequelize.query(
      `SELECT id, name FROM profiles WHERE name IN ('Cliente', 'Colaborador', 'Admin', 'Gerente')`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    const rulesResult = await queryInterface.sequelize.query(
      `SELECT id, name FROM rules`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (!Array.isArray(profilesResult) || profilesResult.length === 0) {
      console.log('No profiles found');
      return;
    }

    if (!Array.isArray(rulesResult) || rulesResult.length === 0) {
      console.log('No rules found');
      return;
    }

    const rulesMap = {};
    rulesResult.forEach(r => rulesMap[r.name] = r.id);

    const profileIdMap = {};
    profilesResult.forEach(p => profileIdMap[p.name] = p.id);

    const profileRulesToAdd = [];

    // Cliente (id 4) - precisa ver usuários para editar próprios dados
    if (profileIdMap['Cliente'] && rulesMap['users.view']) {
      profileRulesToAdd.push({
        profile_id: profileIdMap['Cliente'],
        rule_id: rulesMap['users.view'],
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    // Colaborador (id 3) - precisa ver e editar usuários
    if (profileIdMap['Colaborador'] && rulesMap['users.view']) {
      profileRulesToAdd.push({
        profile_id: profileIdMap['Colaborador'],
        rule_id: rulesMap['users.view'],
        created_at: new Date(),
        updated_at: new Date()
      });
    }
    if (profileIdMap['Colaborador'] && rulesMap['users.edit']) {
      profileRulesToAdd.push({
        profile_id: profileIdMap['Colaborador'],
        rule_id: rulesMap['users.edit'],
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    if (profileRulesToAdd.length > 0) {
      await queryInterface.bulkInsert('profile_rules', profileRulesToAdd, { ignoreDuplicates: true });
      console.log('Profile rules added successfully');
    }
  },

  async down(queryInterface, Sequelize) {
    // Não faz nada - dados de permissão são importantes demais para remover
  }
};
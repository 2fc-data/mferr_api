'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Perfis padrão
    await queryInterface.bulkInsert('profiles', [
      { id: 1, name: 'Administrador', description: 'Acesso total ao sistema' },
      { id: 2, name: 'Gerente', description: 'Gerenciamento de processos e usuários' },
      { id: 3, name: 'Colaborador', description: 'Acesso operacional' },
      { id: 4, name: 'Cliente', description: 'Acesso limitado aos seus processos' },
    ]);

    // Rules padrão
    await queryInterface.bulkInsert('rules', [
      { name: 'dashboard.view', description: 'Visualizar dashboard' },
      { name: 'users.view', description: 'Visualizar usuários' },
      { name: 'users.create', description: 'Criar usuários' },
      { name: 'users.edit', description: 'Editar usuários' },
      { name: 'users.delete', description: 'Excluir usuários' },
      { name: 'causes.view', description: 'Visualizar processos' },
      { name: 'causes.create', description: 'Criar processos' },
      { name: 'causes.edit', description: 'Editar processos' },
      { name: 'causes.delete', description: 'Excluir processos' },
      { name: 'reports.view', description: 'Visualizar relatórios' },
      { name: 'settings.manage', description: 'Gerenciar configurações' },
    ]);

    // Status padrão
    await queryInterface.bulkInsert('status', [
      { name: 'Ativo', description: 'Processo em andamento' },
      { name: 'Suspenso', description: 'Processo temporariamente suspenso' },
      { name: 'Arquivado', description: 'Processo arquivado' },
      { name: 'Concluído', description: 'Processo finalizado' },
    ]);

    // Estágios padrão
    await queryInterface.bulkInsert('stages', [
      { name: 'Inicial', description: 'Fase inicial do processo' },
      { name: 'Instrução', description: 'Fase de instrução processual' },
      { name: 'Sentença', description: 'Fase de sentença' },
      { name: 'Recurso', description: 'Fase recursal' },
      { name: 'Execução', description: 'Fase de execução' },
    ]);

    // Resultados padrão
    await queryInterface.bulkInsert('outcomes', [
      { name: 'Procedente', description: 'Pedido totalmente procedente - Vitória total' },
      { name: 'Improcedente', description: 'Pedido improcedente - Derrota (quando o escritório representa o autor)' },
      { name: 'Parcialmente Procedente', description: 'Pedido parcialmente procedente - Vitória parcial' },
      { name: 'Procedente para a Defesa', description: 'Vitória total quando o escritório representa o réu' },
      { name: 'Acordo', description: 'Acordo entre as partes - Sem vencedor definido' },
      { name: 'Desistência', description: 'Desistência da ação pelo cliente' },
      { name: 'Extinção sem Julgamento', description: 'Processo extinto por questões processuais' },
      { name: 'Em Recurso', description: 'Aguardando julgamento de recurso' },
    ]);

    // Create Admin User
    const bcrypt = require('bcrypt');
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash('admin123', salt);

    await queryInterface.bulkInsert('users', [{
      name: 'Administrador',
      username: 'admin',
      email: 'admin@mferr.com',
      password_hash: password_hash,
      document: '00000000000',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    }]);

    // Get Admin Profile ID (assuming it's ID 1 from the insert above, but safer to subquery if needed. 
    // consistently 1 if fresh db. Let's assume 1 for this seed script or fetch it if purely SQL).
    // Simple approach: Assume ID 1 as it is the first insert.
    await queryInterface.bulkInsert('user_profiles', [{
      user_id: 1,
      profile_id: 1, // Administrador
      created_at: new Date(),
      updated_at: new Date()
    }]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user_profiles', null, {});
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('outcomes', null, {});
    await queryInterface.bulkDelete('stages', null, {});
    await queryInterface.bulkDelete('status', null, {});
    await queryInterface.bulkDelete('rules', null, {});
    await queryInterface.bulkDelete('profiles', null, {});
  }
};

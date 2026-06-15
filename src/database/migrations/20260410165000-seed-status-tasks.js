'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    
    // Helper to add common tasks
    const tasks = [
      // Distribuído (ID 33)
      { status_id: 33, description: 'Conferir recolhimento de custas processuais', is_required: true, order_index: 1 },
      { status_id: 33, description: 'Verificar protocolo e número do processo gerado', is_required: true, order_index: 2 },
      { status_id: 33, description: 'Digitalizar e anexar documentos pendentes ao PJE', is_required: false, order_index: 3 },
      
      // Citação expedida (ID 37)
      { status_id: 37, description: 'Acompanhar retorno do AR ou mandado do Oficial de Justiça', is_required: true, order_index: 1 },
      { status_id: 37, description: 'Manifestar sobre citação negativa (se houver)', is_required: true, order_index: 2 },
      { status_id: 37, description: 'Peticionar novo endereço ou citação por edital se necessário', is_required: false, order_index: 3 },
      
      // Contestação Apresentada (ID 38)
      { status_id: 38, description: 'Analisar preliminares e mérito da defesa apresentada', is_required: true, order_index: 1 },
      { status_id: 38, description: 'Conferir documentos anexados pela parte ré', is_required: true, order_index: 2 },
      { status_id: 38, description: 'Preparar roteiro para réplica e impugnação aos documentos', is_required: false, order_index: 3 },
      
      // Réplica (ID 39)
      { status_id: 39, description: 'Impugnar especificamente as preliminares da ré', is_required: true, order_index: 1 },
      { status_id: 39, description: 'Reiterar pedidos da inicial e provas pretendidas', is_required: true, order_index: 2 },
      { status_id: 39, description: 'Protocolar réplica dentro do prazo fatal', is_required: true, order_index: 3 },
      
      // Conclusos para Sentença (ID 48)
      { status_id: 48, description: 'Verificar se todas as provas requeridas foram produzidas', is_required: true, order_index: 1 },
      { status_id: 48, description: 'Acompanhar se houve nova juntada de documento peticionado', is_required: true, order_index: 2 },
      { status_id: 48, description: 'Monitorar publicação de sentença no Diário Oficial', is_required: true, order_index: 3 },
    ];

    await queryInterface.bulkInsert('status_tasks', tasks.map(t => ({
      ...t,
      created_at: now,
      updated_at: now
    })));
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('status_tasks', null, {});
  }
};

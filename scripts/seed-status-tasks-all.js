'use strict';

const { Sequelize } = require('sequelize');
require('dotenv').config();

async function seedStatusTasks() {
  const sequelize = new Sequelize({
    dialect: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    database: process.env.DB_NAME || 'legal_office',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    logging: false,
  });

  try {
    await sequelize.authenticate();
    console.log('Connected to database');

    // Get all statuses
    const [statuses] = await sequelize.query('SELECT id, name, stage_id FROM status ORDER BY id');
    console.log(`Found ${statuses.length} statuses`);

    if (statuses.length === 0) {
      console.log('No statuses found. Please run the main seed first.');
      process.exit(1);
    }

    // Tasks templates per workflow stage (based on advogado-especialista skill)
    const taskTemplates = {
      // Stage 1: Initial / Distribution
      'Inicial': [
        { description: 'Conferir distribuição e protocolo do processo', is_required: true },
        { description: 'Verificar competência do juízo', is_required: true },
        { description: 'Analisar petition inicial e documentos', is_required: true },
        { description: 'Verificar legitimidade das partes', is_required: false },
        { description: 'Preparar wz de ciência da distribuição', is_required: false },
      ],
      // Stage 2: Diligências / Expeditions
      'Diligências': [
        { description: 'Acompanhar expedição de notificação/citação', is_required: true },
        { description: 'Verificar recebimento pelo correio/AR', is_required: true },
        { description: 'Conferir prazo para manifestação', is_required: true },
        { description: 'Verificar existência de advogado da parte contrária', is_required: false },
        { description: 'Atualizar sistema de controle de prazos', is_required: true },
      ],
      // Stage 3: Sentença / Decision
      'Sentença': [
        { description: 'Verificar conclusão para decisão', is_required: true },
        { description: 'Analisar decisão e seus fundamentos', is_required: true },
        { description: 'Verificar honoráriossucumbenciais', is_required: true },
        { description: 'Preparar estratégia de recurso', is_required: false },
        { description: 'Monitorar publicação no Diário Oficial', is_required: true },
      ],
      // Stage 4: Recurso / Appeal
      'Recurso': [
        { description: 'Verificar necessidade deapelação', is_required: true },
        { description: 'Preparar razões de recurso', is_required: true },
        { description: 'Conferir preparo e recolhimento de custas', is_required: true },
        { description: 'Protocolar recurso no prazo', is_required: true },
        { description: 'Acompanhar distribuição no tribunal', is_required: false },
      ],
      // Stage 5: Arquivado / Closed
      'Arquivado': [
        { description: 'Verificar baixa definitiva', is_required: true },
        { description: 'Conferir arquivamento correto', is_required: true },
        { description: 'Atualizar status de archived', is_required: true },
        { description: 'Verificar pendências financeiras', is_required: false },
        { description: 'Preparar relatório de fechamento', is_required: false },
      ],
    };

    // Default tasks for unknown stages
    const defaultTasks = [
      { description: 'Verificar andamentodo processo', is_required: true },
      { description: 'Atualizar dados no sistema', is_required: true },
      { description: 'Conferir prazos vigentes', is_required: true },
      { description: 'Verificar documentos pendentes', is_required: false },
      { description: 'Preparar relatório de status', is_required: false },
    ];

    const tasksToInsert = [];
    const now = new Date();

    for (const status of statuses) {
      // Get stage name (need to query stages table)
      let stageName = 'Default';
      try {
        const [stages] = await sequelize.query(`SELECT name FROM stages WHERE id = ${status.stage_id}`);
        if (stages.length > 0) {
          stageName = stages[0].name;
        }
      } catch (e) {
        console.log('Could not get stage name, using default');
      }

      const template = taskTemplates[stageName] || defaultTasks;

      template.forEach((task, index) => {
        tasksToInsert.push({
          status_id: status.id,
          description: task.description,
          is_required: task.is_required,
          order_index: index + 1,
          created_at: now,
          updated_at: now,
        });
      });

      console.log(`Added ${template.length} tasks for status: ${status.name} (ID: ${status.id})`);
    }

    // Clear existing tasks
    await sequelize.query('DELETE FROM status_tasks');
    for (const task of tasksToInsert) {
      await sequelize.query(
        `INSERT INTO status_tasks (status_id, description, is_required, order_index, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)`,
        {
          replacements: [
            task.status_id,
            task.description,
            task.is_required,
            task.order_index,
            task.created_at,
            task.updated_at
          ]
        }
      );
    }

    console.log(`\n✅ Successfully created ${tasksToInsert.length} status_tasks`);
    console.log('Tasks are now available in the filters for tracking bottlenecks');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

seedStatusTasks();
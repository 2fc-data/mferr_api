'use strict';

/**
 * Migration: Adiciona coluna `is_default` às tabelas stages, status e outcomes.
 *
 * Garante que exatamente 1 registro por tabela seja marcado como default:
 *   - stages:   "Inicial"                → is_default = true
 *   - status:   "Petição Em Elaboração"   → is_default = true
 *   - outcomes: "Em Aberto"              → is_default = true
 *
 * Também garante que os registros existam (UPSERT) com nomes em Title Case.
 */

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // ============================================================
    // STEP 1: Adicionar coluna is_default nas 3 tabelas
    // ============================================================
    const tables = ['stages', 'status', 'outcomes'];

    for (const table of tables) {
      const tableDesc = await queryInterface.describeTable(table);
      if (!tableDesc.is_default) {
        await queryInterface.addColumn(table, 'is_default', {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
          allowNull: false,
        });
      }
    }

    // ============================================================
    // STEP 2: Garantir que todos os defaults sejam false primeiro
    // ============================================================
    await queryInterface.sequelize.query(`UPDATE stages SET is_default = false`);
    await queryInterface.sequelize.query(`UPDATE status SET is_default = false`);
    await queryInterface.sequelize.query(`UPDATE outcomes SET is_default = false`);

    // ============================================================
    // STEP 3: UPSERT - Garantir que os registros default existam
    // ============================================================

    // --- STAGE: "Inicial" ---
    const [existingStage] = await queryInterface.sequelize.query(
      `SELECT id FROM stages WHERE LOWER(name) LIKE '%inicial%' AND deleted_at IS NULL LIMIT 1`
    );
    if (existingStage.length > 0) {
      // Atualizar nome para Title Case e marcar como default
      await queryInterface.sequelize.query(
        `UPDATE stages SET name = 'Inicial', description = 'Fase inicial do processo', is_default = true WHERE id = ${existingStage[0].id}`
      );
    } else {
      // Inserir novo registro
      await queryInterface.bulkInsert('stages', [{
        name: 'Inicial',
        description: 'Fase inicial do processo',
        is_default: true,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      }]);
    }

    // Buscar o ID da stage "Inicial" para vincular ao status default
    const [initialStage] = await queryInterface.sequelize.query(
      `SELECT id FROM stages WHERE is_default = true LIMIT 1`
    );
    const initialStageId = initialStage[0]?.id;

    // --- STATUS: "Petição Em Elaboração" ---
    const [existingStatus] = await queryInterface.sequelize.query(
      `SELECT id FROM status WHERE (LOWER(name) LIKE '%elabora%' OR LOWER(name) LIKE '%petição%elabor%' OR LOWER(name) LIKE '%peticao%elabor%') AND deleted_at IS NULL LIMIT 1`
    );
    if (existingStatus.length > 0) {
      await queryInterface.sequelize.query(
        `UPDATE status SET name = 'Petição Em Elaboração', description = 'Elaborando Petição', is_default = true, stage_id = ${initialStageId} WHERE id = ${existingStatus[0].id}`
      );
    } else {
      await queryInterface.bulkInsert('status', [{
        name: 'Petição Em Elaboração',
        description: 'Elaborando Petição',
        is_default: true,
        is_active: true,
        stage_id: initialStageId,
        created_at: new Date(),
        updated_at: new Date(),
      }]);
    }

    // --- OUTCOME: "Em Aberto" ---
    const [existingOutcome] = await queryInterface.sequelize.query(
      `SELECT id FROM outcomes WHERE LOWER(name) LIKE '%aberto%' AND deleted_at IS NULL LIMIT 1`
    );
    if (existingOutcome.length > 0) {
      await queryInterface.sequelize.query(
        `UPDATE outcomes SET name = 'Em Aberto', description = 'Processo sem resultado definido', is_default = true WHERE id = ${existingOutcome[0].id}`
      );
    } else {
      await queryInterface.bulkInsert('outcomes', [{
        name: 'Em Aberto',
        description: 'Processo sem resultado definido',
        is_default: true,
        is_active: true,
        status_id: null,
        created_at: new Date(),
        updated_at: new Date(),
      }]);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('stages', 'is_default');
    await queryInterface.removeColumn('status', 'is_default');
    await queryInterface.removeColumn('outcomes', 'is_default');
  }
};

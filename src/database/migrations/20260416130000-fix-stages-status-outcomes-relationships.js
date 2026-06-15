'use strict';

/**
 * Migration: Correção dos relacionamentos entre stages, status, status_tasks e outcomes
 * 
 * Problemas corrigidos:
 * 1. Remove 305 status_tasks genéricos duplicados (tarefas idênticas para todos os status)
 * 2. Corrige stage_id NULL do status #69 (Suspenso - Testemunha/Prova Indisponível → Instrução)
 * 3. Corrige mapeamentos incorretos dos Outcomes (Ganho, Em aberto, Perdido)
 * 4. Restaura Outcomes essenciais removidos (Acordo, Desistência) conforme CPC
 * 
 * Fundamentação jurídica:
 * - Art. 487, I CPC: Resolução do mérito (Ganho/Perdido)
 * - Art. 487, III, b CPC: Homologação de acordo (Acordo)
 * - Art. 485, VIII CPC: Desistência da ação
 * - Art. 361-381 CPC: Fase de instrução (testemunha/prova)
 */

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // ============================================================
    // CORREÇÃO 1: Remover status_tasks genéricos duplicados
    // ============================================================
    // O seed antigo (seed-status-tasks-all.js) criou 5 tarefas genéricas idênticas
    // para TODOS os status. A migration 20260416100000 já criou tarefas específicas.
    // Resultado: cada status ficou com 10 tarefas (5 genéricas + 5 específicas).
    // As genéricas são inúteis e possuem typo ("andamentodo" sem espaço).
    await queryInterface.sequelize.query(`
      DELETE FROM status_tasks 
      WHERE description IN (
        'Verificar andamentodo processo',
        'Atualizar dados no sistema', 
        'Conferir prazos vigentes',
        'Verificar documentos pendentes',
        'Preparar relatório de status'
      )
    `);

    // ============================================================
    // CORREÇÃO 2: Corrigir stage_id NULL do status #69
    // ============================================================
    // "Suspenso - Testemunha/Prova Indisponível" é incidente da fase de Instrução.
    // Conforme Art. 361-381 CPC, produção de prova é ato instrutório.
    // stage_id=2 = "4 - Instrução"
    await queryInterface.sequelize.query(`
      UPDATE status SET stage_id = 2 WHERE id = 69 AND stage_id IS NULL
    `);

    // ============================================================
    // CORREÇÃO 3: Corrigir mapeamentos dos Outcomes
    // ============================================================

    // "Ganho" (id=9): Estava apontando para Homologação de Transação (id=82).
    // Transação é acordo, não vitória. "Ganho" = sentença favorável.
    // Correto: Extinção - Com Resolução do Mérito (id=86) — Art. 487, I CPC
    await queryInterface.sequelize.query(`
      UPDATE outcomes SET status_id = 86 WHERE id = 9
    `);

    // "Perdido" (id=11): Estava apontando para Trânsito em Julgado (id=88).
    // Trânsito em julgado é consequência, não resultado. Pode ser ganho ou perdido.
    // Correto: Extinção - Sentença Proferida (id=85) — mesma lógica do "Ganho"
    await queryInterface.sequelize.query(`
      UPDATE outcomes SET status_id = 85 WHERE id = 11
    `);

    // "Em aberto" (id=12): Estava apontando para Conclusos para despacho (id=31).
    // "Em aberto" significa que o processo não tem resultado definido ainda.
    // Não faz sentido vincular a um status específico.
    // Correto: status_id = NULL (ausência de resultado)
    await queryInterface.sequelize.query(`
      UPDATE outcomes SET status_id = NULL WHERE id = 12
    `);

    // ============================================================
    // CORREÇÃO 4: Restaurar Outcomes essenciais
    // ============================================================

    // Verificar se já existem antes de inserir
    const [existingAcordo] = await queryInterface.sequelize.query(
      `SELECT id FROM outcomes WHERE name = 'Acordo'`
    );
    if (existingAcordo.length === 0) {
      // Acordo — Art. 487, III, b CPC: Homologação de transação/acordo
      // Status: Extinção - Extinto por Acordo (id=81)
      await queryInterface.bulkInsert('outcomes', [{
        name: 'Acordo',
        description: 'Acordo entre as partes homologado judicialmente - Art. 487, III, b CPC',
        status_id: 81,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      }]);
    }

    const [existingDesistencia] = await queryInterface.sequelize.query(
      `SELECT id FROM outcomes WHERE name = 'Desistência'`
    );
    if (existingDesistencia.length === 0) {
      // Desistência — Art. 485, VIII CPC: Desistência da ação pelo autor
      // Status: Extinção - Homologada Desistência (id=80)
      await queryInterface.bulkInsert('outcomes', [{
        name: 'Desistência',
        description: 'Desistência da ação pelo autor - Art. 485, VIII CPC',
        status_id: 80,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      }]);
    }
  },

  async down(queryInterface, Sequelize) {
    const now = new Date();

    // Reverter Correção 4: Remover outcomes restaurados
    await queryInterface.sequelize.query(`
      DELETE FROM outcomes WHERE name IN ('Acordo', 'Desistência') 
      AND id NOT IN (5, 6) -- Proteger IDs originais se existirem
    `);

    // Reverter Correção 3: Restaurar mapeamentos originais
    await queryInterface.sequelize.query(`UPDATE outcomes SET status_id = 82 WHERE id = 9`);
    await queryInterface.sequelize.query(`UPDATE outcomes SET status_id = 88 WHERE id = 11`);
    await queryInterface.sequelize.query(`UPDATE outcomes SET status_id = 31 WHERE id = 12`);

    // Reverter Correção 2: Remover stage_id do status #69
    await queryInterface.sequelize.query(`UPDATE status SET stage_id = NULL WHERE id = 69`);

    // Reverter Correção 1: Reinserir tarefas genéricas é complexo e desnecessário
    // As tarefas genéricas não tinham valor jurídico e continham typo
    // Não reversível por design
  },
};

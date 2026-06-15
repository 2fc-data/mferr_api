'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    
    const tasks = [
      // ===== FASE INICIAL =====
      // 33 - Distribuído
      { status_id: 33, description: 'Verificar recolhimento de custas processuais', is_required: true, order_index: 1 },
      { status_id: 33, description: 'Conferir protocolo e número do processo gerado', is_required: true, order_index: 2 },
      { status_id: 33, description: 'Digitalizar e anexar documentos iniciais ao PJE', is_required: false, order_index: 3 },
      { status_id: 33, description: 'Verificar competência da vara', is_required: false, order_index: 4 },
      { status_id: 33, description: 'Preparar petição inicial complementar se necessário', is_required: false, order_index: 5 },
      
      // 32 - Despacho Inicial
      { status_id: 32, description: 'Verificar pedido de tutela de urgência', is_required: true, order_index: 1 },
      { status_id: 32, description: 'Analisar documentos aportados', is_required: true, order_index: 2 },
      { status_id: 32, description: 'Preparar citação do réu', is_required: true, order_index: 3 },
      { status_id: 32, description: 'Verificar requerimentos de prova', is_required: false, order_index: 4 },
      { status_id: 32, description: 'Mapear questões processuais preliminares', is_required: false, order_index: 5 },
      
      // 37 - Citação expedida
      { status_id: 37, description: 'Acompanhar retorno do AR ou mandado do Oficial de Justiça', is_required: true, order_index: 1 },
      { status_id: 37, description: 'Verificar citação negativa', is_required: true, order_index: 2 },
      { status_id: 37, description: 'Peticionar novo endereço ou citação por edital se necessário', is_required: false, order_index: 3 },
      { status_id: 37, description: 'Preparar tutela de urgência se houver risco', is_required: false, order_index: 4 },
      { status_id: 37, description: 'Mapear estratégia de defesa', is_required: false, order_index: 5 },
      
      // 36 - Citação cumprida
      { status_id: 36, description: 'Registrar prazo para contestação', is_required: true, order_index: 1 },
      { status_id: 36, description: 'Verificar documentos recebidos', is_required: true, order_index: 2 },
      { status_id: 36, description: 'Preparar defesa/impugnação', is_required: true, order_index: 3 },
      { status_id: 36, description: 'Mapear preliminar e mérito', is_required: false, order_index: 4 },
      { status_id: 36, description: 'Solicitar documentos do cliente', is_required: false, order_index: 5 },
      
      // 30 - Aguardando citação
      { status_id: 30, description: 'Verificar endereço do réu', is_required: true, order_index: 1 },
      { status_id: 30, description: 'Acompanhar expedição de mandato', is_required: true, order_index: 2 },
      { status_id: 30, description: 'Peticionar citação por edital se necessário', is_required: false, order_index: 3 },
      { status_id: 30, description: 'Monitorar sistema', is_required: false, order_index: 4 },
      { status_id: 30, description: 'Preparar tutela de urgência se aplicável', is_required: false, order_index: 5 },
      
      // 57 - Intimação para Pagamento
      { status_id: 57, description: 'Verificar valor cobrado', is_required: true, order_index: 1 },
      { status_id: 57, description: 'Apresentar impugnação se discordar', is_required: true, order_index: 2 },
      { status_id: 57, description: 'Negociar parcelamento', is_required: false, order_index: 3 },
      { status_id: 57, description: 'Preparar cumprimento voluntário', is_required: false, order_index: 4 },
      { status_id: 57, description: 'Verificar prescrição', is_required: false, order_index: 5 },
      
      // ===== FASE DE INSTRUÇÃO =====
      // 38 - Contestação Apresentada
      { status_id: 38, description: 'Analisar preliminares e mérito da defesa', is_required: true, order_index: 1 },
      { status_id: 38, description: 'Conferir documentos anexados pela parte ré', is_required: true, order_index: 2 },
      { status_id: 38, description: 'Preparar roteiro para réplica', is_required: true, order_index: 3 },
      { status_id: 38, description: 'Mapear teses de impugnação', is_required: false, order_index: 4 },
      { status_id: 38, description: 'Verificar documentos necessários', is_required: false, order_index: 5 },
      
      // 39 - Réplica
      { status_id: 39, description: 'Impugnar especificamente as preliminares da ré', is_required: true, order_index: 1 },
      { status_id: 39, description: 'Reiterar pedidos da inicial e provas pretendidas', is_required: true, order_index: 2 },
      { status_id: 39, description: 'Protocolar réplica dentro do prazo fatal', is_required: true, order_index: 3 },
      { status_id: 39, description: 'Refutar documentos da defesa', is_required: false, order_index: 4 },
      { status_id: 39, description: 'Acompanhar prazo de provas', is_required: false, order_index: 5 },
      
      // 43 - Audiência Designada
      { status_id: 43, description: 'Preparar rol de testemunhas', is_required: true, order_index: 1 },
      { status_id: 43, description: 'Organizar documentos para audiência', is_required: true, order_index: 2 },
      { status_id: 43, description: 'Verificar necessidade de perito', is_required: false, order_index: 3 },
      { status_id: 43, description: 'Preparar perguntas para oitiva', is_required: false, order_index: 4 },
      { status_id: 43, description: 'Confirmar presença do cliente', is_required: false, order_index: 5 },
      
      // 63 - Audiência Realizada
      { status_id: 63, description: 'Verificar ata de audiência', is_required: true, order_index: 1 },
      { status_id: 63, description: 'Acompanhar resultado das provas', is_required: true, order_index: 2 },
      { status_id: 63, description: 'Protocolar requerimentos remanescentes', is_required: false, order_index: 3 },
      { status_id: 63, description: 'Verificar datas de diligências', is_required: false, order_index: 4 },
      { status_id: 63, description: 'Preparar Alegações Finais', is_required: false, order_index: 5 },
      
      // 47 - Prova Pericial
      { status_id: 47, description: 'Acompanhar nomeação do perito', is_required: true, order_index: 1 },
      { status_id: 47, description: 'Definir quesitos técnicos', is_required: true, order_index: 2 },
      { status_id: 47, description: 'Contratar assistente técnico', is_required: true, order_index: 3 },
      { status_id: 47, description: 'Participar da inspeção judicial', is_required: false, order_index: 4 },
      { status_id: 47, description: 'Apresentar laudo pericial', is_required: false, order_index: 5 },
      
      // 45 - Aguardando Laudo
      { status_id: 45, description: 'Verificar prazo do perito', is_required: true, order_index: 1 },
      { status_id: 45, description: 'Preparar quesitos complementares', is_required: true, order_index: 2 },
      { status_id: 45, description: 'Acionar assistente técnico', is_required: true, order_index: 3 },
      { status_id: 45, description: 'Acompanhar publicação do laudo', is_required: false, order_index: 4 },
      { status_id: 45, description: 'Preparar impugnação ao laudo', is_required: false, order_index: 5 },
      
      // 42 - Processo Saneado
      { status_id: 42, description: 'Verificar decisões saneadoras', is_required: true, order_index: 1 },
      { status_id: 42, description: 'Mapear questões de fato e direito', is_required: true, order_index: 2 },
      { status_id: 42, description: 'Preparar julgamento do mérito', is_required: true, order_index: 3 },
      { status_id: 42, description: 'Ajustar estratégia processual', is_required: false, order_index: 4 },
      { status_id: 42, description: 'Consolidar teses principais', is_required: false, order_index: 5 },
      
      // 46 - Juntada de documentos
      { status_id: 46, description: 'Verificar documentos juntados', is_required: true, order_index: 1 },
      { status_id: 46, description: 'Analisar impacto no processo', is_required: true, order_index: 2 },
      { status_id: 46, description: 'Protocolar manifestação se necessário', is_required: false, order_index: 3 },
      { status_id: 46, description: 'Mapear novas provas', is_required: false, order_index: 4 },
      { status_id: 46, description: 'Acompanhar prazo para manifestação', is_required: false, order_index: 5 },
      
      // 34 - Petição Protocolada
      { status_id: 34, description: 'Verificar teor da petição', is_required: true, order_index: 1 },
      { status_id: 34, description: 'Acompanhar manifestação da parte contrária', is_required: true, order_index: 2 },
      { status_id: 34, description: 'Mapear impacto processual', is_required: false, order_index: 3 },
      { status_id: 34, description: 'Preparar resposta se necessário', is_required: false, order_index: 4 },
      { status_id: 34, description: 'Registrar novo prazo', is_required: false, order_index: 5 },
      
      // 29 - Petição
      { status_id: 29, description: 'Analisar teor da petição', is_required: true, order_index: 1 },
      { status_id: 29, description: 'Verificar urgência requerida', is_required: true, order_index: 2 },
      { status_id: 29, description: 'Mapear impacto no processo', is_required: false, order_index: 3 },
      { status_id: 29, description: 'Preparar resposta/oposição', is_required: false, order_index: 4 },
      { status_id: 29, description: 'Acompanhar decisão', is_required: false, order_index: 5 },
      
      // 41 - Decisão
      { status_id: 41, description: 'Analisar teor da decisão', is_required: true, order_index: 1 },
      { status_id: 41, description: 'Verificar recurso cabível', is_required: true, order_index: 2 },
      { status_id: 41, description: 'Mapear tese recursal', is_required: false, order_index: 3 },
      { status_id: 41, description: 'Preparar manifestação se necessário', is_required: false, order_index: 4 },
      { status_id: 41, description: 'Acompanhar prazo recursal', is_required: false, order_index: 5 },
      
      // 51 - Contra Razões
      { status_id: 51, description: 'Analisar recursos da parte contrária', is_required: true, order_index: 1 },
      { status_id: 51, description: 'Preparar contrarrazões', is_required: true, order_index: 2 },
      { status_id: 51, description: 'Mapear teses de improcedência', is_required: true, order_index: 3 },
      { status_id: 51, description: 'Protocolar no prazo', is_required: false, order_index: 4 },
      { status_id: 51, description: 'Acompanhar julgamento', is_required: false, order_index: 5 },
      
      // 35 - Aguardando prazo
      { status_id: 35, description: 'Verificar tipo de prazo', is_required: true, order_index: 1 },
      { status_id: 35, description: 'Mapear providências necessárias', is_required: true, order_index: 2 },
      { status_id: 35, description: 'Organizar documentação', is_required: true, order_index: 3 },
      { status_id: 35, description: 'Preparar manifestação', is_required: false, order_index: 4 },
      { status_id: 35, description: 'Monitorar contagem', is_required: false, order_index: 5 },
      
      // ===== FASE DE SENTENÇA =====
      // 40 - Conclusos
      { status_id: 40, description: 'Verificar conclusão ao juiz', is_required: true, order_index: 1 },
      { status_id: 40, description: 'Mapear questões pendentes', is_required: true, order_index: 2 },
      { status_id: 40, description: 'Consolidar teses finais', is_required: true, order_index: 3 },
      { status_id: 40, description: 'Preparar sustentação oral se necessário', is_required: false, order_index: 4 },
      { status_id: 40, description: 'Acompanhar publicação', is_required: false, order_index: 5 },
      
      // 48 - Conclusos para Sentença
      { status_id: 48, description: 'Verificar se todas as provas foram produzidas', is_required: true, order_index: 1 },
      { status_id: 48, description: 'Acompanhar juntada de documentos', is_required: true, order_index: 2 },
      { status_id: 48, description: 'Monitorar publicação de sentença', is_required: true, order_index: 3 },
      { status_id: 48, description: 'Consolidar pedido', is_required: false, order_index: 4 },
      { status_id: 48, description: 'Preparar cumprimento de sentença', is_required: false, order_index: 5 },
      
      // 31 - Conclusos para despacho
      { status_id: 31, description: 'Verificar tipo de conclusão', is_required: true, order_index: 1 },
      { status_id: 31, description: 'Mapear providências solicitadas', is_required: true, order_index: 2 },
      { status_id: 31, description: 'Acompanhar despacho', is_required: false, order_index: 3 },
      { status_id: 31, description: 'Preparar documentação necessária', is_required: false, order_index: 4 },
      { status_id: 31, description: 'Verificar urgência', is_required: false, order_index: 5 },
      
      // 49 - Publicado no Diário
      { status_id: 49, description: 'Verificar teor da publicação', is_required: true, order_index: 1 },
      { status_id: 49, description: 'Mapear recurso cabível', is_required: true, order_index: 2 },
      { status_id: 49, description: 'Calcular prazo recursal', is_required: true, order_index: 3 },
      { status_id: 49, description: 'Preparar recurso se necessário', is_required: false, order_index: 4 },
      { status_id: 49, description: 'Acompanhar trânsito em julgado', is_required: false, order_index: 5 },
      
      // 50 - Acórdão Publicado
      { status_id: 50, description: 'Verificar teor do acórdão', is_required: true, order_index: 1 },
      { status_id: 50, description: 'Mapear recursos cabíveis', is_required: true, order_index: 2 },
      { status_id: 50, description: 'Verificar retratação ou não do tribunal', is_required: true, order_index: 3 },
      { status_id: 50, description: 'Preparar embargos se necessário', is_required: false, order_index: 4 },
      { status_id: 50, description: 'Acompanhar retorno', is_required: false, order_index: 5 },
      
      // 52 - Julgado o Recurso
      { status_id: 52, description: 'Verificar teor do julgado', is_required: true, order_index: 1 },
      { status_id: 52, description: 'Mapear próximos passos', is_required: true, order_index: 2 },
      { status_id: 52, description: 'Verificar transição processual', is_required: true, order_index: 3 },
      { status_id: 52, description: 'Preparar execução se aplicável', is_required: false, order_index: 4 },
      { status_id: 52, description: 'Verificar recursos cabíveis', is_required: false, order_index: 5 },
      
      // ===== FASE RECURSAL =====
      // 53 - Recurso Interposto
      { status_id: 53, description: 'Verificar tipo de recurso', is_required: true, order_index: 1 },
      { status_id: 53, description: 'Mapear preliminar e mérito', is_required: true, order_index: 2 },
      { status_id: 53, description: 'Preparar memorial', is_required: true, order_index: 3 },
      { status_id: 53, description: 'Protocolar no prazo', is_required: false, order_index: 4 },
      { status_id: 53, description: 'Acompanhar admissão', is_required: false, order_index: 5 },
      
      // 54 - Remetido ao Tribunal
      { status_id: 54, description: 'Verificar tramitação no tribunal', is_required: true, order_index: 1 },
      { status_id: 54, description: 'Mapear relatório e voto', is_required: true, order_index: 2 },
      { status_id: 54, description: 'Preparar sustentação oral', is_required: true, order_index: 3 },
      { status_id: 54, description: 'Acompanhar publicação de acórdão', is_required: false, order_index: 4 },
      { status_id: 54, description: 'Verificar retorno dos autos', is_required: false, order_index: 5 },
      
      // ===== FASE DE EXECUÇÃO =====
      // 56 - Cumprimento de Sentença Iniciado
      { status_id: 56, description: 'Verificar cálculos do credor', is_required: true, order_index: 1 },
      { status_id: 56, description: 'Apresentar impugnação se discordar', is_required: true, order_index: 2 },
      { status_id: 56, description: 'Peticionar execução', is_required: true, order_index: 3 },
      { status_id: 56, description: 'Verificar prescrição', is_required: false, order_index: 4 },
      { status_id: 56, description: 'Mapear bens penhoráveis', is_required: false, order_index: 5 },
      
      // 59 - Penhora
      { status_id: 59, description: 'Verificar objeto da penhora', is_required: true, order_index: 1 },
      { status_id: 59, description: 'Apresentar impugnação se necessário', is_required: true, order_index: 2 },
      { status_id: 59, description: 'Acompanhar avaliação do bem', is_required: true, order_index: 3 },
      { status_id: 59, description: 'Verificar recursos', is_required: false, order_index: 4 },
      { status_id: 59, description: 'Mapear defesa', is_required: false, order_index: 5 },
      
      // 58 - Leilão Designado
      { status_id: 58, description: 'Verificar data do leilão', is_required: true, order_index: 1 },
      { status_id: 58, description: 'Avaliar participação no certame', is_required: true, order_index: 2 },
      { status_id: 58, description: 'Verificar lance mínimo', is_required: true, order_index: 3 },
      { status_id: 58, description: 'Mapear estratégia', is_required: false, order_index: 4 },
      { status_id: 58, description: 'Acompanhar hasta pública', is_required: false, order_index: 5 },
      
      // 55 - Bloqueio via Sistema
      { status_id: 55, description: 'Verificar motivo do bloqueio', is_required: true, order_index: 1 },
      { status_id: 55, description: 'Mapear providências para desbloqueio', is_required: true, order_index: 2 },
      { status_id: 55, description: 'Protocolar pedido de desbloqueio', is_required: true, order_index: 3 },
      { status_id: 55, description: 'Acompanhar manifestação', is_required: false, order_index: 4 },
      { status_id: 55, description: 'Verificar urgência processual', is_required: false, order_index: 5 },
      
      // ===== FASE DE SUSPENSÃO =====
      // 73 - Suspenso - Falta de Bens para Penhora
      { status_id: 73, description: 'Verificar situação do devedor', is_required: true, order_index: 1 },
      { status_id: 73, description: 'Mapear novos bens', is_required: true, order_index: 2 },
      { status_id: 73, description: 'Solicitar pesquisas', is_required: true, order_index: 3 },
      { status_id: 73, description: 'Verificar prescrição', is_required: false, order_index: 4 },
      { status_id: 73, description: 'Preparar arquivo', is_required: false, order_index: 5 },
      
      // 66 - Suspenso - Tentativa de Acordo
      { status_id: 66, description: 'Preparar proposta de acordo', is_required: true, order_index: 1 },
      { status_id: 66, description: 'Negociar condições', is_required: true, order_index: 2 },
      { status_id: 66, description: 'Verificar poderes do cliente', is_required: true, order_index: 3 },
      { status_id: 66, description: 'Mapear mediação', is_required: false, order_index: 4 },
      { status_id: 66, description: 'Acompanhar homologação', is_required: false, order_index: 5 },
      
      // 74 - Suspenso - Parcelamento da Dívida
      { status_id: 74, description: 'Verificar condições do parcelamento', is_required: true, order_index: 1 },
      { status_id: 74, description: 'Acompanhar cumprimento', is_required: true, order_index: 2 },
      { status_id: 74, description: 'Mapear inadimplência', is_required: true, order_index: 3 },
      { status_id: 74, description: 'Verificar rescisão', is_required: false, order_index: 4 },
      { status_id: 74, description: 'Preparar retomada', is_required: false, order_index: 5 },
      
      // 2 - Suspenso - Incidente Processual
      { status_id: 2, description: 'Verificar teor do incidente', is_required: true, order_index: 1 },
      { status_id: 2, description: 'Mapear impacto no processo', is_required: true, order_index: 2 },
      { status_id: 2, description: 'Manifestar sobre o incidente', is_required: true, order_index: 3 },
      { status_id: 2, description: 'Acompanhar julgamento', is_required: false, order_index: 4 },
      { status_id: 2, description: 'Verificar suspensão do processo', is_required: false, order_index: 5 },
      
      // 65 - Suspenso - Aguardando Decisão de Processo
      { status_id: 65, description: 'Verificar processo dependente', is_required: true, order_index: 1 },
      { status_id: 65, description: 'Mapear decisão esperada', is_required: true, order_index: 2 },
      { status_id: 65, description: 'Acompanhar tramitação', is_required: true, order_index: 3 },
      { status_id: 65, description: 'Verificar prescrição', is_required: false, order_index: 4 },
      { status_id: 65, description: 'Mapear próximos passos', is_required: false, order_index: 5 },
      
      // 67 - Suspenso - Esperando Resultado de Perícia
      { status_id: 67, description: 'Verificar prazo do laudo', is_required: true, order_index: 1 },
      { status_id: 67, description: 'Acompanhar conclusão pericial', is_required: true, order_index: 2 },
      { status_id: 67, description: 'Verificar Quesitos', is_required: true, order_index: 3 },
      { status_id: 67, description: 'Mapear impugnação se necessário', is_required: false, order_index: 4 },
      { status_id: 67, description: 'Preparar manifestação', is_required: false, order_index: 5 },
      
      // 68 - Suspenso - Dependência de Documento Essencial
      { status_id: 68, description: 'Mapear documento necessário', is_required: true, order_index: 1 },
      { status_id: 68, description: 'Solicitar documento ao cliente', is_required: true, order_index: 2 },
      { status_id: 68, description: 'Acompanhar entrega', is_required: true, order_index: 3 },
      { status_id: 68, description: 'Protocolar documento', is_required: false, order_index: 4 },
      { status_id: 68, description: 'Verificar cumprimento', is_required: false, order_index: 5 },
      
      // 69 - Suspenso - Testemunha/Prova Indisponível
      { status_id: 69, description: 'Verificar motivo da indisponibilidade', is_required: true, order_index: 1 },
      { status_id: 69, description: 'Mapear alternativa de prova', is_required: true, order_index: 2 },
      { status_id: 69, description: 'Preparar substituição', is_required: true, order_index: 3 },
      { status_id: 69, description: 'Acompanhar disponibilidade', is_required: false, order_index: 4 },
      { status_id: 69, description: 'Protocolar requerimento', is_required: false, order_index: 5 },
      
      // 70 - Suspense - Processo Sobrestado por Decisão Superior
      { status_id: 70, description: 'Verificar teor da decisão', is_required: true, order_index: 1 },
      { status_id: 70, description: 'Mapear tese repetitiva', is_required: true, order_index: 2 },
      { status_id: 70, description: 'Acompanhar julgamento', is_required: true, order_index: 3 },
      { status_id: 70, description: 'Preparar impugnação se necessário', is_required: false, order_index: 4 },
      { status_id: 70, description: 'Verificar Impacts', is_required: false, order_index: 5 },
      
      // 71 - Suspenso - Aguardando Julgamento de Tema Repetitivo
      { status_id: 71, description: 'Verificar tema repetitivo', is_required: true, order_index: 1 },
      { status_id: 71, description: 'Mapear tese aplicável', is_required: true, order_index: 2 },
      { status_id: 71, description: 'Acompanhar julgamento', is_required: true, order_index: 3 },
      { status_id: 71, description: 'Preparar impugnação', is_required: false, order_index: 4 },
      { status_id: 71, description: 'Verificar repercussão', is_required: false, order_index: 5 },
      
      // 72 - Suspenso - Devedor não Encontrado
      { status_id: 72, description: 'Verificar endereço do devedor', is_required: true, order_index: 1 },
      { status_id: 72, description: 'Solicitar pesquisas', is_required: true, order_index: 2 },
      { status_id: 72, description: 'Peticionar citação por edital', is_required: true, order_index: 3 },
      { status_id: 72, description: 'Mapear bens', is_required: false, order_index: 4 },
      { status_id: 72, description: 'Verificar prescrição', is_required: false, order_index: 5 },
      
      // 75 - Suspenso - Acordo em Andamento
      { status_id: 75, description: 'Verificar estágio das negociações', is_required: true, order_index: 1 },
      { status_id: 75, description: 'Mapear condições', is_required: true, order_index: 2 },
      { status_id: 75, description: 'Acompanhar formalização', is_required: true, order_index: 3 },
      { status_id: 75, description: 'Verificar homologação', is_required: false, order_index: 4 },
      { status_id: 75, description: 'Preparar cumprimento', is_required: false, order_index: 5 },
      
      // ===== FASE DE ENCERRAMENTO =====
      // 84 - Extinção - Com Mérito
      { status_id: 84, description: 'Verificar teor da sentença', is_required: true, order_index: 1 },
      { status_id: 84, description: 'Mapear recurso cabível', is_required: true, order_index: 2 },
      { status_id: 84, description: 'Verificar trânsito em julgado', is_required: true, order_index: 3 },
      { status_id: 84, description: 'Executar condenação', is_required: false, order_index: 4 },
      { status_id: 84, description: 'Arquivar processo', is_required: false, order_index: 5 },
      
      // 86 - Extinção - Com Resolução do Mérito
      { status_id: 86, description: 'Verificar teor da sentença', is_required: true, order_index: 1 },
      { status_id: 86, description: 'Mapear recurso cabível', is_required: true, order_index: 2 },
      { status_id: 86, description: 'Verificar trânsito em julgado', is_required: true, order_index: 3 },
      { status_id: 86, description: 'Executar condenação', is_required: false, order_index: 4 },
      { status_id: 86, description: 'Arquivar processo', is_required: false, order_index: 5 },
      
      // 85 - Extinção - Sentença Proferida
      { status_id: 85, description: 'Verificar teor da sentença', is_required: true, order_index: 1 },
      { status_id: 85, description: 'Mapear recurso cabível', is_required: true, order_index: 2 },
      { status_id: 85, description: 'Calcular prazo recursal', is_required: true, order_index: 3 },
      { status_id: 85, description: 'Preparar recurso se necessário', is_required: false, order_index: 4 },
      { status_id: 85, description: 'Acompanhar trânsito', is_required: false, order_index: 5 },
      
      // 83 - Extinção - Sem Mérito
      { status_id: 83, description: 'Verificar motivos do indeferimento', is_required: true, order_index: 1 },
      { status_id: 83, description: 'Mapear possibilidade de aditamento', is_required: true, order_index: 2 },
      { status_id: 83, description: 'Verificar recurso cabível', is_required: true, order_index: 3 },
      { status_id: 83, description: 'Avaliar novo processo', is_required: false, order_index: 4 },
      { status_id: 83, description: 'Arquivar', is_required: false, order_index: 5 },
      
      // 76 - Extinção - Sem Resolução do Mérito
      { status_id: 76, description: 'Verificar motivos da extinção', is_required: true, order_index: 1 },
      { status_id: 76, description: 'Mapear possibilidade de aditamento', is_required: true, order_index: 2 },
      { status_id: 76, description: 'Verificar recurso cabível', is_required: true, order_index: 3 },
      { status_id: 76, description: 'Avaliar novo processo', is_required: false, order_index: 4 },
      { status_id: 76, description: 'Arquivar', is_required: false, order_index: 5 },
      
      // 77 - Extinção - Indeferida Petição Inicial
      { status_id: 77, description: 'Verificar motivos do indeferimento', is_required: true, order_index: 1 },
      { status_id: 77, description: 'Mapear correção necessária', is_required: true, order_index: 2 },
      { status_id: 77, description: 'Preparar aditamento', is_required: true, order_index: 3 },
      { status_id: 77, description: 'Verificar recurso cabível', is_required: false, order_index: 4 },
      { status_id: 77, description: 'Avaliar novo processo', is_required: false, order_index: 5 },
      
      // 80 - Extinção - Homologada Desistência
      { status_id: 80, description: 'Verificar Homologação', is_required: true, order_index: 1 },
      { status_id: 80, description: 'Mapear custos', is_required: true, order_index: 2 },
      { status_id: 80, description: 'Verificar honorários', is_required: true, order_index: 3 },
      { status_id: 80, description: 'Arquivar processo', is_required: false, order_index: 4 },
      { status_id: 80, description: 'Atualizar sistema', is_required: false, order_index: 5 },
      
      // 81 - Extinção - Extinto por Acordo
      { status_id: 81, description: 'Verificar termos do acordo', is_required: true, order_index: 1 },
      { status_id: 81, description: 'Mapear cumprimento', is_required: true, order_index: 2 },
      { status_id: 81, description: 'Verificar homologação', is_required: true, order_index: 3 },
      { status_id: 81, description: 'Arquivar', is_required: false, order_index: 4 },
      { status_id: 81, description: 'Atualizar sistema', is_required: false, order_index: 5 },
      
      // 82 - Extinção - Homologação de Transação
      { status_id: 82, description: 'Verificar termos da transação', is_required: true, order_index: 1 },
      { status_id: 82, description: 'Mapear cumprimento', is_required: true, order_index: 2 },
      { status_id: 82, description: 'Verificar homologação', is_required: true, order_index: 3 },
      { status_id: 82, description: 'Arquivar', is_required: false, order_index: 4 },
      { status_id: 82, description: 'Atualizar sistema', is_required: false, order_index: 5 },
      
      // 62 - Trânsito em Julgado
      { status_id: 62, description: 'Certificar trânsito em julgado', is_required: true, order_index: 1 },
      { status_id: 62, description: 'Mapear execução', is_required: true, order_index: 2 },
      { status_id: 62, description: 'Verificar prescrição', is_required: true, order_index: 3 },
      { status_id: 62, description: 'Preparar cumprimento', is_required: false, order_index: 4 },
      { status_id: 62, description: 'Arquivar', is_required: false, order_index: 5 },
      
      // 88 - Extinção - Trânsito em Julgado
      { status_id: 88, description: 'Certificar trânsito em julgado', is_required: true, order_index: 1 },
      { status_id: 88, description: 'Mapear execução', is_required: true, order_index: 2 },
      { status_id: 88, description: 'Verificar prescrição', is_required: true, order_index: 3 },
      { status_id: 88, description: 'Preparar cumprimento', is_required: false, order_index: 4 },
      { status_id: 88, description: 'Arquivar', is_required: false, order_index: 5 },
      
      // 87 - Extinção - Recurso não Conhecido
      { status_id: 87, description: 'Verificar motivo do não conhecimento', is_required: true, order_index: 1 },
      { status_id: 87, description: 'Mapear recurso cabível', is_required: true, order_index: 2 },
      { status_id: 87, description: 'Verificar cumprimento', is_required: true, order_index: 3 },
      { status_id: 87, description: 'Arquivar', is_required: false, order_index: 4 },
      { status_id: 87, description: 'Atualizar sistema', is_required: false, order_index: 5 },
      
      // 92 - Extinção - Satisfação da Obrigação
      { status_id: 92, description: 'Verificar cumprimento total', is_required: true, order_index: 1 },
      { status_id: 92, description: 'Mapear quitação', is_required: true, order_index: 2 },
      { status_id: 92, description: 'Verificar extinção', is_required: true, order_index: 3 },
      { status_id: 92, description: 'Arquivar processo', is_required: false, order_index: 4 },
      { status_id: 92, description: 'Atualizar sistema', is_required: false, order_index: 5 },
      
      // 91 - Extinção - Cumprimento de Sentença Encerrado
      { status_id: 91, description: 'Verificar encerramento', is_required: true, order_index: 1 },
      { status_id: 91, description: 'Mapear saldo devedor', is_required: true, order_index: 2 },
      { status_id: 91, description: 'Verificar prescrição', is_required: true, order_index: 3 },
      { status_id: 91, description: 'Arquivar', is_required: false, order_index: 4 },
      { status_id: 91, description: 'Atualizar sistema', is_required: false, order_index: 5 },
      
      // 90 - Extinção - Execução Extinta
      { status_id: 90, description: 'Verificar motives da extinção', is_required: true, order_index: 1 },
      { status_id: 90, description: 'Mapear prescrição', is_required: true, order_index: 2 },
      { status_id: 90, description: 'Verificar honorários', is_required: true, order_index: 3 },
      { status_id: 90, description: 'Arquivar', is_required: false, order_index: 4 },
      { status_id: 90, description: 'Atualizar sistema', is_required: false, order_index: 5 },
      
      // 89 - Extinção - Baixa dos Autos
      { status_id: 89, description: 'Verificar baixa dos autos', is_required: true, order_index: 1 },
      { status_id: 89, description: 'Mapear cumprimento', is_required: true, order_index: 2 },
      { status_id: 89, description: 'Verificar prescrição', is_required: true, order_index: 3 },
      { status_id: 89, description: 'Arquivar', is_required: false, order_index: 4 },
      { status_id: 89, description: 'Atualizar sistema', is_required: false, order_index: 5 },
      
      // 64 - Processo Arquivado
      { status_id: 64, description: 'Verificar motivos do arquivamento', is_required: true, order_index: 1 },
      { status_id: 64, description: 'Mapear possibilidade de desarquivamento', is_required: true, order_index: 2 },
      { status_id: 64, description: 'Verificar prescrição', is_required: true, order_index: 3 },
      { status_id: 64, description: 'Manter controle', is_required: false, order_index: 4 },
      { status_id: 64, description: 'Atualizar sistema', is_required: false, order_index: 5 },
      
      // 6 - Acórdão
      { status_id: 6, description: 'Verificar teor do acórdão', is_required: true, order_index: 1 },
      { status_id: 6, description: 'Mapear recurso cabível', is_required: true, order_index: 2 },
      { status_id: 6, description: 'Verificar execução', is_required: true, order_index: 3 },
      { status_id: 6, description: 'Preparar cumprimento', is_required: false, order_index: 4 },
      { status_id: 6, description: 'Acompanhar publicação', is_required: false, order_index: 5 },
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

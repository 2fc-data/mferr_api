export const FIELD_LABELS = {
  user: {
    name: 'Nome',
    username: 'Usuário',
    email: 'E-mail',
    document: 'Documento',
    phone1: 'Telefone 1',
    phone2: 'Telefone 2',
    is_active: 'Ativo',
    nationality: 'Nacionalidade',
    birth_state: 'UF Nascimento',
    profession: 'Profissão',
    birth_date: 'Data de Nascimento',
    mother_name: 'Nome da Mãe',
    father_name: 'Nome do Pai',
    rg: 'RG',
    pis: 'PIS',
    ctps: 'CTPS',
    responsible_relation: 'Relação Resp.',
    is_minor: 'Menor de Idade',
    lgpd_date: 'Data LGPD',
    print_lgpd_consent: 'Imprimir LGPD',
    print_lgpd_minor_consent: 'Imprimir LGPD Menor',
  },
  cause: {
    number: 'Número',
    process_date: 'Data do Processo',
    description: 'Descrição',
    total_value: 'Valor da Causa',
    total_fees: 'Honorários',
    customer_amount: 'Valor do Cliente',
    percentage: 'Porcentagem',
    is_active: 'Ativo',
    subject: 'Assunto',
    litigation_type: 'Tipo de Litígio',
    court_id: 'Tribunal',
    area_id: 'Área',
    current_stage_id: 'Fase',
    current_status_id: 'Status',
    outcome_id: 'Resultado',
    city_id: 'Cidade',
    court_division_id: 'Vara / Divisão',
    print_contract: 'Imprimir Contrato',
    contract_doc_path: 'Caminho do Contrato',
  },
} as const;

export const ASSOCIATION_MAP: Record<string, string> = {
  court_id: 'court',
  area_id: 'area',
  current_stage_id: 'current_stage',
  current_status_id: 'current_status',
  outcome_id: 'outcome',
  city_id: 'city',
  court_division_id: 'court_division',
};

export const PROFILE_IDS = {
  ADMIN: 1, // Administrador
  MANAGER: 2, // Gerente
  COLLABORATOR: 3, // Colaborador
  CLIENT: 4, // Cliente
} as const;

export const AUDIT_ACTIONS = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
} as const;

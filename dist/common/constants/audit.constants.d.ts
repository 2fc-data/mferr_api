export declare const FIELD_LABELS: {
    readonly user: {
        readonly name: "Nome";
        readonly username: "Usuário";
        readonly email: "E-mail";
        readonly document: "Documento";
        readonly phone1: "Telefone 1";
        readonly phone2: "Telefone 2";
        readonly is_active: "Ativo";
        readonly nationality: "Nacionalidade";
        readonly birth_state: "UF Nascimento";
        readonly profession: "Profissão";
        readonly birth_date: "Data de Nascimento";
        readonly mother_name: "Nome da Mãe";
        readonly father_name: "Nome do Pai";
        readonly rg: "RG";
        readonly pis: "PIS";
        readonly ctps: "CTPS";
        readonly responsible_relation: "Relação Resp.";
        readonly is_minor: "Menor de Idade";
        readonly lgpd_date: "Data LGPD";
        readonly print_lgpd_consent: "Imprimir LGPD";
        readonly print_lgpd_minor_consent: "Imprimir LGPD Menor";
    };
    readonly cause: {
        readonly number: "Número";
        readonly process_date: "Data do Processo";
        readonly description: "Descrição";
        readonly total_value: "Valor da Causa";
        readonly total_fees: "Honorários";
        readonly customer_amount: "Valor do Cliente";
        readonly percentage: "Porcentagem";
        readonly is_active: "Ativo";
        readonly subject: "Assunto";
        readonly litigation_type: "Tipo de Litígio";
        readonly court_id: "Tribunal";
        readonly area_id: "Área";
        readonly current_stage_id: "Fase";
        readonly current_status_id: "Status";
        readonly outcome_id: "Resultado";
        readonly city_id: "Cidade";
        readonly court_division_id: "Vara / Divisão";
        readonly print_contract: "Imprimir Contrato";
        readonly contract_doc_path: "Caminho do Contrato";
    };
};
export declare const ASSOCIATION_MAP: Record<string, string>;
export declare const PROFILE_IDS: {
    readonly ADMIN: 1;
    readonly MANAGER: 2;
    readonly COLLABORATOR: 3;
    readonly CLIENT: 4;
};
export declare const AUDIT_ACTIONS: {
    readonly CREATE: "CREATE";
    readonly UPDATE: "UPDATE";
    readonly DELETE: "DELETE";
};

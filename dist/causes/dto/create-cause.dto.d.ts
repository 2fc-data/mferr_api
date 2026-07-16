export declare class CreateCauseDto {
    number: string;
    court_id: number;
    division_id?: number;
    area_id?: number;
    current_stage_id?: number;
    current_status_id?: number;
    outcome_id?: number;
    city_id?: number;
    description?: string;
    total_value?: number;
    total_fees?: number;
    customer_amount?: number;
    percentage?: number;
    is_active?: boolean;
    involved_users?: {
        user_id: number;
        role_type_id: number;
        party_side_id: number;
        is_primary?: boolean;
    }[];
    process_date: string;
    print_contract?: boolean;
    closed_at?: Date;
}

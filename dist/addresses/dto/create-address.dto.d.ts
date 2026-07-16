export declare class CreateAddressDto {
    postcode: string;
    city: string;
    state: string;
    district: string;
    street: string;
    number: string;
    complement?: string;
    user_id?: number;
    address_type_id?: number;
    is_primary?: boolean;
}

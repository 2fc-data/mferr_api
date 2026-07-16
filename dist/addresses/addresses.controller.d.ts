import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
export declare class AddressesController {
    private readonly addressesService;
    constructor(addressesService: AddressesService);
    create(createAddressDto: CreateAddressDto, req: any): Promise<import("../database/models/address.model").Address>;
    findAll(): Promise<import("../database/models/address.model").Address[]>;
    findOne(id: string): Promise<import("../database/models/address.model").Address>;
    findByUser(userId: string): Promise<import("../database/models/address.model").Address[]>;
    update(id: string, updateAddressDto: UpdateAddressDto, req: any): Promise<import("../database/models/address.model").Address>;
    remove(id: string, req: any): Promise<void>;
}

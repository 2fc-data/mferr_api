import { Address } from '../database/models/address.model';
import { UserAddress } from '../database/models/user_address.model';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AuditService } from '../audit/audit.service';
import { Sequelize } from 'sequelize-typescript';
export declare class AddressesService {
    private addressModel;
    private userAddressModel;
    private auditService;
    private sequelize;
    constructor(addressModel: typeof Address, userAddressModel: typeof UserAddress, auditService: AuditService, sequelize: Sequelize);
    create(createAddressDto: CreateAddressDto, userId?: number, performingUserId?: number): Promise<Address>;
    findAll(): Promise<Address[]>;
    findOne(id: number): Promise<Address>;
    update(id: number, updateAddressDto: UpdateAddressDto, performingUserId?: number): Promise<Address>;
    remove(id: number, performingUserId?: number): Promise<void>;
    findByUser(userId: number): Promise<Address[]>;
}

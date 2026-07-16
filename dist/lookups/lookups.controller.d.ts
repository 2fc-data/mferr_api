import { AddressType } from '../database/models/address_type.model';
import { CauseRoleType } from '../database/models/cause_role_type.model';
import { PartySide } from '../database/models/party_side.model';
export declare class LookupsController {
    private addressTypeModel;
    private causeRoleTypeModel;
    private partySideModel;
    constructor(addressTypeModel: typeof AddressType, causeRoleTypeModel: typeof CauseRoleType, partySideModel: typeof PartySide);
    getAddressTypes(): Promise<AddressType[]>;
    getCauseRoleTypes(): Promise<CauseRoleType[]>;
    getPartySides(): Promise<PartySide[]>;
}

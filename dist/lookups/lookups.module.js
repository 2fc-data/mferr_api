"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LookupsModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const lookups_controller_1 = require("./lookups.controller");
const address_type_model_1 = require("../database/models/address_type.model");
const cause_role_type_model_1 = require("../database/models/cause_role_type.model");
const party_side_model_1 = require("../database/models/party_side.model");
let LookupsModule = class LookupsModule {
};
exports.LookupsModule = LookupsModule;
exports.LookupsModule = LookupsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            sequelize_1.SequelizeModule.forFeature([address_type_model_1.AddressType, cause_role_type_model_1.CauseRoleType, party_side_model_1.PartySide]),
        ],
        controllers: [lookups_controller_1.LookupsController],
    })
], LookupsModule);
//# sourceMappingURL=lookups.module.js.map
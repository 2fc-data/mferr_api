"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAddressDto = void 0;
const class_validator_1 = require("class-validator");
class CreateAddressDto {
    postcode;
    city;
    state;
    district;
    street;
    number;
    complement;
    user_id;
    address_type_id;
    is_primary = false;
}
exports.CreateAddressDto = CreateAddressDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'CEP deve ser um texto' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'CEP é obrigatório' }),
    (0, class_validator_1.MaxLength)(10, { message: 'CEP muito longo' }),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "postcode", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Cidade deve ser um texto' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Cidade é obrigatória' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Nome da cidade muito longo' }),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'UF deve ser um texto' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'UF é obrigatória' }),
    (0, class_validator_1.MaxLength)(2, { message: 'UF deve ter 2 caracteres' }),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "state", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Bairro deve ser um texto' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Bairro é obrigatório' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Bairro muito longo' }),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "district", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Logradouro deve ser um texto' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Logradouro é obrigatório' }),
    (0, class_validator_1.MaxLength)(200, { message: 'Logradouro muito longo' }),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "street", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Número deve ser um texto' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Número é obrigatório' }),
    (0, class_validator_1.MaxLength)(20, { message: 'Número muito longo' }),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "number", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateAddressDto.prototype, "complement", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateAddressDto.prototype, "user_id", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateAddressDto.prototype, "address_type_id", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateAddressDto.prototype, "is_primary", void 0);
//# sourceMappingURL=create-address.dto.js.map
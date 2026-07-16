"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRuleDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_rule_dto_1 = require("./create-rule.dto");
class UpdateRuleDto extends (0, mapped_types_1.PartialType)(create_rule_dto_1.CreateRuleDto) {
}
exports.UpdateRuleDto = UpdateRuleDto;
//# sourceMappingURL=update-rule.dto.js.map
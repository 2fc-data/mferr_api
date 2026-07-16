"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateOutcomeDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_outcome_dto_1 = require("./create-outcome.dto");
class UpdateOutcomeDto extends (0, mapped_types_1.PartialType)(create_outcome_dto_1.CreateOutcomeDto) {
}
exports.UpdateOutcomeDto = UpdateOutcomeDto;
//# sourceMappingURL=update-outcome.dto.js.map
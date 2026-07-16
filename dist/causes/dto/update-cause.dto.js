"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCauseDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_cause_dto_1 = require("./create-cause.dto");
class UpdateCauseDto extends (0, mapped_types_1.PartialType)(create_cause_dto_1.CreateCauseDto) {
}
exports.UpdateCauseDto = UpdateCauseDto;
//# sourceMappingURL=update-cause.dto.js.map
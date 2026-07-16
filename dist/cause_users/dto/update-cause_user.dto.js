"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCauseUserDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_cause_user_dto_1 = require("./create-cause_user.dto");
class UpdateCauseUserDto extends (0, mapped_types_1.PartialType)(create_cause_user_dto_1.CreateCauseUserDto) {
}
exports.UpdateCauseUserDto = UpdateCauseUserDto;
//# sourceMappingURL=update-cause_user.dto.js.map
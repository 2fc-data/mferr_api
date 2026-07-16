"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateStatusTaskDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_status_task_dto_1 = require("./create-status-task.dto");
class UpdateStatusTaskDto extends (0, mapped_types_1.PartialType)(create_status_task_dto_1.CreateStatusTaskDto) {
}
exports.UpdateStatusTaskDto = UpdateStatusTaskDto;
//# sourceMappingURL=update-status-task.dto.js.map
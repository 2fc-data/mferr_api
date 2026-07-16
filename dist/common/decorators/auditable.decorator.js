"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auditable = exports.AUDIT_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.AUDIT_KEY = 'audit';
const Auditable = (resource, action) => (0, common_1.SetMetadata)(exports.AUDIT_KEY, { resource, action });
exports.Auditable = Auditable;
//# sourceMappingURL=auditable.decorator.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rules = exports.RULES_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.RULES_KEY = 'rules';
const Rules = (...rules) => (0, common_1.SetMetadata)(exports.RULES_KEY, rules);
exports.Rules = Rules;
//# sourceMappingURL=rules.decorator.js.map
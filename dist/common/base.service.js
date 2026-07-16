"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
class BaseService {
    model;
    constructor(model) {
        this.model = model;
    }
    async create(dto) {
        return this.model.create({ ...dto });
    }
    async findAll(options) {
        return this.model.findAll(options);
    }
    async findOne(id, options) {
        return this.model.findByPk(id, options);
    }
    async update(id, dto, options) {
        return this.model.update(dto, {
            where: { id },
            ...options,
        });
    }
    async remove(id) {
        return this.model.destroy({
            where: { id },
        });
    }
}
exports.BaseService = BaseService;
//# sourceMappingURL=base.service.js.map
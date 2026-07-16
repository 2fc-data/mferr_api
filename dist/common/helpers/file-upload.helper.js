"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUploadedFile = exports.GenericFileInterceptor = exports.multerOptions = void 0;
const multer_1 = require("multer");
const path_1 = require("path");
const platform_express_1 = require("@nestjs/platform-express");
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const multerOptions = (destination, prefix = '') => ({
    storage: (0, multer_1.diskStorage)({
        destination: `./uploads/${destination}`,
        filename: (req, file, cb) => {
            const id = req.params.id || req.user?.id || 'unknown';
            const ext = (0, path_1.extname)(file.originalname);
            const originalName = file.originalname.replace(ext, '').replace(/[^a-zA-Z0-0]/g, '_');
            if (destination.includes('lgpd')) {
                const name = `${id}${prefix ? '-' + prefix : ''}-${originalName}${ext}`;
                cb(null, name);
            }
            else {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, `${id}${prefix ? '-' + prefix : ''}-${uniqueSuffix}${ext}`);
            }
        },
    }),
    fileFilter: (req, file, cb) => {
        const id = req.params.id || req.user?.id || 'unknown';
        const ext = (0, path_1.extname)(file.originalname);
        const originalName = file.originalname.replace(ext, '').replace(/[^a-zA-Z0-0]/g, '_');
        if (destination.includes('lgpd')) {
            const name = `${id}${prefix ? '-' + prefix : ''}-${originalName}${ext}`;
            const filePath = (0, path_1.join)(process.cwd(), 'uploads', destination, name);
            if ((0, fs_1.existsSync)(filePath)) {
                return cb(new common_1.BadRequestException('Já existe um termo com este nome!'), false);
            }
        }
        cb(null, true);
    },
});
exports.multerOptions = multerOptions;
const GenericFileInterceptor = (fieldName, destination, prefix = '') => {
    return (0, platform_express_1.FileInterceptor)(fieldName, (0, exports.multerOptions)(destination, prefix));
};
exports.GenericFileInterceptor = GenericFileInterceptor;
const checkUploadedFile = (file) => {
    if (!file) {
        throw new common_1.BadRequestException('Nenhum arquivo enviado. Selecione um arquivo para upload.');
    }
};
exports.checkUploadedFile = checkUploadedFile;
//# sourceMappingURL=file-upload.helper.js.map
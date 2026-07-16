export declare const multerOptions: (destination: string, prefix?: string) => {
    storage: import("multer").StorageEngine;
    fileFilter: (req: any, file: any, cb: any) => any;
};
export declare const GenericFileInterceptor: (fieldName: string, destination: string, prefix?: string) => import("@nestjs/common").Type<import("@nestjs/common").NestInterceptor<any, any>>;
export declare const checkUploadedFile: (file: Express.Multer.File) => void;

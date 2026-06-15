import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { BadRequestException } from '@nestjs/common';
import { existsSync } from 'fs';

export const multerOptions = (destination: string, prefix = '') => ({
  storage: diskStorage({
    destination: `./uploads/${destination}`,
    filename: (req: any, file, cb) => {
      const id = req.params.id || req.user?.id || 'unknown';
      const ext = extname(file.originalname);
      // Clean original name from extension and special characters for the filename
      const originalName = file.originalname.replace(ext, '').replace(/[^a-zA-Z0-0]/g, '_');
      
      // If it's an LGPD doc, let's use a more predictable name to allow existence check
      // otherwise keep it unique as before. 
      // User says "recusa arquivo com nome já existente, isto está correto", 
      // so we should probably stop using random suffixes for these types of docs.
      if (destination.includes('lgpd')) {
        const name = `${id}${prefix ? '-' + prefix : ''}-${originalName}${ext}`;
        cb(null, name);
      } else {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${id}${prefix ? '-' + prefix : ''}-${uniqueSuffix}${ext}`);
      }
    },
  }),
  fileFilter: (req: any, file, cb) => {
    const id = req.params.id || req.user?.id || 'unknown';
    const ext = extname(file.originalname);
    const originalName = file.originalname.replace(ext, '').replace(/[^a-zA-Z0-0]/g, '_');
    
    if (destination.includes('lgpd')) {
      const name = `${id}${prefix ? '-' + prefix : ''}-${originalName}${ext}`;
      const filePath = join(process.cwd(), 'uploads', destination, name);
      
      if (existsSync(filePath)) {
        return cb(new BadRequestException('Já existe um termo com este nome!'), false);
      }
    }
    cb(null, true);
  },
});

export const GenericFileInterceptor = (
  fieldName: string,
  destination: string,
  prefix = '',
) => {
  return FileInterceptor(fieldName, multerOptions(destination, prefix));
};

export const checkUploadedFile = (file: Express.Multer.File) => {
  if (!file) {
    throw new BadRequestException(
      'Nenhum arquivo enviado. Selecione um arquivo para upload.',
    );
  }
};

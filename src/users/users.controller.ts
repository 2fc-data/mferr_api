import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  GenericFileInterceptor,
  checkUploadedFile,
} from '../common/helpers/file-upload.helper';
import { RulesGuard } from '../auth/rules.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Rules } from '../auth/rules.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RulesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Rules('users.create')
  create(@Request() req: any, @Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto, req.user);
  }

  @Get()
  @Rules('users.view')
  findAll(@Request() req: any, @Query('includeDeleted') includeDeleted?: string) {
    return this.usersService.findAll(req.user, includeDeleted === 'true');
  }

  @Get('collaborators')
  @Rules('users.view')
  findCollaborators() {
    return this.usersService.findCollaborators();
  }

  @Get('clients')
  @Rules('users.view')
  findClients() {
    return this.usersService.findClients();
  }

  @Get(':id')
  @Rules('users.view')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @Rules('users.edit')
  update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(+id, updateUserDto, req.user);
  }

  @Post('me/avatar')
  @Rules('users.edit')
  @UseInterceptors(GenericFileInterceptor('file', 'avatars'))
  async uploadAvatar(
    @Request() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    checkUploadedFile(file);
    const avatar_url = `/uploads/avatars/${file.filename}`;
    await this.usersService.update(req.user['id'], { avatar_url } as any);
    return { avatar_url };
  }

  @Delete(':id')
  @Rules('users.delete')
  remove(@Request() req: any, @Param('id') id: string) {
    return this.usersService.remove(+id, req.user);
  }

  @Patch(':id/restore')
  @Rules('users.delete')
  restore(@Request() req: any, @Param('id') id: string) {
    return this.usersService.restore(+id, req.user);
  }

  @Post(':id/lgpd-doc')
  @Rules('users.edit')
  @UseInterceptors(GenericFileInterceptor('file', 'documents/lgpd'))
  async uploadLgpdDoc(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    checkUploadedFile(file);
    const path = `/uploads/documents/lgpd/${file.filename}`;
    await this.usersService.updateUserDocument(+id, 'lgpd_doc_path', path);
    return { lgpd_doc_path: path };
  }

  @Post(':id/lgpd-minor-doc')
  @Rules('users.edit')
  @UseInterceptors(GenericFileInterceptor('file', 'documents/lgpd-minor', 'minor'))
  async uploadLgpdMinorDoc(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    checkUploadedFile(file);
    const path = `/uploads/documents/lgpd-minor/${file.filename}`;
    await this.usersService.updateUserDocument(
      +id,
      'lgpd_minor_doc_path',
      path,
    );
    return { lgpd_minor_doc_path: path };
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { CausesService } from './causes.service';
import { CreateCauseDto } from './dto/create-cause.dto';
import { UpdateCauseDto } from './dto/update-cause.dto';
import {
  GenericFileInterceptor,
  checkUploadedFile,
} from '../common/helpers/file-upload.helper';
import { RulesGuard } from '../auth/rules.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Rules } from '../auth/rules.decorator';

@Controller('causes')
@UseGuards(JwtAuthGuard, RulesGuard)
export class CausesController {
  constructor(private readonly causesService: CausesService) {}

  @Post()
  @Rules('causes.create')
  create(@Body() createCauseDto: CreateCauseDto, @Request() req) {
    console.log('Incoming CreateCauseDto:', createCauseDto);
    return this.causesService.create(createCauseDto, req.user);
  }

  @Get()
  @Rules('causes.view')
  findAll(
    @Request() req,
    @Query('city_id') city_id?: string,
    @Query('court_id') court_id?: string,
    @Query('court_division_id') court_division_id?: string,
    @Query('includeDeleted') includeDeleted?: string,
  ) {
    const filters = {
      city_id: city_id ? Number(city_id) : undefined,
      court_id: court_id ? Number(court_id) : undefined,
      division_id:
        court_division_id ? Number(court_division_id) : undefined,
    };
    return this.causesService.findAll(
      req.user,
      filters,
      includeDeleted === 'true',
    );
  }

  @Get(':id')
  @Rules('causes.view')
  findOne(@Param('id') id: string, @Request() req) {
    return this.causesService.findOne(+id, req.user);
  }

  @Patch(':id')
  @Rules('causes.edit')
  update(
    @Param('id') id: string,
    @Body() updateCauseDto: UpdateCauseDto,
    @Request() req,
  ) {
    return this.causesService.update(+id, updateCauseDto, req.user);
  }

  @Delete(':id')
  @Rules('causes.delete')
  remove(@Param('id') id: string) {
    return this.causesService.remove(+id);
  }

  @Post(':id/contract-doc')
  @Rules('causes.edit')
  @UseInterceptors(GenericFileInterceptor('file', 'documents/contracts'))
  async uploadContractDoc(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    checkUploadedFile(file);
    const contract_doc_path = `/uploads/documents/contracts/${file.filename}`;
    await this.causesService.updateContractDoc(+id, contract_doc_path);
    return { contract_doc_path };
  }

  @Get(':id/tasks')
  @Rules('causes.view')
  getTasks(@Param('id') id: string, @Query('status_id') status_id?: string) {
    return this.causesService.findAllTasks(
      id,
      status_id ? Number(status_id) : undefined,
    );
  }

  @Patch(':id/tasks/:taskId')
  @Rules('causes.edit')
  toggleTask(
    @Param('id') id: string,
    @Param('taskId') taskId: string,
    @Body('is_completed') is_completed: boolean,
    @Request() req,
  ) {
    return this.causesService.toggleTask(+taskId, req.user.id, is_completed);
  }
}

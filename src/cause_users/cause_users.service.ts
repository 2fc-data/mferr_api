import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateCauseUserDto } from './dto/create-cause_user.dto';
import { UpdateCauseUserDto } from './dto/update-cause_user.dto';
import { CauseUser } from '../database/models/cause_user.model';

@Injectable()
export class CauseUsersService {
  constructor(
    @InjectModel(CauseUser)
    private causeUserModel: typeof CauseUser,
  ) {}

  create(createCauseUserDto: CreateCauseUserDto) {
    return this.causeUserModel.create({ ...createCauseUserDto });
  }

  findAll() {
    return this.causeUserModel.findAll();
  }

  findOne(id: number) {
    return this.causeUserModel.findByPk(id);
  }

  update(id: number, updateCauseUserDto: UpdateCauseUserDto) {
    return this.causeUserModel.update(updateCauseUserDto, {
      where: { id },
    });
  }

  remove(id: number) {
    return this.causeUserModel.destroy({
      where: { id },
    });
  }
}

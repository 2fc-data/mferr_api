import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from '../database/models/profile.model';
import { Rule } from '../database/models/rule.model';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectModel(Profile)
    private profileModel: typeof Profile,
  ) {}

  async create(createProfileDto: CreateProfileDto) {
    const { rule_ids, ...profileData } = createProfileDto;
    const profile = await this.profileModel.create({ ...profileData });

    if (rule_ids && rule_ids.length > 0) {
      await profile.$set('rules', rule_ids);
    }

    return profile;
  }

  findAll() {
    return this.profileModel.findAll({
      include: [{ model: Rule, as: 'rules' }],
      order: [['name', 'ASC']],
    });
  }

  findOne(id: number) {
    return this.profileModel.findByPk(id, {
      include: [{ model: Rule, as: 'rules' }],
    });
  }

  async update(id: number, updateProfileDto: UpdateProfileDto) {
    const { rule_ids, ...profileData } = updateProfileDto;

    await this.profileModel.update(profileData, {
      where: { id },
    });

    const profile = await this.profileModel.findByPk(id);
    if (profile && rule_ids) {
      await profile.$set('rules', rule_ids);
    }

    return this.findOne(id);
  }

  remove(id: number) {
    return this.profileModel.destroy({
      where: { id },
    });
  }
}

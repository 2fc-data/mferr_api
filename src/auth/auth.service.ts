import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/sequelize';
import { PasswordResetToken } from '../database/models/password_reset_token.model';
import * as crypto from 'crypto';
import { AppLogger } from '../common/logger/logger.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectModel(PasswordResetToken)
    private passwordResetTokenModel: typeof PasswordResetToken,
    private logger: AppLogger,
    private configService: ConfigService,
  ) {}

  async forgotPassword(email: string): Promise<void> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      this.logger.warn(
        `Password reset requested for non-existent email: ${email}`,
        'AuthService',
      );
      return;
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await this.passwordResetTokenModel.create({
      userId: user.id,
      token,
      expiresAt,
    });

    const frontendUrl = this.configService.get<string>(
      'FRONTEND_URL',
      'http://localhost:5173',
    );
    const resetLink = `${frontendUrl}/new-password?token=${token}`;

    this.logger.log(
      `[MOCK EMAIL] To: ${email} | Subject: Redefinição de Senha | Link: ${resetLink}`,
      'AuthService',
    );
  }

  async resetPassword(token: string, pass: string): Promise<void> {
    const resetToken = await this.passwordResetTokenModel.findOne({
      where: { token, used: false },
    });

    if (!resetToken || resetToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }

    const password_hash = await bcrypt.hash(pass, 10);
    await this.usersService.updatePassword(resetToken.userId, password_hash);

    resetToken.used = true;
    await resetToken.save();
  }

  async validateUser(username: string, pass: string): Promise<any> {
    try {
      this.logger.debug(
        `Attempting login for user: ${username}`,
        'AuthService',
      );
      const user = await this.usersService.findOneByUsername(username);
      this.logger.debug(`User found: ${user ? 'Yes' : 'No'}`, 'AuthService');

      if (user) {
        const isMatch = await bcrypt.compare(pass, user.password_hash);
        this.logger.debug(`Password match: ${isMatch}`, 'AuthService');

        if (isMatch) {
          const plainUser = user.get({ plain: true });
          const { password_hash, profiles, ...result } = plainUser;

          const rules =
            profiles?.reduce((acc, profile) => {
              if (profile.rules) {
                profile.rules.forEach((rule) => {
                  if (rule.is_active && !acc.includes(rule.name)) {
                    acc.push(rule.name);
                  }
                });
              }
              return acc;
            }, [] as string[]) || [];

          this.logger.info(
            `User ${username} logged in successfully`,
            'AuthService',
          );
          return { ...result, rules, profiles };
        }
      }
      return null;
    } catch (error) {
      this.logger.error(
        `Error in validateUser: ${error.message}`,
        error.stack,
        'AuthService',
      );
      throw error;
    }
  }

  async login(user: any) {
    const profileIds = user.profiles?.map((p: any) => p.id) || [];

    const payload = {
      username: user.username,
      sub: user.id,
      rules: user.rules,
      profileIds,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        rules: user.rules,
        profiles: user.profiles,
        avatar_url: user.avatar_url,
      },
    };
  }
}

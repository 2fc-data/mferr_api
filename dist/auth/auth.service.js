"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const sequelize_1 = require("@nestjs/sequelize");
const password_reset_token_model_1 = require("../database/models/password_reset_token.model");
const crypto = require("crypto");
const logger_service_1 = require("../common/logger/logger.service");
const config_1 = require("@nestjs/config");
let AuthService = class AuthService {
    usersService;
    jwtService;
    passwordResetTokenModel;
    logger;
    configService;
    constructor(usersService, jwtService, passwordResetTokenModel, logger, configService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.passwordResetTokenModel = passwordResetTokenModel;
        this.logger = logger;
        this.configService = configService;
    }
    async forgotPassword(email) {
        const user = await this.usersService.findOneByEmail(email);
        if (!user) {
            this.logger.warn(`Password reset requested for non-existent email: ${email}`, 'AuthService');
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
        const frontendUrl = this.configService.get('FRONTEND_URL', 'http://localhost:5173');
        const resetLink = `${frontendUrl}/new-password?token=${token}`;
        this.logger.log(`[MOCK EMAIL] To: ${email} | Subject: Redefinição de Senha | Link: ${resetLink}`, 'AuthService');
    }
    async resetPassword(token, pass) {
        const resetToken = await this.passwordResetTokenModel.findOne({
            where: { token, used: false },
        });
        if (!resetToken || resetToken.expiresAt < new Date()) {
            throw new common_1.UnauthorizedException('Token inválido ou expirado');
        }
        const password_hash = await bcrypt.hash(pass, 10);
        await this.usersService.updatePassword(resetToken.userId, password_hash);
        resetToken.used = true;
        await resetToken.save();
    }
    async validateUser(username, pass) {
        try {
            this.logger.debug(`Attempting login for user: ${username}`, 'AuthService');
            const user = await this.usersService.findOneByUsername(username);
            this.logger.debug(`User found: ${user ? 'Yes' : 'No'}`, 'AuthService');
            if (user) {
                const isMatch = await bcrypt.compare(pass, user.password_hash);
                this.logger.debug(`Password match: ${isMatch}`, 'AuthService');
                if (isMatch) {
                    const plainUser = user.get({ plain: true });
                    const { password_hash, profiles, ...result } = plainUser;
                    const rules = profiles?.reduce((acc, profile) => {
                        if (profile.rules) {
                            profile.rules.forEach((rule) => {
                                if (rule.is_active && !acc.includes(rule.name)) {
                                    acc.push(rule.name);
                                }
                            });
                        }
                        return acc;
                    }, []) || [];
                    this.logger.info(`User ${username} logged in successfully`, 'AuthService');
                    return { ...result, rules, profiles };
                }
            }
            return null;
        }
        catch (error) {
            this.logger.error(`Error in validateUser: ${error.message}`, error.stack, 'AuthService');
            throw error;
        }
    }
    async login(user) {
        const profileIds = user.profiles?.map((p) => p.id) || [];
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, sequelize_1.InjectModel)(password_reset_token_model_1.PasswordResetToken)),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService, Object, logger_service_1.AppLogger,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map
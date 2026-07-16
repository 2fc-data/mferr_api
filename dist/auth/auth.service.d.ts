import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PasswordResetToken } from '../database/models/password_reset_token.model';
import { AppLogger } from '../common/logger/logger.service';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private usersService;
    private jwtService;
    private passwordResetTokenModel;
    private logger;
    private configService;
    constructor(usersService: UsersService, jwtService: JwtService, passwordResetTokenModel: typeof PasswordResetToken, logger: AppLogger, configService: ConfigService);
    forgotPassword(email: string): Promise<void>;
    resetPassword(token: string, pass: string): Promise<void>;
    validateUser(username: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
        user: {
            id: any;
            name: any;
            email: any;
            username: any;
            rules: any;
            profiles: any;
            avatar_url: any;
        };
    }>;
}

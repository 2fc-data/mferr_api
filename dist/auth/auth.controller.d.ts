import { Response } from 'express';
import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(signInDto: Record<string, any>, res: Response): Promise<{
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
    logout(res: Response): Promise<{
        message: string;
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(resetDto: {
        token: string;
        password: string;
    }): Promise<{
        message: string;
    }>;
}

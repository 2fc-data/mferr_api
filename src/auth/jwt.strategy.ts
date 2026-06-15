import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => {
          console.log('--- Incoming Request to protected route ---');
          console.log('Headers:', request.headers);
          console.log('Cookies:', request.cookies);
          let data = request?.cookies?.access_token;
          if (!data) {
            data = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
          }
          console.log('Extracted JWT:', data ? 'Yes' : 'No');
          return data;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('PASSPORT_SECRET') || 'default_secret',
    });
  }

  async validate(payload: any) {
    // This object will be attached to Request.user
    return {
      id: payload.sub,
      username: payload.username,
      rules: payload.rules || [],
    };
  }
}

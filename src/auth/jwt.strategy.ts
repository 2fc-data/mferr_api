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
          let data = request?.cookies?.access_token;
          if (!data) {
            data = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
          }
          return data;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('PASSPORT_SECRET'),
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

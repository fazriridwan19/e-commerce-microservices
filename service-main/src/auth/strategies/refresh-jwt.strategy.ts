import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow<string>('REFRESH_JWT_SECRET'),
    });
  }

  validate(payload: { sub: string, username: string, roles: string }) {
    if (!payload?.username) {
      throw new UnauthorizedException('Invalid token payload, username is not found');
    }

    return {
      userId: payload.sub,
      username: payload.username,
      roles: payload.roles
    };
  }
}

// src/auth/strategies/apple.strategy.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from '@arendajaelu/nestjs-passport-apple';
import { ConfigService } from '@nestjs/config';

const APPLE_STRATEGY_NAME = 'apple';

@Injectable()
export class AppleStrategy extends PassportStrategy(Strategy, APPLE_STRATEGY_NAME) {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('APPLE_CLIENT_ID'),
      teamID: configService.get<string>('APPLE_TEAM_ID'),
      keyID: configService.get<string>('APPLE_KEY_ID'),
      key: configService.get<string>('APPLE_PRIVATE_KEY'), // Nội dung private key
      // Hoặc dùng keyFilePath nếu muốn đọc từ file
      // keyFilePath: configService.get<string>('APPLE_KEY_FILE_PATH'),
      callbackURL: configService.get<string>('APPLE_CALLBACK_URL'),
      scope: ['email', 'name'],
      passReqToCallback: false,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ) {
    // Xử lý thông tin user từ Apple
    const user = {
      appleId: profile.id,
      email: profile.email,
      firstName: profile.name?.firstName || '',
      lastName: profile.name?.lastName || '',
      accessToken,
    };

    return user;
  }
}

@Injectable()
export class AppleOAuthGuard extends AuthGuard(APPLE_STRATEGY_NAME) {
  constructor() {
    super();
  }
}
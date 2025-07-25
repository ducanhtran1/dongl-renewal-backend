import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './user.service';
import { UsersController } from './users.controller';
import { User, SocialAccount, UserProfile, UserAddress, UserSession } from './entities';
import { VerificationToken } from './entities/verification-tokens.entity';
import { MailModule } from '../mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { VerificationTokenRepository } from './repositories/verification-tokens.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, SocialAccount, UserProfile, UserAddress, UserSession, VerificationToken]),
    MailModule,
    ConfigModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, VerificationTokenRepository],
  exports: [UsersService],
})
export class UsersModule {}

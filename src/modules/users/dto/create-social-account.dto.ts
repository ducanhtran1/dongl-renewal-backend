import { IsString, IsOptional, IsEnum, IsBoolean, IsObject } from 'class-validator';
import { SocialProvider } from '../enums/social-provider.enum';

export class CreateSocialAccountDto {
  @IsString()
  userId: string;

  @IsEnum(SocialProvider)
  provider: SocialProvider;

  @IsString()
  providerId: string;

  @IsOptional()
  @IsString()
  providerEmail?: string;

  @IsOptional()
  @IsObject()
  providerData?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
} 
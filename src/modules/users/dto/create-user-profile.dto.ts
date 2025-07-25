import { IsString, IsOptional, IsEnum, IsDateString, IsNumber, IsObject } from 'class-validator';
import { Gender } from '../enums/gender.enum';

export class CreateUserProfileDto {
  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  @IsString()
  displayName?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsNumber()
  points?: number;

  @IsOptional()
  @IsObject()
  preferences?: Record<string, any>;
} 
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateUserAddressDto {
  @IsOptional()
  @IsString()
  label?: string;

  @IsString()
  senderName: string;

  @IsString()
  senderAddress: string;

  @IsOptional()
  @IsString()
  senderAddressDetail?: string;

  @IsOptional()
  @IsString()
  senderPhone?: string;

  @IsString()
  receiverName: string;

  @IsString()
  receiverAddress: string;

  @IsOptional()
  @IsString()
  receiverAddressDetail?: string;

  @IsOptional()
  @IsString()
  receiverPhone?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
} 
import { IsString, MinLength, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @MinLength(6)
  password: string;
}
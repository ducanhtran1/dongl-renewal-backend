import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'Email address of the user requesting password reset',
    example: 'icetea.software@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Captcha response from the client',
    example: '03AGdBq2422ASdcvs2151c123kl5',
  })
  @IsString()
  captcha: string;
}

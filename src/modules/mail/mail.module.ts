import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('SES_AWS_SMTP_ENDPOINT'),
          port: configService.get('SES_AWS_SMTP_PORT'),
          secure: false, // true for 465, false for other ports
          auth: {
            user: configService.get('SES_AWS_SMTP_USERNAME'),
            pass: configService.get('SES_AWS_SMTP_PASSWORD'),
          },
          from: configService.get('SES_AWS_SMTP_SENDER'), // Default sender address
        },
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}

import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Send an email
   * @param to Recipient email
   * @param subject Email subject
   * @param text Plain text content
   * @param html HTML content (optional)
   */
  async sendMail({
    from = this.configService.get<string>('SES_AWS_SMTP_SENDER')!,
    to,
    subject,
    text,
    html,
  }: {
    from?: string;
    to: string | string[];
    subject: string;
    text: string;
    html?: string;
  }): Promise<void> {
    await this.mailerService.sendMail({
      from: from ?? this.configService.get<string>('SES_AWS_SMTP_SENDER')!,
      to,
      subject,
      text,
      html: html ?? text, // If HTML not provided, use text content
    });
  }

  /**
   * Send a welcome email to a new user
   * @param email User's email
   * @param name User's name
   */
  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    const subject = 'Welcome to Our Platform!';
    const text = `Hello ${name},\n\nWelcome to our platform! We're excited to have you on board.\n\nBest regards,\nThe Team`;
    const html = `
      <h2>Welcome to Our Platform!</h2>
      <p>Hello ${name},</p>
      <p>We're excited to have you on board.</p>
      <p>Best regards,<br>The Team</p>
    `;
    await this.sendMail({
      to: email,
      subject,
      text,
      html,
      from: this.configService.get<string>('SES_AWS_SMTP_SENDER')!,
    });
  }

  /**
   * Send a password reset email
   * @param email User's email
   * @param resetToken Password reset token
   * @param resetUrl URL for password reset page
   */
  async sendPasswordResetEmail(email: string, resetUrl: string): Promise<void> {
    try {
      const subject = 'Password Reset Request';
      const text = `You requested a password reset. Please use the following link to reset your password: ${resetUrl}\n\nIf you didn't request this, please ignore this email.`;
      const html = `
      <h2>Password Reset Request</h2>
      <p>You requested a password reset. Please click the link below to reset your password:</p>
      <p><a href="${resetUrl}">Reset your password</a></p>
      <p>If you didn't request this, please ignore this email.</p>
    `;
      await this.sendMail({
        to: email,
        subject,
        text,
        html,
      });

      return;
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  async sendPasswordChangedNotification(email: string): Promise<void> {
    const subject = 'Your password has been changed';
    const text = `Your password was just changed. If you did not perform this action, please contact support immediately.`;
    const html = `
      <h2>Password Changed</h2>
      <p>Your password was just changed. If you did not perform this action, please contact support immediately.</p>
    `;
    await this.sendMail({
      to: email,
      subject,
      text,
      html,
    });
  }
}

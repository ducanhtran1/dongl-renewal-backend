import { BadRequestException } from '@nestjs/common';

export async function checkCaptcha(captcha: string, recaptcha_secret: string): Promise<void> {
  try {
    // Implement your captcha verification logic here
    const params = new URLSearchParams();
    params.append('secret', recaptcha_secret);
    params.append('response', captcha);
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(params),
    });
    const data = await response.json();
    if (!data.success) {
      throw new BadRequestException('Captcha verification failed');
    }
    console.log('Captcha verified successfully');
  } catch (error) {
    throw new BadRequestException('Server error during CAPTCHA verification');
  }
}

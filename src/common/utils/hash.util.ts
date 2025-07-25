import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

export class HashUtil {
  static async hash(plainText: string, saltRounds?: number): Promise<string> {
    const rounds = saltRounds || 12;
    return bcrypt.hash(plainText, rounds);
  }

  static async compare(plainText: string, hashedText: string): Promise<boolean> {
    return bcrypt.compare(plainText, hashedText);
  }

  static generateSalt(rounds: number = 12): string {
    return bcrypt.genSaltSync(rounds);
  }
}
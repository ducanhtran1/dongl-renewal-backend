import { Injectable } from '@nestjs/common';
import { VerificationToken } from '../entities/verification-tokens.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class VerificationTokenRepository extends Repository<VerificationToken> {
  constructor(private readonly dataSource: DataSource) {
    super(VerificationToken, dataSource.createEntityManager());
  }

  async findByEmail(email: string): Promise<VerificationToken | null> {
    return this.dataSource
      .getRepository(VerificationToken)
      .createQueryBuilder('verification_tokens')
      .innerJoinAndSelect('verification_tokens.user', 'user')
      .where('user.email = :email', { email })
      .getOne();
  }

  async findByToken(token: string): Promise<VerificationToken | null> {
    return this.createQueryBuilder('verification_tokens')
      .innerJoinAndSelect('verification_tokens.user', 'user')
      .where('verification_tokens.token = :token', { token })
      .getOne();
  }

  async createOrUpdateVerificationToken(
    verificationToken: Partial<VerificationToken>,
  ): Promise<VerificationToken> {
    const existingToken = await this.dataSource.getRepository(VerificationToken).findOne({
      where: { user: { user_id: verificationToken?.user?.user_id } },
    });
    if (existingToken) {
      existingToken.token = verificationToken.token;
      existingToken.expiresAt = verificationToken.expiresAt;
      return this.dataSource.getRepository(VerificationToken).save(existingToken);
    }
    return this.dataSource.getRepository(VerificationToken).save(verificationToken);
  }

  async clearVerificationToken(token: string): Promise<void> {
    // get by token and set token and expiresAt to null
    await this.createQueryBuilder('verification_tokens')
      .update(VerificationToken)
      .set({ token: null, expiresAt: null })
      .where('verification_tokens.token = :token', { token })
      .execute();
  }
}

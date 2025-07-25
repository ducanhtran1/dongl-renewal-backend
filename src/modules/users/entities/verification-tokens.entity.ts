import { User } from './user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('verification_tokens')
export class VerificationToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  token?: string | null;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt?: Date | null;

  @ManyToOne(() => User, (user) => user.verificationTokens, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'user_id',
  })
  user: User;
}

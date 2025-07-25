import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { SocialProvider } from '../enums/social-provider.enum';

@Entity('social_accounts')
export class SocialAccount {
  @PrimaryGeneratedColumn('uuid')
  social_account_id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  user_id: string;

  @Column({
    name: 'provider',
    type: 'enum',
    enum: SocialProvider,
  })
  provider: SocialProvider;

  @Column({ name: 'provider_id', type: 'varchar', length: 255 })
  provider_id: string;

  @Column({ name: 'provider_email', type: 'varchar', length: 255, nullable: true })
  provider_email: string;

  @Column({ name: 'provider_data', type: 'jsonb', nullable: true })
  provider_data: Record<string, any>;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updated_at: Date;

  // Relationships
  @ManyToOne(() => User, (user) => user.social_accounts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
} 
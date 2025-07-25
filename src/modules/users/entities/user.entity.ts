import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserRole } from '../enums/user-role.enum';
import { UserProfile } from './user-profile.entity';
import { UserAddress } from './user-address.entity';
import { UserSession } from './user-session.entity';
import { SocialAccount } from './social-account.entity';
import { VerificationToken } from './verification-tokens.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Column({ name: 'email', type: 'varchar', length: 255 })
  email: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  @Exclude()
  password_hash: string;

  @Column({ name: 'phone_number', type: 'varchar', length: 20, unique: true })
  phone_number: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  is_active: boolean;

  @Column({ name: 'is_verified', type: 'boolean', default: false })
  is_verified: boolean;

  @Column({ name: 'email_verified_at', type: 'timestamp', nullable: true })
  email_verified_at: Date;

  @Column({ name: 'phone_verified_at', type: 'timestamp', nullable: true })
  phone_verified_at: Date;

  @Column({
    name: 'role',
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ name: 'last_login_at', type: 'timestamp', nullable: true })
  last_login_at: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
  deleted_at: Date;

  @OneToMany(() => SocialAccount, (socialAccount) => socialAccount.user, { cascade: true })
  social_accounts: SocialAccount[];

  @OneToOne(() => UserProfile, (profile) => profile.user, { cascade: true })
  profile: UserProfile;

  @OneToMany(() => UserAddress, (address) => address.user, { cascade: true })
  addresses: UserAddress[];

  @OneToMany(() => UserSession, (session) => session.user, { cascade: true })
  sessions: UserSession[];

  @OneToMany(() => VerificationToken, (verificationToken) => verificationToken.user, {
    cascade: true,
  })
  verificationTokens: VerificationToken[];
}

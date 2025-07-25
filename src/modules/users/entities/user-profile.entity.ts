import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Gender } from '../enums/gender.enum';

@Entity('user_profiles')
export class UserProfile {
  @PrimaryGeneratedColumn('uuid')
  user_profile_id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  user_id: string;

  @Column({ name: 'nickname', type: 'varchar', length: 100, nullable: true })
  nickname: string;

  @Column({ name: 'display_name', type: 'varchar', length: 100, nullable: true })
  display_name: string;

  @Column({ name: 'name', type: 'varchar', length: 100, nullable: true })
  name: string;

  @Column({ name: 'avatar_url', type: 'varchar', length: 500, nullable: true })
  avatar_url: string;

  @Column({ name: 'bio', type: 'text', nullable: true })
  bio: string;

  @Column({ name: 'birth_date', type: 'date', nullable: true })
  birth_date: Date;

  @Column({
    name: 'gender',
    type: 'enum',
    enum: Gender,
    nullable: true,
  })
  gender: Gender;

  @Column({ name: 'timezone', type: 'varchar', length: 50, default: 'Asia/Seoul' })
  timezone: string;

  @Column({ name: 'language', type: 'varchar', length: 10, default: 'ko' })
  language: string;

  @Column({ name: 'points', type: 'integer', default: 0 })
  points: number;

  @Column({ name: 'preferences', type: 'jsonb', default: {} })
  preferences: Record<string, any>;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updated_at: Date;

  // Relationships
  @OneToOne(() => User, (user) => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
} 
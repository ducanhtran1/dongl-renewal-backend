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

@Entity('user_addresses')
export class UserAddress {
  @PrimaryGeneratedColumn('uuid')
  user_address_id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  user_id: string;

  @Column({ name: 'label', type: 'varchar', length: 50, nullable: true })
  label: string;

  @Column({ name: 'sender_name', type: 'varchar', length: 100 })
  sender_name: string;

  @Column({ name: 'sender_address', type: 'varchar', length: 255 })
  sender_address: string;

  @Column({ name: 'sender_address_detail', type: 'varchar', length: 255, nullable: true })
  sender_address_detail: string;

  @Column({ name: 'sender_phone', type: 'varchar', length: 20, nullable: true })
  sender_phone: string;

  @Column({ name: 'receiver_name', type: 'varchar', length: 100 })
  receiver_name: string;

  @Column({ name: 'receiver_address', type: 'varchar', length: 255 })
  receiver_address: string;

  @Column({ name: 'receiver_address_detail', type: 'varchar', length: 255, nullable: true })
  receiver_address_detail: string;

  @Column({ name: 'receiver_phone', type: 'varchar', length: 20, nullable: true })
  receiver_phone: string;

  @Column({ name: 'is_default', type: 'boolean', default: false })
  is_default: boolean;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updated_at: Date;

  // Relationships
  @ManyToOne(() => User, (user) => user.addresses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
} 
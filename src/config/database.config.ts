import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User, UserProfile, UserAddress, UserSession, SocialAccount } from '../modules/users/entities';
import { VerificationToken } from 'src/modules/users/entities/verification-tokens.entity';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [User, UserProfile, UserAddress, UserSession, SocialAccount, VerificationToken],
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    logging: process.env.DB_LOGGING === 'true',
    migrations: ['dist/database/migrations/*.js'],
    migrationsRun: false,
  }),
);

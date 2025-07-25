import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV,
  port: parseInt(process.env.PORT, 10),
  apiPrefix: process.env.API_PREFIX,
  bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10),
}));
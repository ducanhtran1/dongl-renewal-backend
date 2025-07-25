import serverlessExpress from '@vendia/serverless-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';

let cachedServer;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  await app.init();
  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler = async (event, context) => {
  cachedServer = cachedServer ?? (await bootstrap());
  return cachedServer(event, context);
};

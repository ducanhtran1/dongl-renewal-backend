import { createServer, proxy } from '@vendia/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';

let server: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  await app.init();
  return createServer(app.getHttpAdapter().getInstance());
}

export const handler: Handler = async (event: any, context: Context, callback: Callback) => {
  server = server ?? (await bootstrap());
  return proxy(server, event, context, 'PROMISE').promise;
};

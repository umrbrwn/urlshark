import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShortUrlModule } from './short-url/short-url.module';
import { ConfigModule } from '@nestjs/config';
import config from '../../config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.development.env'],
      load: [config],
      isGlobal: true,
    }),
    MongooseModule.forRoot(config().database),
    ShortUrlModule,
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShortUrlController } from './short-url.controller';
import { ShortUrl, ShortUrlSchema } from './short-url.schema';
import { ShortUrlService } from './short-url.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ShortUrl.name, schema: ShortUrlSchema },
    ]),
  ],
  controllers: [ShortUrlController],
  providers: [ShortUrlService],
})
export class ShortUrlModule {}

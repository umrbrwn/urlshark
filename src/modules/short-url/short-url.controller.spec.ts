import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import * as Chance from 'chance';
import { ShortUrlController } from './short-url.controller';
import { ShortUrlService } from './short-url.service';
import config from '../../../config';
import { ShortUrl, ShortUrlSchema } from './short-url.schema';
import { performance } from 'perf_hooks';

const chance = new Chance();

function splitId(shortUrl) {
  return shortUrl.split('/')?.at(-1);
}

describe('ShortUrlController', () => {
  let appController: ShortUrlController;
  let configService: ConfigService;
  let shortUrlService: ShortUrlService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: ['.development-test.env'],
          load: [config],
          isGlobal: true,
        }),
        MongooseModule.forRoot(config().database),
        MongooseModule.forFeature([
          { name: ShortUrl.name, schema: ShortUrlSchema },
        ]),
      ],
      controllers: [ShortUrlController],
      providers: [ConfigService, ShortUrlService],
    }).compile();

    appController = app.get<ShortUrlController>(ShortUrlController);
    configService = app.get<ConfigService>(ConfigService);
    shortUrlService = app.get<ShortUrlService>(ShortUrlService);
  });

  it('should create short url', async () => {
    const short = await appController.short({ url: chance.url() });
    expect(short.shortUrl).toContain(configService.get('baseUrl'));
    const id = splitId(short.shortUrl);
    expect(id).toHaveLength(8);
  });

  it('should return original url for short url', async () => {
    const originalUrl = chance.url();
    const short = await appController.short({ url: originalUrl });
    const redirectable = await appController.redirect(splitId(short.shortUrl));
    expect(redirectable.url).toEqual(originalUrl);
  });

  it('should count visitors', async () => {
    const originalUrl = chance.url();
    const short = await appController.short({ url: originalUrl });
    await Promise.all([
      appController.redirect(splitId(short.shortUrl)),
      appController.redirect(splitId(short.shortUrl)),
      appController.redirect(splitId(short.shortUrl)),
    ]);
    const entry = await shortUrlService.getOriginal(splitId(short.shortUrl));
    expect(entry.originalUrl).toEqual(originalUrl);
    expect(entry.visits).toEqual(3);
  });

  it('should throw not found for invalid short url', async () => {
    try {
      await appController.redirect(chance.url());
    } catch (error) {
      expect(error.name).toEqual(NotFoundException.name);
    }
  });

  it('should create unique short url for same original url, and same base url', async () => {
    const originalUrl = chance.url();
    const short1 = await appController.short({ url: originalUrl });
    const short2 = await appController.short({ url: originalUrl });
    expect(short1.shortUrl).toContain(configService.get('baseUrl'));
    expect(short2.shortUrl).toContain(configService.get('baseUrl'));
    expect(short1.shortUrl !== short2.shortUrl).toBeTruthy();
  });

  it('should create 200 short url in 1s', async () => {
    const originalUrl = chance.url();
    const ps = [];
    for (let count = 0; count < 200; count++) {
      ps.push(appController.short({ url: originalUrl }));
    }
    performance.mark('start');
    await Promise.all(ps);
    performance.mark('end');
    const timeElapsed = performance.measure('elapsed', 'start', 'end');
    expect((timeElapsed as any).duration).toBeLessThan(1000); // ms
  });
});

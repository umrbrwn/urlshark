import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { customAlphabet } from 'nanoid/async';
import { ShortUrl, ShortUrlDocument } from './short-url.schema';
import { ConfigService } from '@nestjs/config';

const nanoid = customAlphabet('0123456789ABCDEFzxcvbn', 8);

@Injectable()
export class ShortUrlService {
  constructor(
    @InjectModel(ShortUrl.name)
    private shortUrlModel: Model<ShortUrlDocument>,
    private configService: ConfigService,
  ) {}

  /**
   * Create short URL from the given URL
   * @param originalUrl URL to short
   * @returns New short URL
   */
  async shortenUrl(originalUrl: string) {
    const id = await nanoid();
    const newUrl = new this.shortUrlModel({ _id: id, originalUrl });
    await newUrl.save();
    return `${this.configService.get('baseUrl')}/${id}`;
  }

  /**
   * Get the original URL
   * @param id Shortened URL ID
   * @returns Original URL if found, otherwise `null`
   */
  getOriginal(id: string) {
    return this.shortUrlModel
      .findByIdAndUpdate(id, { $inc: { visits: 1 } })
      .exec();
  }
}

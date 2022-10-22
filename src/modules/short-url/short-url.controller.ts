import { Param, Body, Controller, Get, Post, Redirect, NotFoundException } from '@nestjs/common';
import { ShortUrlService as ShortUrlService } from './short-url.service';
import { NewUrlReq, NewUrlRes } from './short-url.model';

@Controller()
export class ShortUrlController {
  constructor(private readonly urlService: ShortUrlService) {}

  @Post()
  async short(@Body() newUrl: NewUrlReq): Promise<NewUrlRes> {
    const model = await this.urlService.shortenUrl(newUrl.url);
    return { shortUrl: model };
  }

  @Get(':id')
  @Redirect()
  async redirect(@Param('id') id: string) {
    const model = await this.urlService.getOriginal(id);
    if (!model) {
      throw new NotFoundException();
    }
    return { url: model.originalUrl, statusCode: 301 };
  }
}

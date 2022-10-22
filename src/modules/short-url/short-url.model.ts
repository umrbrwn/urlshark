import { IsNotEmpty, IsUrl } from 'class-validator';

export class NewUrlReq {
  @IsNotEmpty()
  @IsUrl()
  url: string;
}

export interface NewUrlRes {
  shortUrl: string;
}

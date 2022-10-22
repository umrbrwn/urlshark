import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  _id: false,
  timestamps: true,
})
export class ShortUrl {
  @Prop({ type: String })
  _id: string;

  @Prop()
  originalUrl: string;

  @Prop()
  visits: number;
}

export type ShortUrlDocument = ShortUrl & Document;

export const ShortUrlSchema = SchemaFactory.createForClass(ShortUrl);

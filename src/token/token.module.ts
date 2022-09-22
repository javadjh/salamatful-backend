import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { tokenSchema } from './token.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Token', schema: tokenSchema }])],
  exports: [MongooseModule.forFeature([{ name: 'Token', schema: tokenSchema }])]
})
export class TokenModule { }

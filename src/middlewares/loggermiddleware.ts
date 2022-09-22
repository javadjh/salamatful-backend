import { Injectable, NestMiddleware } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response, NextFunction } from 'express';
import { Model } from 'mongoose';
import { TokensDocument } from 'src/token/token.schema';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    @InjectModel('Token') private tokenModel: Model<TokensDocument>) {
  }
  async use(req: Request, res: Response, next: NextFunction) {
    const tokenId = req.header('token')
    if (tokenId) {
      const token = await this.tokenModel.findOne({ token: tokenId }, "token userId")
      res.locals.userId = token && token.userId
    }
    next();
  }
}
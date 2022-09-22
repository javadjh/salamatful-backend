import { Controller, Get, Param, Query } from '@nestjs/common';
import path from 'path';
import { setMaxListeners } from 'process';
import { DiscountService } from './discount.service';

@Controller('discount')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Get('/:code')
  async getDiscount(
    @Param('code') code: string,
    @Query('priceId') priceId: string,
  ) {
    return await this.discountService.getDiscount(code, priceId);
  }
}

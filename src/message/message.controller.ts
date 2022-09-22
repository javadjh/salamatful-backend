import { Controller, Get } from '@nestjs/common';
import { MessageService } from './message.service';

@Controller('price')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}
  @Get('/')
  async getAll() {
    this.messageService.getAll();
  }
}

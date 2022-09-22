import { Body, Controller, Post } from '@nestjs/common';
import { CodeService } from './code.service';

@Controller('code')
export class CodeController {
  constructor(private readonly codeService: CodeService) {}

  @Post('/create')
  async createCode(@Body() body): Promise<any> {
    const { phone } = body;
    return await this.codeService.createCode({ phone });
  }

  @Post('/validate')
  async validateCode(@Body() body): Promise<any> {
    const { phone, code, pass } = body;
    return await this.codeService.validateCodeWithPhoneNumber({ phone, code, pass });
  }
}

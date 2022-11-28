import { Controller } from '@nestjs/common';
import { WebblogService } from './webblog.service';

@Controller('webblog')
export class WebblogController {
  constructor(private readonly webblogService: WebblogService) {}
}

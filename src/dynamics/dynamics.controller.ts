import { Controller } from '@nestjs/common';
import { DynamicsService } from './dynamics.service';

@Controller('dynamics')
export class DynamicsController {
  constructor(private readonly dynamicsService: DynamicsService) {}
}

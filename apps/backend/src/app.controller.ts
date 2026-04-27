import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  root() {
    return {
      service: 'signal-lab-backend',
      docs: '/api/docs',
      health: '/api/health',
    };
  }
}

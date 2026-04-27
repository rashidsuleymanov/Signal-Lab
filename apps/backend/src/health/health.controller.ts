import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOkResponse({
    schema: {
      example: { status: 'ok', timestamp: '2026-04-27T00:00:00.000Z' },
    },
  })
  getHealth() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}

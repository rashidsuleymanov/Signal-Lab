import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RunScenarioDto } from './dto/run-scenario.dto';
import { ScenariosService } from './scenarios.service';

@ApiTags('scenarios')
@Controller('scenarios')
export class ScenariosController {
  constructor(private readonly scenariosService: ScenariosService) {}

  @Get('runs')
  @ApiOkResponse({
    schema: {
      example: [
        {
          id: 'ckx...',
          type: 'success',
          status: 'completed',
          duration: 123,
          createdAt: '2026-04-27T00:00:00.000Z',
        },
      ],
    },
  })
  async listRecent() {
    return this.scenariosService.listRecent();
  }

  @Post('run')
  @ApiCreatedResponse({
    schema: {
      example: { id: 'ckx...', status: 'accepted', queuedAt: '2026-04-27T00:00:00.000Z' },
    },
  })
  async run(@Body() dto: RunScenarioDto) {
    return this.scenariosService.run(dto);
  }
}

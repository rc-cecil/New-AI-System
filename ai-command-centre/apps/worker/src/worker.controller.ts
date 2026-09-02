import { Controller, Get } from '@nestjs/common';

@Controller('worker')
export class WorkerController {
  @Get('health')
  getHealth() {
    return {
      ok: true,
      service: 'worker',
      timestamp: new Date().toISOString(),
    };
  }
}

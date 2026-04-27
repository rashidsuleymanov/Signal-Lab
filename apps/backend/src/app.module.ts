import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { HealthController } from './health/health.controller';
import { MetricsController } from './metrics/metrics.controller';
import { MetricsService } from './metrics/metrics.service';
import { HttpMetricsInterceptor } from './metrics/http-metrics.interceptor';
import { PrismaModule } from './prisma/prisma.module';
import { LoggerService } from './logger/logger.service';
import { SentryService } from './sentry/sentry.service';
import { ScenariosController } from './scenarios/scenarios.controller';
import { ScenariosService } from './scenarios/scenarios.service';

@Module({
  imports: [PrismaModule],
  controllers: [
    AppController,
    HealthController,
    MetricsController,
    ScenariosController,
  ],
  providers: [
    LoggerService,
    MetricsService,
    SentryService,
    ScenariosService,
    { provide: APP_INTERCEPTOR, useClass: HttpMetricsInterceptor },
  ],
})
export class AppModule {}

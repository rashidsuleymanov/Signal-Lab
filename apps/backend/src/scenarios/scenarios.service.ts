import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MetricsService } from '../metrics/metrics.service';
import { LoggerService } from '../logger/logger.service';
import { SentryService } from '../sentry/sentry.service';
import type { RunScenarioDto } from './dto/run-scenario.dto';

@Injectable()
export class ScenariosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly metrics: MetricsService,
    private readonly logger: LoggerService,
    private readonly sentry: SentryService,
  ) {}

  async listRecent() {
    return this.prisma.scenarioRun.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: {
        id: true,
        type: true,
        status: true,
        duration: true,
        error: true,
        createdAt: true,
      },
    });
  }

  async run(dto: RunScenarioDto) {
    const start = Date.now();

    const logBase = {
      scenarioType: dto.type,
      scenarioName: dto.name,
    };

    try {
      if (dto.type === 'validation_error') {
        this.sentry.addBreadcrumb('validation_error scenario requested', logBase);
        throw new BadRequestException('Validation error (demo scenario)');
      }

      if (dto.type === 'system_error') {
        // Intentional unhandled error path for demo
        throw new Error('System error (demo scenario)');
      }

      if (dto.type === 'slow_request') {
        const delayMs = 2000 + Math.floor(Math.random() * 3000);
        this.logger.warn('slow_request delay injected', {
          ...logBase,
          delayMs,
        });
        await new Promise((r) => setTimeout(r, delayMs));
      }

      if (dto.type === 'teapot') {
        const durationMs = Date.now() - start;
        const run = await this.prisma.scenarioRun.create({
          data: {
            type: dto.type,
            status: 'teapot',
            duration: durationMs,
            metadata: { easter: true, signal: 42, name: dto.name ?? null },
          },
          select: { id: true },
        });

        this.metrics.scenarioRunsTotal.inc({ type: dto.type, status: 'teapot' });
        this.metrics.scenarioRunDurationSeconds.observe(
          { type: dto.type },
          durationMs / 1000,
        );
        this.logger.info("I'm a teapot", {
          ...logBase,
          scenarioId: run.id,
          duration: durationMs,
          status: 'teapot',
          signal: 42,
        });

        throw new HttpException(
          { signal: 42, message: "I'm a teapot", id: run.id },
          HttpStatus.I_AM_A_TEAPOT,
        );
      }

      // success path
      const durationMs = Date.now() - start;
      const run = await this.prisma.scenarioRun.create({
        data: {
          type: dto.type,
          status: 'completed',
          duration: durationMs,
          metadata: { name: dto.name ?? null },
        },
        select: { id: true },
      });

      this.metrics.scenarioRunsTotal.inc({
        type: dto.type,
        status: 'completed',
      });
      this.metrics.scenarioRunDurationSeconds.observe(
        { type: dto.type },
        durationMs / 1000,
      );
      this.logger.info('scenario completed', {
        ...logBase,
        scenarioId: run.id,
        duration: durationMs,
        status: 'completed',
      });

      return { id: run.id, status: 'completed', duration: durationMs };
    } catch (err) {
      const durationMs = Date.now() - start;

      const isHttp = err instanceof HttpException;
      const statusCode = isHttp ? err.getStatus() : 500;
      const statusLabel =
        statusCode === 400
          ? 'validation_error'
          : statusCode === 418
            ? 'teapot'
            : 'system_error';

      this.metrics.scenarioRunsTotal.inc({
        type: dto.type,
        status: statusLabel,
      });
      this.metrics.scenarioRunDurationSeconds.observe(
        { type: dto.type },
        durationMs / 1000,
      );

      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error';

      // Persist the run for all non-teapot errors (teapot already persisted above).
      if (dto.type !== 'teapot') {
        const created = await this.prisma.scenarioRun.create({
          data: {
            type: dto.type,
            status: statusLabel,
            duration: durationMs,
            error: errorMessage,
            metadata: { name: dto.name ?? null },
          },
          select: { id: true },
        });

        this.logger.error('scenario failed', {
          ...logBase,
          scenarioId: created.id,
          duration: durationMs,
          status: statusLabel,
          error: errorMessage,
          statusCode,
        });

        if (statusCode >= 500) {
          this.sentry.captureException(err, {
            ...logBase,
            scenarioId: created.id,
            statusCode,
          });
        }
      }

      throw err;
    }
  }
}

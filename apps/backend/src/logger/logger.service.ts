import { Injectable } from '@nestjs/common';
import pino from 'pino';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

@Injectable()
export class LoggerService {
  private readonly logger = pino({
    level: process.env.LOG_LEVEL ?? 'info',
    base: { app: 'signal-lab' },
  });

  log(level: LogLevel, message: string, fields?: Record<string, unknown>) {
    this.logger[level]({ ...fields }, message);
  }

  info(message: string, fields?: Record<string, unknown>) {
    this.log('info', message, fields);
  }

  warn(message: string, fields?: Record<string, unknown>) {
    this.log('warn', message, fields);
  }

  error(message: string, fields?: Record<string, unknown>) {
    this.log('error', message, fields);
  }

  debug(message: string, fields?: Record<string, unknown>) {
    this.log('debug', message, fields);
  }
}

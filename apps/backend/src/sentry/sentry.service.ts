import { Injectable } from '@nestjs/common';
import * as Sentry from '@sentry/node';

@Injectable()
export class SentryService {
  private readonly enabled: boolean;

  constructor() {
    const dsn = process.env.SENTRY_DSN;
    this.enabled = Boolean(dsn);

    Sentry.init({
      dsn,
      environment: process.env.SENTRY_ENVIRONMENT ?? 'local',
      release: process.env.SENTRY_RELEASE,
      enabled: this.enabled,
      tracesSampleRate: 0,
    });
  }

  captureException(error: unknown, extras?: Record<string, unknown>) {
    if (!this.enabled) return;
    Sentry.captureException(error, { extra: extras });
  }

  addBreadcrumb(message: string, data?: Record<string, unknown>) {
    if (!this.enabled) return;
    Sentry.addBreadcrumb({ message, data });
  }
}

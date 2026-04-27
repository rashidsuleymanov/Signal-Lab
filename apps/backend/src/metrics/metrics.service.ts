import { Injectable } from '@nestjs/common';
import {
  Counter,
  Histogram,
  Registry,
  collectDefaultMetrics,
} from 'prom-client';

@Injectable()
export class MetricsService {
  readonly registry = new Registry();

  readonly scenarioRunsTotal: Counter<'type' | 'status'>;
  readonly scenarioRunDurationSeconds: Histogram<'type'>;
  readonly httpRequestsTotal: Counter<'method' | 'path' | 'status_code'>;

  constructor() {
    collectDefaultMetrics({ register: this.registry });

    this.scenarioRunsTotal = new Counter({
      name: 'scenario_runs_total',
      help: 'Total number of scenario runs',
      labelNames: ['type', 'status'],
      registers: [this.registry],
    });

    this.scenarioRunDurationSeconds = new Histogram({
      name: 'scenario_run_duration_seconds',
      help: 'Scenario run duration in seconds',
      labelNames: ['type'],
      buckets: [0.05, 0.1, 0.25, 0.5, 1, 2, 3, 5, 10],
      registers: [this.registry],
    });

    this.httpRequestsTotal = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'path', 'status_code'],
      registers: [this.registry],
    });
  }

  async metricsText() {
    return this.registry.metrics();
  }
}

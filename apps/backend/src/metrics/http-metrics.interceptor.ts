import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MetricsService } from './metrics.service';

@Injectable()
export class HttpMetricsInterceptor implements NestInterceptor {
  constructor(private readonly metrics: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const req = http.getRequest<Request>();
    const res = http.getResponse<Response>();

    const method = (req.method ?? 'UNKNOWN').toUpperCase();
    const path = req.originalUrl?.split('?')[0] ?? req.url ?? 'unknown';

    return next.handle().pipe(
      tap({
        next: () => {
          const status = String(res.statusCode ?? 200);
          this.metrics.httpRequestsTotal.inc({ method, path, status_code: status });
        },
        error: () => {
          const status = String(res.statusCode ?? 500);
          this.metrics.httpRequestsTotal.inc({ method, path, status_code: status });
        },
      }),
    );
  }
}

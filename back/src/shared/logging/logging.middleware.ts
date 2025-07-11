import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from './logger.service';

declare global {
  namespace Express {
    interface Request {
      correlationId?: string;
      startTime?: number;
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) { }

  use(req: Request, res: Response, next: NextFunction) {
    // Gerar correlation ID único para cada request
    req.correlationId = this.logger.generateCorrelationId();
    req.startTime = Date.now();

    // Adicionar correlation ID ao response header
    res.setHeader('X-Correlation-ID', req.correlationId);

    // Log do início da request
    this.logger.log(`Incoming request: ${req.method} ${req.originalUrl}`, {
      correlationId: req.correlationId,
      method: req.method,
      route: req.originalUrl,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      userId: req.user?.id,
      userRole: req.user?.role,
      type: 'http_request_start'
    });

    // Interceptar o response para logar o final da request
    const originalSend = res.send;
    const logger = this.logger; // Capturar referência para usar no closure

    res.send = function (body) {
      const responseTime = Date.now() - (req.startTime || Date.now());

      // Log do final da request
      logger.logHttpRequest({
        correlationId: req.correlationId,
        method: req.method,
        route: req.originalUrl,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        userId: req.user?.id,
        userRole: req.user?.role,
        responseTime,
        statusCode: res.statusCode,
      });

      return originalSend.call(this, body);
    };

    next();
  }
}

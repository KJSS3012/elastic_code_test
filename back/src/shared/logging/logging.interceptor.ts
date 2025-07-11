import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { LoggerService } from './logger.service';
import { Request } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse();
    const startTime = Date.now();

    const logContext = {
      correlationId: request.correlationId,
      userId: request.user?.id,
      userRole: request.user?.role,
      method: request.method,
      route: request.route?.path || request.originalUrl,
      ip: request.ip || request.connection.remoteAddress,
      userAgent: request.get('User-Agent'),
    };

    return next.handle().pipe(
      tap((data) => {
        const responseTime = Date.now() - startTime;

        this.logger.logHttpRequest({
          ...logContext,
          responseTime,
          statusCode: response.statusCode,
          type: 'http_response_success'
        });

        // Log específico para operações de negócio baseado na rota
        this.logBusinessOperationFromRoute(request.method, request.route?.path, true, {
          ...logContext,
          duration: responseTime,
          responseData: this.sanitizeResponseData(data)
        });
      }),
      catchError((error) => {
        const responseTime = Date.now() - startTime;
        const statusCode = error instanceof HttpException
          ? error.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;

        this.logger.error(`HTTP ${request.method} ${request.originalUrl} - Error`, error.stack, {
          ...logContext,
          responseTime,
          statusCode,
          error: error.message,
          type: 'http_response_error'
        });

        // Log específico para operações de negócio que falharam
        this.logBusinessOperationFromRoute(request.method, request.route?.path, false, {
          ...logContext,
          duration: responseTime,
          error: error.message
        });

        return throwError(() => error);
      }),
    );
  }

  private logBusinessOperationFromRoute(method: string, route: string, success: boolean, context: any) {
    if (!route) return;

    let operation = 'unknown';

    // Mapear rotas para operações de negócio
    if (route.includes('/crops')) {
      operation = this.getCrudOperation(method, 'crop');
    } else if (route.includes('/properties')) {
      operation = this.getCrudOperation(method, 'property');
    } else if (route.includes('/harvests')) {
      operation = this.getCrudOperation(method, 'harvest');
    } else if (route.includes('/farmers')) {
      operation = this.getCrudOperation(method, 'farmer');
    } else if (route.includes('/auth')) {
      operation = method === 'POST' ? 'user_authentication' : 'auth_operation';
    } else if (route.includes('/property-crop-harvest')) {
      operation = this.getCrudOperation(method, 'property_crop_harvest');
    }

    this.logger.logBusinessOperation(operation, success, context);
  }

  private getCrudOperation(method: string, entity: string): string {
    switch (method) {
      case 'POST':
        return `create_${entity}`;
      case 'GET':
        return `read_${entity}`;
      case 'PUT':
      case 'PATCH':
        return `update_${entity}`;
      case 'DELETE':
        return `delete_${entity}`;
      default:
        return `${method.toLowerCase()}_${entity}`;
    }
  }

  private sanitizeResponseData(data: any): any {
    if (!data || typeof data !== 'object') return data;

    // Remover dados sensíveis dos logs
    const sanitized = { ...data };
    if (sanitized.password) delete sanitized.password;
    if (sanitized.token) sanitized.token = '[REDACTED]';
    if (sanitized.refreshToken) sanitized.refreshToken = '[REDACTED]';

    return sanitized;
  }
}

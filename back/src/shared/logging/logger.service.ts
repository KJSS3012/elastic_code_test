import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import * as winston from 'winston';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

export interface LogContext {
  correlationId?: string;
  userId?: string;
  userRole?: string;
  route?: string;
  method?: string;
  ip?: string;
  userAgent?: string;
  responseTime?: number;
  statusCode?: number;
  requestId?: string;
  module?: string;
  action?: string;
  type?: string;
  error?: string;
  duration?: number;
  operation?: string;
  success?: boolean;
  table?: string;
  responseData?: any;
  environment?: string;
  port?: number | string;
  timestamp?: string;
  metadata?: Record<string, any>;
}

@Injectable()
export class LoggerService implements NestLoggerService {
  private logger: winston.Logger;

  constructor() {
    // Criar diretório de logs se não existir
    const logsDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logsDir)) {
      try {
        fs.mkdirSync(logsDir, { recursive: true });
      } catch (error) {
        console.warn('Could not create logs directory:', error.message);
      }
    }

    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
        winston.format.printf((info) => {
          const { timestamp, level, message, correlationId, userId, route, ...meta } = info;

          return JSON.stringify({
            timestamp,
            level,
            message,
            correlationId,
            userId,
            route,
            ...meta,
          });
        })
      ),
      defaultMeta: {
        service: 'elastic-back',
        environment: process.env.NODE_ENV || 'development',
      },
      transports: this.createTransports(logsDir),
    });
  }

  private createTransports(logsDir: string): winston.transport[] {
    const transports: winston.transport[] = [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
      })
    ];

    // Adicionar file transports apenas se o diretório existir
    if (fs.existsSync(logsDir)) {
      try {
        transports.push(
          new winston.transports.File({
            filename: path.join(logsDir, 'error.log'),
            level: 'error',
            format: winston.format.json()
          }),
          new winston.transports.File({
            filename: path.join(logsDir, 'combined.log'),
            format: winston.format.json()
          })
        );
      } catch (error) {
        console.warn('Could not create file transports:', error.message);
      }
    }

    return transports;
  }

  log(message: string, context?: LogContext) {
    this.logger.info(message, context);
  }

  error(message: string, trace?: string, context?: LogContext) {
    this.logger.error(message, { trace, ...context });
  }

  warn(message: string, context?: LogContext) {
    this.logger.warn(message, context);
  }

  debug(message: string, context?: LogContext) {
    this.logger.debug(message, context);
  }

  verbose(message: string, context?: LogContext) {
    this.logger.verbose(message, context);
  }

  logHttpRequest(context: LogContext & { responseTime: number; statusCode: number }) {
    const level = context.statusCode >= 400 ? 'error' : context.statusCode >= 300 ? 'warn' : 'info';

    this.logger.log(level, `HTTP ${context.method} ${context.route} - ${context.statusCode}`, {
      ...context,
      type: 'http_request'
    });
  }

  logDatabaseOperation(operation: string, table: string, duration: number, context?: LogContext) {
    this.logger.info(`Database ${operation} on ${table}`, {
      ...context,
      type: 'database_operation',
      operation,
      table,
      duration,
    });
  }

  logBusinessOperation(operation: string, success: boolean, context?: LogContext & { duration?: number }) {
    const level = success ? 'info' : 'error';
    this.logger.log(level, `Business operation: ${operation}`, {
      ...context,
      type: 'business_operation',
      operation,
      success,
    });
  }

  generateCorrelationId(): string {
    return uuidv4();
  }
}

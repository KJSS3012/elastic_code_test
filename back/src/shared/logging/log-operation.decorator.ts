import { SetMetadata } from '@nestjs/common';

export const LOG_OPERATION_KEY = 'log_operation';

export interface LogOperationOptions {
  operation: string;
  module?: string;
  logInput?: boolean;
  logOutput?: boolean;
  sensitiveFields?: string[];
}

export const LogOperation = (options: LogOperationOptions) =>
  SetMetadata(LOG_OPERATION_KEY, options);

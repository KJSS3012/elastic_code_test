import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayloadInterface } from '../../modules/auth/interface/jwt.payload.interface';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): JwtPayloadInterface => {
    const request = ctx.switchToHttp().getRequest();
    return request.farmer;
  },
);

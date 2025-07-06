import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayloadInterface } from 'src/modules/auth/interface/jwt.payload.interface';

export const Farmer = createParamDecorator(
  (data: keyof JwtPayloadInterface | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const farmer = request.farmer as JwtPayloadInterface;

    return data ? farmer?.[data] : farmer;
  },
);

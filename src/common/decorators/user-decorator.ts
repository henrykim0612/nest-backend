import {createParamDecorator, ExecutionContext} from "@nestjs/common";

// Custom Decorator
export const UserCustomDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
)
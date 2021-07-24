import {createParamDecorator, ExecutionContext} from "@nestjs/common";

// Express 에서 locals 라는 공통 변수에 보통 jwt 을 많이 저장해두는데, jwt 를 사용할 겅우 아래처럼 커스텀 데코레이터를 만들어 쓰면 좋다
export const TokenCustomDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const response = ctx.switchToHttp().getResponse();
    return response.locals.jwt;
  },
)

// JWT 쓰는 컨트롤러에 @TokenCustomDecorator jwt 이렇게 사용
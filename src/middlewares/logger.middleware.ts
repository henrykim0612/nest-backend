import {Injectable, Logger, NestMiddleware} from "@nestjs/common";
import {NextFunction, Request, Response} from "express";


@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  /***
      이 예제는 Nest 에서도 미들웨어를 장착 할 수 있다는 샘플을 보여준 것이고, 실무에서는 Nest morgan 을 적용해서 사용하자.
  ***/
  // Morgan 을 사용하기 위해 미들웨어처럼 만듬
  use(req: Request, res: Response, next: NextFunction): void {
    // 내부에서 실행되는 순서: 1
    const { ip, method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';
    // 내부에서 실행되는 순서: 3 => 왜 이게 3번이냐면 로그가 마지막에 finish 되서 찍히므로 res.on 으로 선언해준 것(그래서 나중에 실행됨)
    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');
      this.logger.log(`${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`);
    });
    // 내부에서 실행되는 순서: 2
    next();
  }

}
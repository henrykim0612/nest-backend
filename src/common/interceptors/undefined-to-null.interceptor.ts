import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from "@nestjs/common";
import {map, Observable} from "rxjs";

@Injectable()
export class UndefinedToNullInterceptor implements NestInterceptor {

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {

    // ---> 컨트롤러 가기 전 부분
    // <---

    // ---> 컨트롤러 호출되고 이후 부분
    // 데이터가 undefiled 라면 null 로 Response 를 통일해줌
    return next.handle().pipe( // (data) 는 컨트롤러 결과값임
      map((data) => data === undefined ? null : data)
    );
    // <---
  }

}

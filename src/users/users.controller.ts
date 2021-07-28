import {Body, Controller, Get, Post, Req, Res, UseGuards, UseInterceptors} from '@nestjs/common';
import { JoinRequestDto } from './dto/join.request.dto'
import {UsersService} from "./users.service";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {UserDto} from "../common/dto/user.dto";
import {UserCustomDecorator} from "../common/decorators/user.decorator";
import {UndefinedToNullInterceptor} from "../common/interceptors/undefinedToNull.interceptor";
import {LocalAuthGuard} from "../auth/local.auth.guard";
import {NotLoggedInGuard} from "../auth/not.logged.in.guard";
import {LoggedInGuard} from "../auth/logged.in.guard";

@UseInterceptors(UndefinedToNullInterceptor) // 이 컨트롤러에 인터셉터 장착
@ApiTags('User')
@Controller('api/users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  // @UseInterceptors(UndefinedToNullInterceptor) // 각각 개별로도 인터셉터 장착 가능함
  @ApiOperation({ summary: '내 정보 조회' })
  @ApiResponse({
    type: UserDto,
  })
  @Get()
  getUsers(@UserCustomDecorator() user) {
    // @Req req 를 사용해서 req.user 를 가져오는 방법보다는 커스텀 데코레이터를 사용하는 것이 더 좋음
    return user;
  }

  @ApiOperation({ summary: '회원가입' })
  @UseGuards(NotLoggedInGuard)
  @Post()
  async postUsers(@Body() body: JoinRequestDto) {
    await this.userService.join(body.email, body.nickname, body.password);
  }

  @ApiOperation({ summary: '로그인' })
  @ApiResponse({ // ApiResponse 쓰면 알아서 status: 200 이 된다
    status: 200,
    description: 'OK',
    type: UserDto,
  })
  @ApiResponse({ // ApiResponse 쓰면 알아서 status: 200 이 된다
    status: 500,
    description: 'Server error',
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  logIn(@UserCustomDecorator() user) {
    return user;
  }

  @ApiOperation({ summary: '로그아웃' })
  @UseGuards(LoggedInGuard)
  @Post('logout')
  logOut(@Req() req, @Res() res) {
    req.logOut();
    res.clearCookie('connect.sid', { httpOnly: true });
    res.send('OK');
  }
}

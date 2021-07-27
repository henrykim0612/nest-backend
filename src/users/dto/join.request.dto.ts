import {ApiProperty, PickType} from "@nestjs/swagger";
import {Users} from "../../entities/Users";
import {IsEmail, IsNotEmpty, IsString} from 'class-validator';

// PickType 을 사용하면 중복을 제거 할 수 있다. Users 에 있는 컬럼을 가져옴
// export class JoinRequestDto extends PickType(Users, ['email', 'nickname', 'password'] as const) {}

export class JoinRequestDto {

  @ApiProperty({
    example: 'hyeongjong90@gmail.com',
    description: 'Email',
    required: true
  })
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @ApiProperty({
    example: 'hyeongjong90@gmail.com',
    description: 'Nickname',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  public nickname: string;

  @ApiProperty({
    example: 'hyeongjong90@gmail.com',
    description: 'Password',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  public password: string;
}
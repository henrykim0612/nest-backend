import {ApiProperty} from "@nestjs/swagger";

export class JoinRequestDto {

  @ApiProperty({
    example: 'hyeongjong90@gmail.com',
    description: 'Email',
    required: true
  })
  public email: string;

  @ApiProperty({
    example: 'hyeongjong90@gmail.com',
    description: 'Nickname',
    required: true
  })
  public nickname: string;

  @ApiProperty({
    example: 'hyeongjong90@gmail.com',
    description: 'Password',
    required: true
  })
  public password: string;
}
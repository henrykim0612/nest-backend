import {ApiProperty} from "@nestjs/swagger";
import {JoinRequestDto} from "../../users/dto/join-request.dto";

export class UserDto extends JoinRequestDto{

  @ApiProperty({
    required: true,
    example: 1,
    description: 'ID',
  })
  id: number;

}
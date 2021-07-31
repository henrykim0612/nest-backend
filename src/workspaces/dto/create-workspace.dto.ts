import {ApiProperty, PickType} from "@nestjs/swagger";
import {IsNotEmpty, IsString} from "class-validator";
import {Workspaces} from "../../entities/Workspaces";

export class CreateWorkspaceDto extends PickType(Workspaces, ['url']){
  @ApiProperty({
    example: 'Test',
    description: 'Workspace name',
  })
  @IsString()
  @IsNotEmpty()
  public workspace: string;
}
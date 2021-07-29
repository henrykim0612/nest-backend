import {Body, Controller, Delete, Get, Injectable, Param, ParseIntPipe, Post} from '@nestjs/common';
import {ApiTags} from "@nestjs/swagger";
import {WorkspacesService} from "./workspaces.service";
import {UserCustomDecorator} from "../common/decorators/user.decorator";
import {Users} from "../entities/Users";
import {CreateWorkspaceDto} from "./dto/create.workspace.dto";

@ApiTags('Workspace')
@Controller('api/workspaces')
export class WorkspacesController {
  constructor(
    private readonly workspacesService: WorkspacesService
  ) {}

  // @Get('/:myId')
  // getMyWorkspaces(@Param('myId', ParseIntPipe) myId: number) { // @Param 이나 @Query 는 기본 string 이므로 number 타입으로 가져오지 않음. 그래서 ParseIntPipe 를 사용함.
  //   return this.workspacesService.findMyWorkspaces(myId);
  // }
  @Get()
  getMyWorkspaces(@UserCustomDecorator() user: Users) { // @Param 이나 @Query 는 기본 string 이므로 number 타입으로 가져오지 않음. 그래서 ParseIntPipe 를 사용함.
    return this.workspacesService.findMyWorkspaces(user.id);
  }

  @Post()
  createWorkspace(@UserCustomDecorator() user: Users, @Body() body: CreateWorkspaceDto) {

  }

  @Get(':url/members')
  getMemberAllFromWorkspaces() {

  }

  @Post(':url/members')
  inviteMembersToWorkspace() {

  }

  @Delete(':url/members/:id')
  kickMemberFromWorkspace() {

  }

  @Get(':url/users/:id')
  getMemberInfoInWorkspace() {

  }

}

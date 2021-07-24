import {Body, Controller, Get, Param, Post, Query} from '@nestjs/common';
import {ApiTags} from "@nestjs/swagger";

@ApiTags('Channel')
@Controller('api/workspaces/:url/channels')
export class ChannelsController {

  @Get()
  getChannelALl() {

  }

  @Get(':name')
  getSpecificChannel() {

  }

  @Post()
  createChannel() {

  }

  @Get(':name/chats')
  getChats(@Query() query, @Param() param) {
    console.log(query.perPage, query.page);
    console.log(param.id, param.url);
  }

  @Post()
  postChat(@Body() body) {

  }

  @Get(':name/members')
  getMemberAll() {

  }

  @Post(':name/members')
  inviteMembers() {

  }
}

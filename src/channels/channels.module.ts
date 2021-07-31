import { Module } from '@nestjs/common';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ChannelMembers} from "../entities/ChannelMembers";
import {Channels} from "../entities/Channels";
import {ChannelChats} from "../entities/ChannelChats";
import {Workspaces} from "../entities/Workspaces";
import {Users} from "../entities/Users";
import {EventsGateway} from "../events/events.gateway";

@Module({
  imports: [TypeOrmModule.forFeature([Channels, ChannelMembers, ChannelChats, Workspaces, Users])],
  controllers: [ChannelsController],
  providers: [ChannelsService, EventsGateway]
})
export class ChannelsModule {}

import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Workspaces} from "../entities/Workspaces";
import {Connection, Repository} from "typeorm";
import {Channels} from "../entities/Channels";
import {WorkspaceMembers} from "../entities/WorkspaceMembers";
import {ChannelMembers} from "../entities/ChannelMembers";
import {Users} from "../entities/Users";
import {Channel} from "diagnostics_channel";

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspaces)
    private workspacesRepository: Repository<Workspaces>,
    @InjectRepository(Channels)
    private channelsRepository: Repository<Channels>,
    @InjectRepository(WorkspaceMembers)
    private workspacesMemberRepository: Repository<WorkspaceMembers>,
    @InjectRepository(ChannelMembers)
    private channelMembersRepository: Repository<ChannelMembers>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private connection: Connection
  ) {}

  async findById(id: number) {
    return this.workspacesRepository.findOne({where: { id }});
  }

  async findMyWorkspaces(myId: number) {
    return this.workspacesRepository.find({
      where: {
        WorkspaceMembers: [{ userId: myId }],
      }
    });
  }

  async createWorkspace(name: string, url: string, myId: number) {
    // Transaction
    let result = true;
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // Workspace
      const workspace = new Workspaces();
      workspace.name = name;
      workspace.url = url;
      workspace.OwnerId = myId;
      const insertedWorkspace = await queryRunner.manager.save(workspace);
      // Channels & WorkspaceMembers
      const channel = new Channels();
      channel.name = '일반';
      channel.WorkspaceId = insertedWorkspace.id;
      const workspaceMember = new WorkspaceMembers();
      workspaceMember.UserId = myId;
      workspaceMember.WorkspaceId = insertedWorkspace.id;
      const[, insertedChannel] = await Promise.all([
        queryRunner.manager.save(workspaceMember),
        queryRunner.manager.save(channel),
      ]);
      // ChannelMembers
      const channelMember = new ChannelMembers();
      channelMember.UserId = myId;
      channelMember.ChannelId = insertedChannel.id;
      await queryRunner.manager.save(channelMember);
      // Commit
      await queryRunner.commitTransaction();
    } catch (err) {
      console.log('Rollback 실행..')
      await queryRunner.rollbackTransaction();
      result = false;
    } finally {
      await queryRunner.release();
    }
    return result;
  }

  async getWorkspaceMembers(url: string) {
    return await this.usersRepository
      .createQueryBuilder('users')
      .innerJoin('user.WorkspaceMembers', 'members')
      .innerJoin('members.Workspace', 'workspace', 'workspace.url = :url', { url })
      .getMany();
  }

}

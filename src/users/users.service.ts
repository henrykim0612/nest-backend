import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Connection, Repository} from "typeorm";
import {Users} from "../entities/Users";
import bcrypt from 'bcrypt';
import {WorkspaceMembers} from "../entities/WorkspaceMembers";
import {ChannelMembers} from "../entities/ChannelMembers";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    @InjectRepository(WorkspaceMembers)
    private workspaceMembersRepository: Repository<WorkspaceMembers>,
    @InjectRepository(ChannelMembers)
    private channelMembersRepository: Repository<ChannelMembers>,
    private connection: Connection
  ) {}

  // 회원가입
  async join(email: string, nickname: string, password: string) {
    const user = await this.userRepository.findOne({where: { email }});
    if (user) {
      // Existed user
      throw new UnauthorizedException('Existed user!');
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    // Transaction
    let result = true;
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // 사용자 저장
      const user = new Users();
      user.email = email;
      user.nickname = nickname;
      user.password = hashedPassword;
      const insertedUser = await queryRunner.manager.save(user);
      // 생성된 사용자의 워크스페이스 생성
      const workspaceMember = new WorkspaceMembers();
      workspaceMember.WorkspaceId = 1;
      workspaceMember.UserId = insertedUser.id;
      await queryRunner.manager.save(workspaceMember);
      // 생성된 사용자의 채널 생성
      const channelMember = new ChannelMembers();
      channelMember.ChannelId = 1;
      channelMember.UserId = insertedUser.id;
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

}

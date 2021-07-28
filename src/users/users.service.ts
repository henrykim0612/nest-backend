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
      const insertedUser = await queryRunner.manager.save(Users, {
        email,
        nickname,
        password: hashedPassword,
      });
      // 생성된 사용자의 워크스페이스 생성
      await queryRunner.manager.save(WorkspaceMembers, {
        WorkspaceId: 1,
        UserId: insertedUser.id,
      });
      // 생성된 사용자의 채널 생성
      await queryRunner.manager.save(ChannelMembers, {
        ChannelId: 1,
        UserId: insertedUser.id,
      });
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

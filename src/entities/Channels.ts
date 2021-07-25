import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ChannelChats } from './ChannelChats';
import { ChannelMembers } from './ChannelMembers';
import { Users } from './Users';
import { Workspaces } from './Workspaces';
import dotenv from 'dotenv';

dotenv.config();

@Index('WorkspaceId', ['WorkspaceId'], {})
@Entity({ schema: process.env.DB_DATABASE })
export class Channels {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', length: 30 })
  name: string;

  @Column('tinyint', {
    name: 'private',
    nullable: true,
    width: 1,
    default: () => "'0'",
  })
  private: boolean | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('int', { name: 'WorkspaceId', nullable: true })
  WorkspaceId: number | null;

  @OneToMany(() => ChannelChats, (channelchats) => channelchats.Channel)
  ChannelChats: ChannelChats[]; // 이렇게 대문자로 해놓은 컬럼들은 가상의 컬럼임을 구별하기 위해 일반 컬럼과 구별해 놓음

  @OneToMany(() => ChannelMembers, (channelMembers) => channelMembers.Channel, {
    cascade: ['insert'], // 두개의 테이블을 동시에 수정해야 하는 경우에는 이 옵션 필수. 없으면 수정 안됨
  })
  ChannelMembers: ChannelMembers[];

  @ManyToMany(() => Users, (users) => users.Channels)
  Members: Users[];

  @ManyToOne(() => Workspaces, (workspaces) => workspaces.Channels, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'WorkspaceId', referencedColumnName: 'id' }]) // JOIN 컬럼은 source, target 아무곳에 하나만 적어도 되지만, 보통 Foreign key 가 존재하는 테이블쪽에 적는다
  Workspace: Workspaces;
}
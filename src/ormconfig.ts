import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import dotenv from 'dotenv';
import {ChannelChats} from "./entities/ChannelChats";
import {ChannelMembers} from "./entities/ChannelMembers";
import {Channels} from "./entities/Channels";
import {DMs} from "./entities/DMs";
import {Mentions} from "./entities/Mentions";
import {Users} from "./entities/Users";
import {WorkspaceMembers} from "./entities/WorkspaceMembers";
import {Workspaces} from "./entities/Workspaces";

dotenv.config();
const ormConfig: TypeOrmModuleOptions = {
  type: 'mariadb',
  host: 'localhost',
  port: 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [
    ChannelChats,
    ChannelMembers,
    Channels,
    DMs,
    Mentions,
    Users,
    WorkspaceMembers,
    Workspaces,
  ],
  // migrations: [__dirname + '/src/migrations/*.ts'],
  // cli: { migrationsDir: 'src/migrations' },
  // autoLoadEntities: true,
  charset: 'utf8mb4',
  synchronize: false, // 이거는 개발 환경인 경우에만(한번 true 로 해서 테이블을 자동으로 만들어 주면 false 로 바꾸는게 안전..)
  logging: true,
  keepConnectionAlive: true,
};

export = ormConfig;
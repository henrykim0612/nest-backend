import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import dotenv from 'dotenv';
import {ChannelChats} from "./src/entities/ChannelChats";
import {ChannelMembers} from "./src/entities/ChannelMembers";
import {Channels} from "./src/entities/Channels";
import {DMs} from "./src/entities/DMs";
import {Mentions} from "./src/entities/Mentions";
import {Users} from "./src/entities/Users";
import {WorkspaceMembers} from "./src/entities/WorkspaceMembers";
import {Workspaces} from "./src/entities/Workspaces";

/**
 *  src 폴더 안쪽에도 있는데 왜 여기에도 이 파일이 있냐면, 마이그레이션 옵션때문에 밖에 놨다고 한다..(제로초 피셜) src 폴더 안쪽에 있는 경우에는
 *  오류가 난다고 하던데 나중에 해봐야 할 듯..
 */
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
  migrations: [__dirname + '/src/migrations/*.ts'],
  cli: { migrationsDir: 'src/migrations' },
  autoLoadEntities: true,
  charset: 'utf8mb4',
  synchronize: false, // 이거는 개발 환경인 경우에만(한번 true 로 해서 테이블을 자동으로 만들어 주면 false 로 바꾸는게 안전..)
  logging: true,
  keepConnectionAlive: true,
};

export = ormConfig;
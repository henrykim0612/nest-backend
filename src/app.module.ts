import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { ConfigModule } from "@nestjs/config"; // .env 같은 기능을 쓰기위해서 필요
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {LoggerMiddleware} from "./middlewares/logger.middleware";
import { UsersModule } from './users/users.module';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { ChannelsModule } from './channels/channels.module';
import { DmsModule } from './dms/dms.module';

@Module({
  imports: [ConfigModule.forRoot(), UsersModule, WorkspacesModule, ChannelsModule, DmsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer): any {
    // Logger 미들웨어를 연결해줌
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

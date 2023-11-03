import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import { join } from 'path';
import { UsersModule } from "./modules/users/users.module";
import { ArticlesModule } from "./modules/articles/articles.module";
import { CryptoModule } from "./modules/crypto/crypto.module";
import { AuthModule } from "./modules/auth/auth.module";

@Module({
  imports: [
    // модуль для рабты с базой
    TypeOrmModule.forRoot({
      host: 'localhost',
      username: 'postgres',
      password: '111111',
      database: 'anotherKnowlegeBase',
      logging: true,
      type: 'postgres',
      port: 5432,
      schema: 'public',
      synchronize: false,
      connectTimeoutMS: 60000,
      entities: [join(__dirname, './entities/index{.ts,.js}')]
    }),
    AuthModule,
    CryptoModule,
    UsersModule,
    ArticlesModule
  ],
})
export class MainModule {}

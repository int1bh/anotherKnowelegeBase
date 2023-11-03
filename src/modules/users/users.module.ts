import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../../entities';
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { CryptoModule } from "../crypto/crypto.module";

// модуль для работы с пользователями
@Module({
    imports: [TypeOrmModule.forFeature([Users]), CryptoModule],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService]
})
export class UsersModule {}

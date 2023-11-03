import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Articles } from '../../entities';
import { ArticlesController } from "./articles.controller";
import { ArticlesService } from "./articles.service";

// модуль для работы со статьями
@Module({
    imports: [TypeOrmModule.forFeature([Articles])
    ],
    controllers: [ArticlesController],
    providers: [ArticlesService]
})
export class ArticlesModule {}

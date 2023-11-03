import {Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UseInterceptors} from '@nestjs/common';
import { ApiParam, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoggingTimeInterceptor } from '../../common/interceptors/logging-time.interceptor';
import {ArticlesDto, CreateArticlesDto} from "./dto/articles.dto";
import { ArticlesService } from "./articles.service";
import {AuthenticatedGuard} from "../../common/guards/authenticated.guard";

@Controller('articles')
@UseInterceptors(LoggingTimeInterceptor)
@ApiTags('Статьи')
export class ArticlesController {
    constructor(private readonly articlesService: ArticlesService) {}

    @UseGuards(AuthenticatedGuard)
    @Get()
    @ApiOperation({ summary: 'Получить все статьи' })
    @ApiResponse({ status: 200, description: 'Данные получены успешно', type: ArticlesDto, isArray: true })
    async findAllArticles(): Promise<ArticlesDto[]> {
        return await this.articlesService.findAllArticles();
    }
    @Get('all-public')
    @ApiOperation({ summary: 'Получить все публичные статьи' })
    @ApiResponse({ status: 200, description: 'Данные получены успешно', type: ArticlesDto, isArray: true })
    async findAllPublicArticles(): Promise<ArticlesDto[]> {
        return await this.articlesService.findAllPublicArticles();
    }

    @UseGuards(AuthenticatedGuard)
    @Get('all-private')
    @ApiOperation({ summary: 'Получить все внутренние статьи' })
    @ApiResponse({ status: 200, description: 'Данные получены успешно', type: ArticlesDto, isArray: true })
    async findAllPrivateArticles(): Promise<ArticlesDto[]> {
        return await this.articlesService.findAllPrivateArticles();
    }

    @UseGuards(AuthenticatedGuard)
    @Get(':id')
    @ApiOperation({ summary: 'Получить статью по ID' })
    @ApiResponse({ status: 200, description: 'Запись получена успешно', type: ArticlesDto })
    @ApiParam({ name: 'id', required: true, type: 'integer', description: 'Идентификатор записи' })
    async findOne(@Param('id') id: number): Promise<ArticlesDto> {
        return await this.articlesService.findOne(id);
    }

    @UseGuards(AuthenticatedGuard)
    @Get('by-tag/:tag')
    @ApiOperation({ summary: 'Получить список статей по тегу' })
    @ApiResponse({ status: 200, description: 'Запись получена успешно', type: ArticlesDto, isArray: true })
    @ApiParam({ name: 'tag', required: true, type: 'string', description: 'Идентификатор записи' })
    async findAllArticlesByTag(@Param('tag') tag: string): Promise<ArticlesDto[]> {
        return await this.articlesService.findAllArticlesByTag(tag);
    }

    @UseGuards(AuthenticatedGuard)
    @Post()
    @ApiOperation({ summary: 'Добавить новую статью' })
    @ApiResponse({ status: 201, description: 'Запись успешно создана', type: ArticlesDto })
    async createArticle(@Body() createArticlesDto: CreateArticlesDto): Promise<ArticlesDto> {
        return await this.articlesService.createArticle(createArticlesDto);
    }

    @UseGuards(AuthenticatedGuard)
    @Put(':id')
    @ApiOperation({ summary: 'Изменить статью' })
    @ApiResponse({ status: 200, description: 'Запись успешно изменена', type: ArticlesDto })
    @ApiParam({ name: 'id', required: true, type: 'integer', description: 'Идентификатор записи' })
    async update(@Param('id') id: number, @Body() updateArticlesDto: ArticlesDto): Promise<ArticlesDto> {
        return await this.articlesService.updateArticle(id, updateArticlesDto);
    }

    @UseGuards(AuthenticatedGuard)
    @Delete(':id')
    @ApiOperation({ summary: 'Удалить статью' })
    @ApiResponse({ status: 200, description: 'Запись успешно удалена' })
    @ApiParam({ name: 'id', required: true, type: 'integer', description: 'Идентификатор записи' })
    async removeArticle(@Param('id') id: number): Promise<void> {
        return await this.articlesService.removeArticle(id);
    }
}

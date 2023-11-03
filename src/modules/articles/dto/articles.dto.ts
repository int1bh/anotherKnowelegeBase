/* tslint:disable:max-classes-per-file */
import { ApiProperty, OmitType } from '@nestjs/swagger';
import {IsNumber, IsOptional, IsString, IsBoolean} from 'class-validator';

export class ArticlesDto {
    @ApiProperty({ description: 'Идентификатор', example: 1, type: 'bigint' })
    @IsOptional()
    @IsNumber()
    readonly id?: number;

    @ApiProperty({ description: 'Заголовок статьи', example: 'Когда чайки летают жопой вперед', required: true })
    @IsString()
    title: string;

    @ApiProperty({ description: 'Содержание статьи', example: 'Когда дует норд-ост чайки летают жопой вперед', required: true })
    @IsString()
    content: string;

    @ApiProperty({ description: 'Теги', example: 'Чайки, ветер, полет', required: true })
    @IsOptional()
    @IsString()
    tags?: string;

    @ApiProperty({ description: 'Признак публичной статьи', example: true })
    @IsOptional()
    @IsBoolean()
    isPublic: boolean;
}

export class CreateArticlesDto extends OmitType(ArticlesDto, ['id']) {}

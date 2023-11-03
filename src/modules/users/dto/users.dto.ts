/* tslint:disable:max-classes-per-file */
import { ApiProperty, OmitType } from '@nestjs/swagger';
import {IsNumber, IsOptional, IsString, IsEmail} from 'class-validator';

export class UsersDto {
    @ApiProperty({ description: 'Идентификатор', example: 1, type: 'bigint' })
    @IsOptional()
    @IsNumber()
    readonly id?: number;

    @ApiProperty({ description: 'ФИО', example: 'Иванов Иван Иванович' })
    @IsString()
    fio: string;

    @ApiProperty({ description: 'Почта', example: 'Mail@mail.ru', required: true })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'Пароль (хэш)', example: 'hjkhkj46ljlkh2' })
    @IsString()
    password: string;
}

export class CreateUsersDto extends OmitType(UsersDto, ['id']) {}

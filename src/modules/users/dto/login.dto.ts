import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsString} from "class-validator";

export class LoginUserDto {
    @ApiProperty({ description: 'Почта', example: 'email@mail.ru', required: true })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'Пароль', example: 'password', required: true })
    @IsString()
    password: string;
}
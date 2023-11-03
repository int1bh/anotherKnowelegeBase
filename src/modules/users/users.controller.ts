import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UseInterceptors, Req } from '@nestjs/common';
import { ApiParam, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoggingTimeInterceptor } from '../../common/interceptors/logging-time.interceptor';
import { CreateUsersDto, UsersDto } from "./dto/users.dto";
import { UsersService } from "./users.service";
import { LocalAuthGuard } from "../../common/guards/local.auth.guard";
import { AuthenticatedGuard } from "../../common/guards/authenticated.guard";
import { LoginUserDto } from "./dto/login.dto";

@Controller('users')
@UseInterceptors(LoggingTimeInterceptor)
@ApiTags('Пользователи')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    @UseGuards(AuthenticatedGuard)
    @Get()
    @ApiOperation({ summary: 'Получить всех пользователей' })
    @ApiResponse({ status: 200, description: 'Данные получены успешно', type: UsersDto, isArray: true })
    async findAll(): Promise<UsersDto[]> {
        return await this.usersService.findAll();
    }

    @UseGuards(AuthenticatedGuard)
    @Get('by-email/:email')
    @ApiOperation({ summary: 'Получить пользователя по email' })
    @ApiResponse({ status: 200, description: 'Запись получена успешно', type: UsersDto })
    @ApiParam({ name: 'email', required: true, type: 'string', description: 'Идентификатор записи' })
    async findUserByEmail(@Param('email') email: string): Promise<UsersDto> {
        return await this.usersService.findUserByEmail(email);
    }

    @Get('logout')
    @ApiOperation({ summary: 'Выход пользователя' })
    logout(@Req() req): any {
        req.session.destroy()
        return { msg: 'Пользователь вышел' }
    }
    @UseGuards(AuthenticatedGuard)
    @Get(':id')
    @ApiOperation({ summary: 'Получить пользователя по ID' })
    @ApiResponse({ status: 200, description: 'Запись получена успешно', type: UsersDto })
    @ApiParam({ name: 'id', required: true, type: 'integer', description: 'Идентификатор записи' })
    async findOne(@Param('id') id: number): Promise<UsersDto> {
        return await this.usersService.findOne(id);
    }

    @Post('signup')
    @ApiOperation({ summary: 'Регистрация пользователя' })
    @ApiResponse({ status: 201, description: 'Запись успешно создана', type: UsersDto })
    async create(@Body() createUsersDto: CreateUsersDto): Promise<UsersDto> {
        return await this.usersService.create(createUsersDto);
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    @ApiOperation({ summary: 'Вход пользователя' })
    login(@Req() req, @Body() loginUserDto: LoginUserDto): any {
        return { User: req.user, msg: 'Пользователь вошёл' };
    };

    @UseGuards(AuthenticatedGuard)
    @Put(':id')
    @ApiOperation({ summary: 'Изменить запись' })
    @ApiResponse({ status: 200, description: 'Запись успешно изменена', type: UsersDto })
    @ApiParam({ name: 'id', required: true, type: 'integer', description: 'Идентификатор записи' })
    async changePassword(@Param('id') id: number, @Body() updateUsersDto: UsersDto): Promise<UsersDto> {
        return await this.usersService.changePassword(id, updateUsersDto);
    }

    @UseGuards(AuthenticatedGuard)
    @Delete(':id')
    @ApiOperation({ summary: 'Удалить запись' })
    @ApiResponse({ status: 200, description: 'Запись успешно удалена' })
    @ApiParam({ name: 'id', required: true, type: 'integer', description: 'Идентификатор записи' })
    async removeUser(@Param('id') id: number): Promise<void> {
        return await this.usersService.removeUser(id);
    }
}

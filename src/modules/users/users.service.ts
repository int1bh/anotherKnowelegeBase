import {HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Users } from '../../entities';
import {CreateUsersDto, UsersDto} from "./dto/users.dto";
import {Tools} from "../../common/helper/tools";
import {CryptoService} from "../crypto/crypto.service";
import {ICryptoService} from "../crypto/interface/crypto-interface";
import {IUsersService} from "./interface/users-interface";

@Injectable()
export class UsersService implements IUsersService {
    constructor(
        @InjectRepository(Users) private readonly usersRepository: Repository<Users>,
        @Inject(CryptoService) private readonly cryptoService: ICryptoService
        ) {
    }

    async findAll(): Promise<UsersDto[]> {
        return await this.usersRepository.find({order: {fio: 'ASC'}});
    }

    async findUserByEmail(email: string): Promise<UsersDto> {
        return await this.usersRepository.findOne({where: {email}});
    }

    async findOne(id: number, transactionalEntityManager?: EntityManager): Promise<UsersDto> {
        const usersRepository = transactionalEntityManager ? transactionalEntityManager.getRepository(Users) : this.usersRepository;
        const findRec = await usersRepository.findOne({where: {id}});
        if (findRec) {
            return findRec;
        }
        throw new HttpException('Запись не найдена!', HttpStatus.NOT_FOUND);
    }

    async create(recNew: CreateUsersDto): Promise<any> {
        try {
            if (await this.usersRepository.findOne({where: {email: recNew.email}})) {
                throw new HttpException(`Пользователь с таким email уже есть`, HttpStatus.BAD_REQUEST);
            }
            let resultRecord: UsersDto = null;
            await this.usersRepository.manager.transaction('READ COMMITTED', async (transactionalEntityManager) => {
                const newRecord = new Users();
                newRecord.fio = recNew.fio;
                newRecord.email = recNew.email;
                newRecord.password = this.cryptoService.cipher(recNew.password);

                await transactionalEntityManager.save<Users>(newRecord);
                resultRecord = await this.findOne(newRecord.id, transactionalEntityManager);
            });
            return {
                msg: 'User successfully registered',
                userId: resultRecord.id,
                userName: resultRecord.email
            };
        } catch (err) {
            throw new HttpException(err.message, err.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async changePassword(id: number, recUpdate: UsersDto): Promise<UsersDto> {
        try {
            const updateRecord = await this.usersRepository.findOne({where: {id}});
            if (!updateRecord) {
                throw new HttpException(`Запись для изменения не найдена`, HttpStatus.NOT_FOUND);
            }
            const oldRecord = Tools.cloneObject(updateRecord);
            updateRecord.password = this.cryptoService.cipher(recUpdate.password);

            // если пароль менялся, то сохраняем
            if (oldRecord.password === updateRecord.password) {
                return oldRecord;
            }
            await this.usersRepository.save<Users>(updateRecord);
            return updateRecord;
        } catch (err) {
            throw new HttpException(err.message, err.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async removeUser(id: number): Promise<void> {
        try {
            const removeRecord = await this.usersRepository.findOne({ where: { id }});
            if (!removeRecord) {
                throw new HttpException(`Запись для удаления не найдена`, HttpStatus.NOT_FOUND);
            }
            await this.usersRepository.delete(id);
        } catch (err) {
            throw new HttpException(err.message, err.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}


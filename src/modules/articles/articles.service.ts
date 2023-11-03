import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {EntityManager, Like, Repository} from 'typeorm';
import { Articles } from '../../entities';
import {ArticlesDto, CreateArticlesDto} from "./dto/articles.dto";
import {Tools} from "../../common/helper/tools";

@Injectable()
export class ArticlesService {
    constructor(@InjectRepository(Articles) private readonly articlesRepository: Repository<Articles>) {}

    async findAllArticles(): Promise<ArticlesDto[]> {
        return await this.articlesRepository.find();
    }
    async findAllPublicArticles(): Promise<ArticlesDto[]> {
        return await this.articlesRepository.find({where: { isPublic: true }});
    }

    async findAllPrivateArticles(): Promise<ArticlesDto[]> {
        return await this.articlesRepository.find({where: { isPublic: false }});
    }

    async findAllArticlesByTag(tag: string): Promise<ArticlesDto[]> {
        return await this.articlesRepository.find({where: { tags: Like(`%${tag}%`) }});
    }

    async findOne(id: number, transactionalEntityManager?: EntityManager): Promise<ArticlesDto> {
        const articlesRepository = transactionalEntityManager ? transactionalEntityManager.getRepository(Articles) : this.articlesRepository;
        const findRec = await articlesRepository.findOne({ where: { id }});
        if (findRec) {
            return findRec;
        }
        throw new HttpException('Запись не найдена!', HttpStatus.NOT_FOUND);
    }

    async createArticle(recNew: CreateArticlesDto): Promise<ArticlesDto> {
        try {
            if (await this.articlesRepository.findOne({ where: { title: recNew.title } })) {
                throw new HttpException(`Статья с таким заголовком уже есть`, HttpStatus.BAD_REQUEST);
            }

            let resultRecord: ArticlesDto = null;
            await this.articlesRepository.manager.transaction('READ COMMITTED', async (transactionalEntityManager) => {
                const newRecord = new Articles();
                newRecord.title = recNew.title;
                newRecord.content = recNew.content;
                newRecord.tags = recNew.tags;
                newRecord.isPublic = recNew.isPublic;

                await transactionalEntityManager.save<Articles>(newRecord);
                resultRecord = await this.findOne(newRecord.id, transactionalEntityManager);
            });
            return resultRecord;
        } catch (err) {
            throw new HttpException(err.message, err.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateArticle(id: number, recUpdate: ArticlesDto): Promise<ArticlesDto> {
        try {
            const updateRecord = await this.articlesRepository.findOne({ where: { id }});
            if (!updateRecord) {
                throw new HttpException(`Запись для изменения не найдена`, HttpStatus.NOT_FOUND);
            }
            const oldRecord = Tools.cloneObject(updateRecord);
            updateRecord.title = recUpdate.title;
            updateRecord.content = recUpdate.content;
            updateRecord.tags = recUpdate.tags;
            updateRecord.isPublic = recUpdate.isPublic;
            // если что то менялось, то сохраняем
            if (
                oldRecord.title === updateRecord.title &&
                oldRecord.content === updateRecord.content &&
                oldRecord.tags === updateRecord.tags &&
                oldRecord.isPublic === updateRecord.isPublic
            ) {
                return oldRecord;
            }
            await this.articlesRepository.save<Articles>(updateRecord);
            return updateRecord;
        } catch (err) {
            throw new HttpException(err.message, err.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async removeArticle(id: number): Promise<void> {
        try {
            const removeRecord = await this.articlesRepository.findOne({ where: { id }});
            if (!removeRecord) {
                throw new HttpException(`Запись для удаления не найдена`, HttpStatus.NOT_FOUND);
            }
            await this.articlesRepository.delete(id);
        } catch (err) {
            throw new HttpException(err.message, err.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

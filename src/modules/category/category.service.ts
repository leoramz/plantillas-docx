import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Status } from '../../utils/status.enum.utils';
import { Category } from './category.entity';
import { CategoryRepository } from './category.repository';
import { CreateCategoryDto, DeleteCategoryDto, ReadCategoryDto, UpdateCategoryDto } from './dto';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(CategoryRepository)
        private readonly _categoryRepository: CategoryRepository
    ) {}

    async get(categoryId: number): Promise<ReadCategoryDto> {
        if (!categoryId) {
            throw new BadRequestException('Category ID must be sent.');
        }

        const category: Category = await this._categoryRepository.findOne(categoryId, {
            where: { status: Status.ACTIVE },
            relations: ['variables']
        });

        if (!category) {
            throw new NotFoundException('This category does not exists.');
        }

        return plainToClass(ReadCategoryDto, category);
    }

    async getAll(): Promise<ReadCategoryDto[]> {
        const categories: Category[] = await this._categoryRepository.find({
            where: { status: Status.ACTIVE },
            relations: ['variables']
        });

        if (categories.length === 0) {
            throw new NotFoundException('Catetories is empty.');
        }

        return categories.map(
            (category: Category) => plainToClass(ReadCategoryDto, category) 
        );
    }

    async create(category: Partial<CreateCategoryDto>): Promise<ReadCategoryDto> {
        const sCategory: Category = await this._categoryRepository.save(category);

        return plainToClass(ReadCategoryDto, sCategory);
    }

    async update(categoryId: number, category: Partial<UpdateCategoryDto>): Promise<ReadCategoryDto> {
        const fCategory: Category = await this._categoryRepository.findOne(categoryId, {
            where: { status: Status.ACTIVE }
        });

        if (!fCategory) {
            throw new NotFoundException('This category does not exists.');
        }

        fCategory.name = category.name;
        fCategory.description = category.description;

        const uCategory: Category = await this._categoryRepository.save(fCategory);

        return plainToClass(ReadCategoryDto, uCategory);
    }

    async delete(categoryId: number): Promise<DeleteCategoryDto> {
        const fCategory: Category = await this._categoryRepository.findOne(categoryId, {
            where: { status: Status.ACTIVE }
        });

        if (!fCategory) {
            throw new NotFoundException('This category does not exists.');
        }

        await this._categoryRepository.update(categoryId, {
            status: Status.INACTIVE
        });

        const message: string = 'This category has been removed.';

        return plainToClass(DeleteCategoryDto, { message, deleted_category: fCategory });
    }
}

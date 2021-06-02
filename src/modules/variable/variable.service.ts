import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { In } from 'typeorm';
import { Status } from '../../shared/status.enum';
import { Category } from '../category/category.entity';
import { CategoryRepository } from '../category/category.repository';
import { CreateVariableDto, ReadVariableDto, UpdateVariableDto, DeleteVariableDto } from './dto';
import { Variable } from './variable.entity';
import { VariableRepository } from './variable.repository';

@Injectable()
export class VariableService {
    constructor(
        @InjectRepository(VariableRepository)
        private readonly _variableRepository: VariableRepository,
        @InjectRepository(CategoryRepository)
        private readonly _categoryRepository: CategoryRepository
    ) {}

    async get(variableId: number): Promise<ReadVariableDto> {
        if (!variableId) {
            throw new BadRequestException('Variable ID must be sent.');
        }

        const variable: Variable = await this._variableRepository.findOne(variableId, {
            where: { status: Status.ACTIVE },
            relations: ['values']
        });

        if (!variable) {
            throw new NotFoundException('This variable does not exists.');
        }

        return plainToClass(ReadVariableDto, variable);
    }

    async getAll(): Promise<ReadVariableDto[]> {
        const variables: Variable[] = await this._variableRepository.find({
            where: { status: Status.ACTIVE },
            relations: ['values']
        });

        if (variables.length === 0) {
            throw new NotFoundException('Catetories is empty.');
        }

        return variables.map(
            (variable: Variable) => plainToClass(ReadVariableDto, variable) 
        );
    }

    async getVariableByCategory(categoryId: number): Promise<ReadVariableDto[]> {
        if (!categoryId) {
            throw new BadRequestException('Category ID must be sent.');
        }

        const variables: Variable[] = await this._variableRepository.find({
            where: { status: Status.ACTIVE, categories: In([categoryId]) },
            relations: ['values']
        });

        return variables.map(variable => plainToClass(ReadVariableDto, variable));
    }

    async create(variable: Partial<CreateVariableDto>): Promise<ReadVariableDto> {
        //const { name, description, type_variable, category } = variable;
        const fCategory: Category = await this._categoryRepository.findOne(variable.category, {
            where: { status: Status.ACTIVE }
        });

        if (!fCategory) {
            throw new NotFoundException(`There's not an category with this id: ${variable.category}.`);
        }
        
        const sVariable: Variable = await this._variableRepository.save({
            name: variable.name,
            description: variable.description,
            type_variable: variable.type_variable,
            category: fCategory
        });

        return plainToClass(ReadVariableDto, sVariable);
    }

    async update(variableId: number, variable: Partial<UpdateVariableDto>): Promise<ReadVariableDto> {
        const fVariable: Variable = await this._variableRepository.findOne(variableId, {
            where: { status: Status.ACTIVE }
        });

        if (!fVariable) {
            throw new NotFoundException('This variable does not exists.');
        }

        const fCategory: Category = await this._categoryRepository.findOne(variable.categoryId, {
            where: { status: Status.ACTIVE }
        });

        if (!fCategory) {
            throw new NotFoundException(`There's not an category with this id: ${variable.categoryId}.`);
        }

        fVariable.name = variable.name;
        fVariable.description = variable.description;
        fVariable.type_variable = variable.type_variable;
        fVariable.category = fCategory;

        const uVariable: Variable = await this._variableRepository.save(fVariable);

        return plainToClass(ReadVariableDto, uVariable);
    }

    async delete(variableId: number): Promise<DeleteVariableDto> {
        const fVariable: Variable = await this._variableRepository.findOne(variableId, {
            where: { status: Status.ACTIVE }
        });

        if (!fVariable) {
            throw new NotFoundException('This variable does not exists.');
        }

        await this._variableRepository.update(variableId, {
            status: Status.INACTIVE
        });

        const message: string = 'This variable has been removed.';

        return plainToClass(DeleteVariableDto, { message, deleted_variable: fVariable });
    }
}

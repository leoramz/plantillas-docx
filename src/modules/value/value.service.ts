import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { In } from 'typeorm';
import { Status } from '../../utils/status.enum';
import { Variable } from '../variable/variable.entity';
import { VariableRepository } from '../variable/variable.repository';
import { CreateValueDto, DeleteValueDto, ReadValueDto, UpdateValueDto } from './dto';
import { Value } from './value.entity';
import { ValueRepository } from './value.repository';

@Injectable()
export class ValueService {
    constructor(
        @InjectRepository(ValueRepository)
        private readonly _valueRepository: ValueRepository,
        @InjectRepository(VariableRepository)
        private readonly _variableRepository: VariableRepository
    ) {}

    async get(valueId: number): Promise<ReadValueDto> {
        if (!valueId) {
            throw new BadRequestException('Value ID must be sent.');
        }

        const value: Value = await this._valueRepository.findOne(valueId, {
            where: { status: Status.ACTIVE },
            relations: ['variable']
        });

        if (!value) {
            throw new NotFoundException('This value does not exists.');
        }

        return plainToClass(ReadValueDto, value);
    }

    async getAll(): Promise<ReadValueDto[]> {
        const values: Value[] = await this._valueRepository.find({
            where: { status: Status.ACTIVE },
            relations: ['variable']
        });

        if (values.length === 0) {
            throw new NotFoundException('Values is empty.');
        }

        return values.map(
            (value: Value) => plainToClass(ReadValueDto, value) 
        );
    }

    async getValueByVariable(variableId: number): Promise<ReadValueDto[]> {
        if (!variableId) {
            throw new BadRequestException('Variable ID must be sent.');
        }

        const values: Value[] = await this._valueRepository.find({
            where: { status: Status.ACTIVE, categories: In([variableId]) },
            relations: ['variable']
        });

        return values.map(value => plainToClass(ReadValueDto, value));
    }

    async create(value: Partial<CreateValueDto>): Promise<ReadValueDto> {
        //const { name, description, type_value, variable } = value;
        const fVariable: Variable = await this._variableRepository.findOne(value.variable, {
            where: { status: Status.ACTIVE }
        });

        if (!fVariable) {
            throw new NotFoundException(`There's not an variable with this id: ${value.variable}.`);
        }
        
        const sValue: Value = await this._valueRepository.save({
            value: value.value,
            variable: fVariable
        });

        return plainToClass(ReadValueDto, sValue);
    }

    async update(valueId: number, value: Partial<UpdateValueDto>): Promise<ReadValueDto> {
        const fValue: Value = await this._valueRepository.findOne(valueId, {
            where: { status: Status.ACTIVE }
        });

        if (!fValue) {
            throw new NotFoundException('This value does not exists.');
        }

        const fVariable: Variable = await this._variableRepository.findOne(value.variable, {
            where: { status: Status.ACTIVE }
        });

        if (!fVariable) {
            throw new NotFoundException(`There's not an variable with this id: ${value.variable}.`);
        }

        fValue.value = value.value;
        fValue.variable = fVariable;

        const uValue: Value = await this._valueRepository.save(fValue);

        return plainToClass(ReadValueDto, uValue);
    }

    async delete(valueId: number): Promise<DeleteValueDto> {
        const fValue: Value = await this._valueRepository.findOne(valueId, {
            where: { status: Status.ACTIVE }
        });

        if (!fValue) {
            throw new NotFoundException('This value does not exists.');
        }

        await this._valueRepository.update(valueId, {
            status: Status.INACTIVE
        });

        const message: string = 'This value has been removed.';

        return plainToClass(DeleteValueDto, { message, deleted_value: fValue });
    }
}

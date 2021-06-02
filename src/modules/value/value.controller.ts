import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateValueDto, DeleteValueDto, ReadValueDto, UpdateValueDto } from './dto';
import { ValueService } from './value.service';

@Controller('value')
export class ValueController {
    constructor(private readonly _valueService: ValueService) {}

    @Get(':valueId')
    getValue(@Param('valueId', ParseIntPipe) valueId: number): Promise<ReadValueDto> {
        return this._valueService.get(valueId);
    }

    @Get()
    getValues(): Promise<ReadValueDto[]> {
        return this._valueService.getAll();
    }

    @Get('variable/:variableId')
    getValueByVariable(@Param('variableId', ParseIntPipe) variableId: number): Promise<ReadValueDto[]> {
        return this._valueService.getValueByVariable(variableId);
    }

    @Post()
    createValue(@Body() value: Partial<CreateValueDto>): Promise<ReadValueDto> {
        return this._valueService.create(value);
    }

    @Patch(':valueId')
    updateValue(@Param('valueId', ParseIntPipe) valueId: number, @Body() value: Partial<UpdateValueDto>): Promise<ReadValueDto> {
        return this._valueService.update(valueId, value);
    }

    @Delete(':valueId')
    deleteValue(@Param('valueId', ParseIntPipe) valueId: number): Promise<DeleteValueDto> {
        return this._valueService.delete(valueId);
    }
}

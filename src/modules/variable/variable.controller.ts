import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateVariableDto, DeleteVariableDto, ReadVariableDto, UpdateVariableDto } from './dto';
import { VariableService } from './variable.service';

@Controller('variable')
export class VariableController {
    constructor(private readonly _variableService: VariableService) {}

    @Get(':variableId')
    getVariable(@Param('variableId', ParseIntPipe) variableId: number): Promise<ReadVariableDto> {
        return this._variableService.get(variableId);
    }

    @Get()
    getVariables(): Promise<ReadVariableDto[]> {
        return this._variableService.getAll();
    }

    @Get('category/:categoryId')
    getVariableByCategory(@Param('categoryId', ParseIntPipe) categoryId: number): Promise<ReadVariableDto[]> {
        return this._variableService.getVariableByCategory(categoryId);
    }

    @Post()
    createVariable(@Body() variable: Partial<CreateVariableDto>): Promise<ReadVariableDto> {
        return this._variableService.create(variable);
    }

    @Patch(':variableId')
    updateVariable(@Param('variableId', ParseIntPipe) variableId: number, @Body() variable: Partial<UpdateVariableDto>): Promise<ReadVariableDto> {
        return this._variableService.update(variableId, variable);
    }

    @Delete(':variableId')
    deleteVariable(@Param('variableId', ParseIntPipe) variableId: number): Promise<DeleteVariableDto> {
        return this._variableService.delete(variableId);
    }
}

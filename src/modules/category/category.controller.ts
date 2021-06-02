import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto, DeleteCategoryDto, ReadCategoryDto, UpdateCategoryDto } from './dto';

@Controller('category')
export class CategoryController {
    constructor(private readonly _categoryService: CategoryService) {}

    @Get(':categoryId')
    getCategory(@Param('categoryId', ParseIntPipe) categoryId: number): Promise<ReadCategoryDto> {
        return this._categoryService.get(categoryId);
    }

    @Get()
    getCategories(): Promise<ReadCategoryDto[]> {
        return this._categoryService.getAll();
    }

    @Post()
    createCategory(@Body() category: Partial<CreateCategoryDto>): Promise<ReadCategoryDto> {
        return this._categoryService.create(category);
    }

    @Patch(':categoryId')
    updateCategory(@Param('categoryId', ParseIntPipe) categoryId: number, @Body() category: Partial<UpdateCategoryDto>): Promise<ReadCategoryDto> {
        return this._categoryService.update(categoryId, category);
    }

    @Delete(':categoryId')
    deleteCategory(@Param('categoryId', ParseIntPipe) categoryId: number): Promise<DeleteCategoryDto> {
        return this._categoryService.delete(categoryId);
    }
}

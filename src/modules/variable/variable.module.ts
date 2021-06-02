import { Module } from '@nestjs/common';
import { VariableService } from './variable.service';
import { VariableController } from './variable.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VariableRepository } from './variable.repository';
import { CategoryRepository } from '../category/category.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([VariableRepository, CategoryRepository])
  ],
  providers: [VariableService],
  controllers: [VariableController]
})
export class VariableModule {}

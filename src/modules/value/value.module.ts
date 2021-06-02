import { Module } from '@nestjs/common';
import { ValueService } from './value.service';
import { ValueController } from './value.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ValueRepository } from './value.repository';
import { VariableRepository } from '../variable/variable.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ValueRepository, VariableRepository])
  ],
  providers: [ValueService],
  controllers: [ValueController]
})
export class ValueModule {}

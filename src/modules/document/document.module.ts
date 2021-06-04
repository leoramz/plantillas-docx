import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ValueRepository } from '../value/value.repository';
import { VariableRepository } from '../variable/variable.repository';
import { DocumentController } from './document.controller';
import { DocumentRepository } from './document.repository';
import { DocumentService } from './document.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([DocumentRepository, VariableRepository, ValueRepository]),
    MulterModule.register({
      dest: './upload',
    })
  ],
  controllers: [DocumentController],
  providers: [DocumentService]
})
export class DocumentModule {}

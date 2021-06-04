import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { In } from 'typeorm';
import { Status } from '../../utils/status.enum.utils';
import { Variable } from '../variable/variable.entity';
import { VariableRepository } from '../variable/variable.repository';
import { Document } from './document.entity';
import { DocumentRepository } from './document.repository';
import { CreateDocumentDto, DeleteDocumentDto, ReadDocumentDto, UpdateDocumentDto } from './dto';
import * as fs from 'fs';
import * as path from 'path';
//import PizZip from 'pizzip';
//import Docxtemplater from 'docxtemplater';
var PizZip = require('pizzip');
var Docxtemplater = require('docxtemplater');
import { Value } from '../value/value.entity';
import { ValueRepository } from '../value/value.repository';

@Injectable()
export class DocumentService {
    constructor(
        @InjectRepository(DocumentRepository)
        private readonly _docxRepository: DocumentRepository,
        @InjectRepository(VariableRepository)
        private readonly _variableRepository: VariableRepository,
        @InjectRepository(ValueRepository)
        private readonly _valueRepository: ValueRepository
    ) {}

    async get(documentId: number): Promise<ReadDocumentDto> {
        if (!documentId) {
            throw new BadRequestException('Document ID must be sent.');
        }

        const docx: Document = await this._docxRepository.findOne(documentId, {
            where: { status: Status.ACTIVE }
        });

        if (!docx) {
            throw new NotFoundException('This document does not exists.');
        }

        return plainToClass(ReadDocumentDto, docx);
    }

    async getAll(): Promise<ReadDocumentDto[]> {
        const docxs: Document[] = await this._docxRepository.find({
            where: { status: Status.ACTIVE }
        });

        if (docxs.length === 0) {
            throw new NotFoundException('Documents is empty.');
        }

        return docxs.map(
            (docx: Document) => plainToClass(ReadDocumentDto, docx) 
        );
    }

    async getDocumentByVariable(variableId: number): Promise<ReadDocumentDto[]> {
        if (!variableId) {
            throw new BadRequestException('Variable ID must be sent.');
        }

        const docxs: Document[] = await this._docxRepository.find({
            where: { status: Status.ACTIVE, variables: In([variableId]) }
        });

        return docxs.map(docx => plainToClass(ReadDocumentDto, docx));
    }

    /*async create(docx: Partial<CreateDocumentDto>): Promise<ReadDocumentDto> {
        
        const fVariable: Variable = await this._variableRepository.findOne(docx.variable, {
            where: { status: Status.ACTIVE }
        });

        if (!fVariable) {
            throw new NotFoundException(`There's not an variable with this id: ${docx.variable}.`);
        }
        
        const sDocument: Document = await this._docxRepository.save({
            name: docx.name,
            description: docx.description,
            type_docx: docx.type_docx,
            variable: fVariable
        });

        return plainToClass(ReadDocumentDto, sDocument);
    }*/
    
    async create(docx: Partial<CreateDocumentDto>): Promise<ReadDocumentDto> {
        const variables: Variable[] = [];

        for (const variableId of docx.variables) {
             const fVariable: Variable = await this._variableRepository.findOne(variableId, {
                 where: { status: Status.ACTIVE }
             });

             if (!fVariable) {
                 throw new NotFoundException(`There's not an variable with this id: ${docx.variables}.`);
             }
            
             variables.push(fVariable);
        }
        
        const sDocument: Document = await this._docxRepository.save({
            name: docx.name,
            description: docx.description,
            variables
        });

        return plainToClass(ReadDocumentDto, sDocument);
    }

    async createDocumentWithUpload(docx: Partial<CreateDocumentDto>, filename: string): Promise<ReadDocumentDto> {
        const variables: Variable[] = [];

        for (const variableId of docx.variables) {
             const fVariable: Variable = await this._variableRepository.findOne(variableId, {
                 where: { status: Status.ACTIVE }
             });

             if (!fVariable) {
                 throw new NotFoundException(`There's not an variable with this id: ${docx.variables}.`);
             }
            
             variables.push(fVariable);
        }
        
        const sDocument: Document = await this._docxRepository.save({
            name: docx.name,
            description: docx.description,
            filename: filename,
            variables
        });

        return plainToClass(ReadDocumentDto, sDocument);
    }

    async update(documentId: number, docx: Partial<UpdateDocumentDto>): Promise<ReadDocumentDto> {
        const fDocument: Document = await this._docxRepository.findOne(documentId, {
            where: { status: Status.ACTIVE }
        });

        if (!fDocument) {
            throw new NotFoundException('This document does not exists.');
        }

        const variables: Variable[] = [];

        for (const variableId of docx.variables) {
             const fVariable: Variable = await this._variableRepository.findOne(variableId, {
                 where: { status: Status.ACTIVE }
             });

             if (!fVariable) {
                 throw new NotFoundException(`There's not an variable with this id: ${docx.variables}.`);
             }
            
             variables.push(fVariable);
        }

        fDocument.name = docx.name;
        fDocument.description = docx.description;
        fDocument.filename = docx.filename;
        fDocument.variables = variables;

        const uDocument: Document = await this._docxRepository.save(fDocument);

        return plainToClass(ReadDocumentDto, uDocument);
    }

    async delete(documentId: number): Promise<DeleteDocumentDto> {
        const fDocument: Document = await this._docxRepository.findOne(documentId, {
            where: { status: Status.ACTIVE }
        });

        if (!fDocument) {
            throw new NotFoundException('This document does not exists.');
        }

        await this._docxRepository.update(documentId, {
            status: Status.INACTIVE
        });

        const message: string = 'This document has been removed.';

        return plainToClass(DeleteDocumentDto, { message, deleted_docx: fDocument });
    }

    async convertDocument(documentId: number) {
        if (!documentId) {
            throw new BadRequestException('Document ID must be sent.');
        }

        const fDocument: Document = await this._docxRepository.findOne(documentId, {
            where: { status: Status.ACTIVE }
        });

        if (!fDocument) {
            throw new NotFoundException('This document does not exists.');
        }

        let content = fs.readFileSync(path.resolve('./upload/', fDocument.filename), 'binary');
    
        let zip = new PizZip(content);
        let doc;
    
        try {        
            doc = new Docxtemplater(zip);
            
            //doc.loadZip(zip);
        } catch(error) {
            throw "Error Docxtemplater: " + error;
        }

        let dataVar = {};
        let fVariable: Variable = new Variable();
        let fValue: Value = new Value();

        for (const variable of fDocument.variables) {
            fVariable = await this._variableRepository.findOne(variable.id, {
                where: { status: Status.ACTIVE },
                relations: ['values']
            });

            if (!fVariable) {
                throw new NotFoundException('This variable does not exist.');
            }

            for (const value of fVariable.values) {
                fValue = await this._valueRepository.findOne(value.id, {
                    where: { status: Status.ACTIVE }
                });

                dataVar[fVariable.name] = fValue.value;
            }
        }
        
        doc.setData(dataVar);

        try {
            doc.render();
        } catch (error) {
            throw "Error render: " + error;
        }
        
        const buf = doc.getZip().generate({type: 'nodebuffer'});
        
        fs.writeFileSync(path.resolve('./upload/', 'converted_' + fDocument.filename), buf);
    }
}

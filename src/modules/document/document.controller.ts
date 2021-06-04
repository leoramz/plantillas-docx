import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { docxFileFilter, editFileName } from '../../utils/file-upload.utils';
import { DocumentService } from './document.service';
import { CreateDocumentDto, DeleteDocumentDto, ReadDocumentDto, UpdateDocumentDto } from './dto';

@Controller('document')
export class DocumentController {
    constructor(private readonly _documentService: DocumentService) {}

    @Get(':documentId')
    getDocument(@Param('documentId', ParseIntPipe) documentId: number): Promise<ReadDocumentDto> {
        return this._documentService.get(documentId);
    }

    @Get()
    getDocuments(): Promise<ReadDocumentDto[]> {
        return this._documentService.getAll();
    }

    @Get('variable/:variableId')
    getDocumentByVariable(@Param('variableId', ParseIntPipe) variableId: number): Promise<ReadDocumentDto[]> {
        return this._documentService.getDocumentByVariable(variableId);
    }

    @Post('upload')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './upload',
                filename: editFileName
            }),
            fileFilter: docxFileFilter
        })
    )
    createDocumentWithUpload(@Body() document: Partial<CreateDocumentDto>, @UploadedFile() file: Express.Multer.File): Promise<ReadDocumentDto> {
        return this._documentService.createDocumentWithUpload(document, file.filename);
    }
    
    @Post()
    createDocument(@Body() document: Partial<CreateDocumentDto>): Promise<ReadDocumentDto> {
        return this._documentService.create(document);
    }

    @Patch(':documentId')
    updateDocument(@Param('documentId', ParseIntPipe) documentId: number, @Body() variable: Partial<UpdateDocumentDto>): Promise<ReadDocumentDto> {
        return this._documentService.update(documentId, variable);
    }

    @Delete(':documentId')
    deleteDocument(@Param('documentId', ParseIntPipe) documentId: number): Promise<DeleteDocumentDto> {
        return this._documentService.delete(documentId);
    }

    @Get('convert/:documentId')
    convertDocument(@Param('documentId', ParseIntPipe) documentId: number) {
        return this._documentService.convertDocument(documentId)
    }
}

import { IsString } from "class-validator";
import { Exclude, Expose, Type } from 'class-transformer';
import { ReadDocumentDto } from "./read-document.dto";

@Exclude()
export class DeleteDocumentDto {
    @Expose()
    @IsString()
    message: string;

    @Expose()
    @Type(() => ReadDocumentDto)
    deleted_document: ReadDocumentDto;
}
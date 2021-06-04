import { IsNumber, IsString } from "class-validator";
import { Exclude, Expose, Type } from 'class-transformer';
import { ReadVariableDto } from "../../variable/dto";

@Exclude()
export class ReadDocumentDto {
    @Expose()
    @IsNumber()
    readonly id: number;

    @Expose()
    @IsString()
    readonly name: string;

    @Expose()
    @IsString()
    readonly description: string;

    @Expose()
    @IsString()
    readonly filename: string;

    @Expose()
    @Type(() => ReadVariableDto)
    readonly variables: ReadVariableDto[]
}
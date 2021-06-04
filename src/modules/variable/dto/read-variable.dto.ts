import { Exclude, Expose, Type } from "class-transformer";
import { IsNumber, IsString } from "class-validator";
import { ReadDocumentDto } from "../../document/dto";
import { ReadValueDto } from "../../value/dto";
import { ReadCategoryDto } from "../../category/dto";

@Exclude()
export class ReadVariableDto {
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
    readonly type_variable: string;
    
    @Expose()
    @Type(() => ReadCategoryDto)
    readonly category: ReadCategoryDto;

    @Expose()
    @Type(() => ReadValueDto)
    readonly values: ReadValueDto[];

    @Expose()
    @Type(() => ReadDocumentDto)
    readonly documents: ReadValueDto[];
}
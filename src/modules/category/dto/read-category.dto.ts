import { IsNumber, IsString, MaxLength } from "class-validator";
import { Exclude, Expose, Type } from 'class-transformer';
import { ReadVariableDto } from "src/modules/variable/dto";

@Exclude()
export class ReadCategoryDto {
    @Expose()
    @IsNumber()
    readonly id: number;

    @Expose()
    @IsString()
    @MaxLength(35, {message: 'This name is not valid.'})
    readonly name: string;

    @Expose()
    @IsString()
    @MaxLength(255, {message: 'This description is not valid.'})
    readonly description: string;

    @Expose()
    @Type(() => ReadVariableDto)
    readonly variables: ReadVariableDto[];
}
import { Exclude, Expose, Type } from "class-transformer";
import { IsNumber, IsString } from "class-validator";
import { ReadVariableDto } from "../../variable/dto";

@Exclude()
export class ReadValueDto {
    @Expose()
    @IsNumber()
    readonly id: number;

    @Expose()
    @IsString()
    readonly value: string;
    
    @Expose()
    @Type(() => ReadVariableDto)
    readonly variable: ReadVariableDto;
}
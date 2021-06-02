import { IsString } from "class-validator";
import { Exclude, Expose, Type } from 'class-transformer';
import { ReadVariableDto } from "./read-variable.dto";

@Exclude()
export class DeleteVariableDto {
    @Expose()
    @IsString()
    message: string;

    @Expose()
    @Type(type => ReadVariableDto)
    deleted_variable: ReadVariableDto;
}
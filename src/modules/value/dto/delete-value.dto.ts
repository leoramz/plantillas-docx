import { IsString } from "class-validator";
import { Exclude, Expose, Type } from 'class-transformer';
import { ReadValueDto } from "./read-value.dto";

@Exclude()
export class DeleteValueDto {
    @Expose()
    @IsString()
    message: string;

    @Expose()
    @Type(() => ReadValueDto)
    deleted_value: ReadValueDto;
}
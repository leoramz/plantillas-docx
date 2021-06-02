import { IsString } from "class-validator";
import { Exclude, Expose, Type } from 'class-transformer';
import { ReadCategoryDto } from "./read-category.dto";

@Exclude()
export class DeleteCategoryDto {
    @Expose()
    @IsString()
    message: string;

    @Expose()
    @Type(type => ReadCategoryDto)
    deleted_category: ReadCategoryDto;
}
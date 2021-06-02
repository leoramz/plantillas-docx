import { IsString, MaxLength } from "class-validator";

export class CreateCategoryDto {
    @IsString()
    @MaxLength(35, {message: 'This name is not valid.'})
    readonly name: string;

    @IsString()
    @MaxLength(255, {message: 'This description is not valid.'})
    readonly description: string;
}
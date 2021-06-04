import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UpdateDocumentDto {
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
    @IsNotEmpty()
    @IsNumber()
    readonly variables: number[]
}
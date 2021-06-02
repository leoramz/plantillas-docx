import { Exclude, Expose } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

@Exclude()
export class CreateValueDto {
    @Expose()
    @IsString()
    readonly value: string;
    
    @Expose()
    @IsNotEmpty()
    readonly variable: number;
}
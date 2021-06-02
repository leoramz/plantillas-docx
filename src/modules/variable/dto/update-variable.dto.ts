import { Exclude, Expose } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

@Exclude()
export class UpdateVariableDto {
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
    @IsNotEmpty()
    readonly categoryId: number;
}
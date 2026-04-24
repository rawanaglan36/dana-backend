import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class addPasswordDto {

  @IsString({ message: 'must be string' })
  @MinLength(3, { message: 'Password must be at least 3 characters' })
  @MaxLength(20, { message: 'Password must be at most 20 characters' })
  @IsNotEmpty({ message: 'password is required' })
  password!: string;
}
import { IsIn, IsMongoId, IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";

export class AnswerDto {
    @IsMongoId({
        message: 'questionId must be ObjectId ',
    })
    questionId!: string;

    @IsIn([1, 2, 3], {
        message: 'selectedValue should be 1,2,3',
    })
    selectedValue!: number;
}
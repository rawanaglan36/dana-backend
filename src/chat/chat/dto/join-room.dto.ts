import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class JoinRoomDto {
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  parentId: string;

  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  doctorId: string;
}


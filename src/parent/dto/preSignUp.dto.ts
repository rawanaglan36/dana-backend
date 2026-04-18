import { ValidateNested } from 'class-validator';
import { CreateParentDto } from './create-parent.dto';
import { Type } from 'class-transformer';
import { CreateChildDto } from './child.dto';

export class PreSignUpDto {
  @ValidateNested() //make validtion that in nasted dto
  @Type(() => CreateParentDto)
  parent: CreateParentDto;

  @ValidateNested({ each: true }) //make validtion that in nasted dto by array
  @Type(() => CreateChildDto)
  children: CreateChildDto[];
}

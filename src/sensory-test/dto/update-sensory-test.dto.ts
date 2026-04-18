import { PartialType } from '@nestjs/mapped-types';
import { CreateSensoryTestDto } from './create-sensory-test.dto';

export class UpdateSensoryTestDto extends PartialType(CreateSensoryTestDto) {}

import { CreateCategoryDto } from './create-categories.dto';
import { PartialType } from '@nestjs/mapped-types';
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
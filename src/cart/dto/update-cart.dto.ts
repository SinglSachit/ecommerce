import { IsInt, Min, IsOptional, IsUUID, IsNotEmpty } from 'class-validator';

export class UpdateCartItemDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;
}

import { IsInt, Min, IsUUID, IsNotEmpty } from 'class-validator';

export class CreateCartItemDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

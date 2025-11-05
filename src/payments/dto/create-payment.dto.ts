import { IsUUID, IsNumber, Min } from 'class-validator';

export class CreatePaymentDto {
  @IsUUID()
  orderId: string;

  @IsUUID()
  userId: string;

  @IsNumber()
  @Min(0)
  amount: number;
}

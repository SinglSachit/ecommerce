import { IsEnum, IsOptional } from 'class-validator';
import { PaymentStatus } from '../entities/payment.entity';

export class UpdatePaymentDto {
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;
}


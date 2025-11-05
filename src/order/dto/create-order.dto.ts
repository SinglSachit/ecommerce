import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsArray,
  ValidateNested,
  MinLength,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @IsNotEmpty()
  @IsString()
  productId: string; // product UUID

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @IsPositive()
  price: number;
}

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  shippingAddress: string;

  @IsString()
  @IsIn(['credit_card', 'debit_card', 'paypal', 'cash_on_delivery'])
  paymentMethod: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  orderItems: OrderItemDto[];
}


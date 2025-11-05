import { Controller, Post, Patch, Get, Param, Body } from '@nestjs/common';
import { PaymentService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  createPayment(@Body() dto: CreatePaymentDto) {
    return this.paymentService.createPayment(dto);
  }

  @Patch(':id')
  updatePayment(@Param('id') id: string, @Body() dto: UpdatePaymentDto) {
    return this.paymentService.updatePayment(id, dto);
  }

  @Get('user/:userId')
  getUserPayments(@Param('userId') userId: string) {
    return this.paymentService.getUserPayments(userId);
  }

  @Get(':id')
  getPayment(@Param('id') id: string) {
    return this.paymentService.getPaymentById(id);
  }
}


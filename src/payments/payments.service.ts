import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,
  ) {}

  async createPayment(dto: CreatePaymentDto): Promise<Payment> {
    const payment = this.paymentRepo.create(dto);
    return this.paymentRepo.save(payment);
  }

  async updatePayment(id: string, dto: UpdatePaymentDto): Promise<Payment> {
    const payment = await this.paymentRepo.findOne({ where: { id } });
    if (!payment) throw new NotFoundException('Payment not found');
    Object.assign(payment, dto);
    return this.paymentRepo.save(payment);
  }

  async getUserPayments(userId: string): Promise<Payment[]> {
    return this.paymentRepo.find({ where: { userId } });
  }

  async getPaymentById(id: string): Promise<Payment> {
    const payment = await this.paymentRepo.findOne({ where: { id } });
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }
}



import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentService } from './payments.service';
import { PaymentController } from './payments.controller';
import { Payment } from './entities/payment.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Payment])],
  providers: [PaymentService],
  controllers: [PaymentController],
  exports: [PaymentService], // export if used in Orders module
})
export class PaymentsModule {}


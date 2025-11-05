import { Order } from 'src/order/entities/order.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  orderId: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column('float')
  amount: number;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Column({ nullable: true })
  transactionId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;


  @ManyToOne(() => Order, (order) => order.payments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @ManyToOne(() => User, (user) => user.payments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

}



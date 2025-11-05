
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';
import { Payment } from 'src/payments/entities/payment.entity';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // store user UUID
  // allow nullable for existing rows; migrate to non-null after cleaning data
  @Column({ type: 'uuid', nullable: true })
  userId: string | null;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column('decimal', { default: 0 })
  totalAmount: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column('text')
  shippingAddress: string;

  @Column()
  paymentMethod: 'credit_card' | 'debit_card' | 'paypal' | 'cash_on_delivery';

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  orderDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deliveryDate?: Date;

  //relation with payments
  @OneToMany(() => Payment, (payment) => payment.order)
  payments: Payment[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    cascade: true,
    eager: true,
  })
  orderItems: OrderItem[];
}
// import { Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
// import { OrderItem } from './order-item.entity';

// // @Entity()
// // export class Order {
// //   @PrimaryGeneratedColumn('uuid')
// //   id: string;

// //   @Column()
// //   customerId: string;   

// //   @Column()
// //   status: string;    

// //   @Column()
// //   totalAmount: number;

// //   @Column({ type: 'jsonb' }) 
// //   items: OrderItem[];   

// //   @OneToMany(() =>OrderItem,(orderItem)=> orderItem.order)
// //   orderItems:OrderItem[];
// // }

// // // type OrderItem = {
// // //   productId: string;  
// // //   quantity: number;
// // //   price: number;      
// // };
// // import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

// @Entity()
// export class Order {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column()
//   userId: string;

//   @Column({ type: 'jsonb' }) 
//   orderItems: OrderItem[];

//   @Column('decimal')
//   totalAmount: number;

//   @Column()
//   status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

//   @Column('text')
//   shippingAddress: string;

//   @Column()
//   paymentMethod: 'credit_card' | 'debit_card' | 'paypal' | 'cash_on_delivery';

//   @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
//   orderDate: Date;

//   @Column({ type: 'timestamp', nullable: true })
//   deliveryDate?: Date;

//   @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
//   orderItemsRelation: OrderItem[];
// }

// // export type OrderItem = {
// //   productId: number;
// //   quantity: number;
// //   price: number;
// // };

import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Order } from '../../order/entities/order.entity';
import { CartItem } from 'src/cart/entities/cart.entity';
import { Payment } from 'src/payments/entities/payment.entity';


export enum UserRole{
	USER="user",
	ADMIN='admin'
}
@Entity()
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	name: string;

	@Column({ unique: true })
	email: string;

	@Column({select:false})
	password: string;

	@Column({ nullable: true, type: 'bigint' })
	phoneNumber?: number;

	@Column()
	address: string;

	@Column({type:'enum', enum :UserRole, default:UserRole.USER})
	role:UserRole;


	// store upload id (Upload.id) if user set a profile picture
	@Column({ nullable: true })
	profilePictureId?: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@OneToMany(() => Order, (order) => order.user)
	orders: Order[];

	@OneToMany(() => CartItem, (cartItem) => cartItem.user, { cascade: true })
  cartItems: CartItem[];

//relation to payments
	@OneToMany(() => Payment, (payment) => payment.user)
	payments: Payment[];
}

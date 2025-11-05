import { CartItem } from 'src/cart/entities/cart.entity';
import { OrderItem } from 'src/order/entities/order-item.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm'

@Entity()
export class Product{
@PrimaryGeneratedColumn('uuid')
id:string;

@Column()
name:string;

@Column()
price:number;

@Column()
description:string;

@Column()
brand:string;

@Column({ type: 'text', array: true, default: [] })
imageIds: string[];

@Column({ default: 0 })
stock: number;

@Column({ nullable: true })
category?: string;

@CreateDateColumn()
createdAt: Date;

@Column({type:'jsonb'})//json le problem huna sakxa yesle caii binary ma save garne vako vayera use garya 
variant:variant[];

//relation with cart items
@OneToMany(() => CartItem, (cartItem) => cartItem.product)
cartItems: CartItem[];


@OneToMany(() => OrderItem,(OrderItem) =>OrderItem.product)
OrderItems:OrderItem[];
}
type variant={
    color:string;
    size:string;
    stock:number;
}


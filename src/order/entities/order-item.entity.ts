import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../../products/entities/product.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  quantity: number;

  @Column('decimal')
  price: number;

  @ManyToOne(() => Order, (order) => order.orderItems, { onDelete: 'CASCADE' })
  order: Order;

  @ManyToOne(() => Product, { eager: true })
  product: Product;
}
// import { Product } from 'src/products/entities/product.entity';
// import { Column,Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
// import { Order } from './order.entity';

//  @Entity()
//  export class OrderItem{
//   @PrimaryGeneratedColumn('uuid')
//   id :string;

//   // @Column()
//   // productId:number;

//   @Column()
//   quantity:number;
  
//   @Column('decimal')
//   price:number;

//   @ManyToOne(()=>Product,(Product)=> Product.id)
//   @ManyToOne(()=>Order,(Order)=>Order.id)
//   //yedi mathi foreign key rakhyenau vane
//   //@joinColume({name:'prodcutId'})
//   product:Product;
//    order:Order;
//  }
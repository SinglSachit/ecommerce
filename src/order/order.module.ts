import { Module } from "@nestjs/common";  
import { OrderController } from "./order.controller";
import { OrdersService } from "./order.service";
import {TypeOrmModule} from '@nestjs/typeorm';
import { Order } from "./entities/order.entity";
import { OrderItem } from "./entities/order-item.entity";
import { Product } from "src/products/entities/product.entity";
import { User } from "../users/entities/user.entity";
@Module({
  imports:[
    TypeOrmModule.forFeature([Order, OrderItem, Product, User])
  ],
  controllers:[OrderController],
  providers:[OrdersService],
exports:[OrdersService],
})
export class OrderModule{}
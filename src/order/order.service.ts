import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Product } from '../products/entities/product.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class OrdersService {
   deleteOrder(id: string): Promise<void> {
      throw new Error('Method not implemented.');
   }
   updateOrder(id: string, updateOrderDto: UpdateOrderDto) {
      throw new Error('Method not implemented.');
   }
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    private datasource :DataSource,
  ) {}

  async getAllOrders(): Promise<Order[]> {
    try {
      return await this.orderRepository.find({
        relations: ['orderItems', 'orderItems.product'],
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getOneOrder(id: string): Promise<Order | null> {
    try {
      const order = await this.orderRepository.findOne({
        where: { id: id },
        relations: ['orderItems', 'orderItems.product'],
      });
      if (!order) throw new NotFoundException('Order not found');
      return order;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
 


async addOrder(createOrderDto: CreateOrderDto): Promise<Order> {
  try {
    const createdOrder = await this.datasource.manager.transaction(
      async (transactionalEntityManager) => {
        // Create order base
        const order = this.orderRepository.create({
          // userId is a UUID (string) in the Order entity
          userId: createOrderDto.userId,
          shippingAddress: createOrderDto.shippingAddress,
          paymentMethod: createOrderDto.paymentMethod as any,
          status: OrderStatus.PENDING,
          totalAmount: 0,
        });

        const savedOrder = (await transactionalEntityManager.save(order)) as unknown as Order;

        // Create and save order items
        const orderItems = await Promise.all(
          createOrderDto.orderItems.map(async (item) => {
            const product = await this.productRepository.findOneBy({
              id: item.productId,
            });
            if (!product) {
              throw new NotFoundException(
                `Product with ID ${item.productId} not found`,
              );
            }

            return this.orderItemRepository.create({
              quantity: item.quantity,
              price: item.price,
              order: savedOrder,
              product: product,
            });
          }),
        );

        await transactionalEntityManager.save(orderItems);

        // Update total amount
        savedOrder.totalAmount = orderItems.reduce(
          (sum, item) => sum + Number(item.price) * item.quantity,
          0,
        );
        await transactionalEntityManager.save(savedOrder);

        // ✅ Use the SAME transactional manager here
        const fullOrder = await transactionalEntityManager.findOne(Order, {
          where: { id: savedOrder.id },
          relations: ['orderItems', 'orderItems.product'],
        });

        if (!fullOrder) {
          throw new NotFoundException('Order not found after creation');
        }

        return fullOrder;
      },
    );

    return createdOrder;
  } catch (error) {
    console.error('Order creation failed:', error);
    throw new InternalServerErrorException(error.message);
  }
}
}


    //   // Create base order
    //   const order = this.orderRepository.create({
    //     userId: Number(createOrderDto.userId),
    //     shippingAddress: createOrderDto.shippingAddress,
    //     paymentMethod: createOrderDto.paymentMethod as any, // Cast to correct enum type if necessary
    //     status: 'pending',
    //     totalAmount: 0,
    //   });

    //   const savedOrder = await this.orderRepository.save(order);



    //   // Create items
    //   const orderItems: OrderItem[] = [];
    //   for (const item of createOrderDto.orderItems) {
    //     const product = await this.productRepository.findOneBy({
    //       id: item.productId,
    //     });
    //     if (!product) {
    //       throw new NotFoundException(
    //         `Product with ID ${item.productId} not found`,
    //       );
    //     }

    //     const orderItem = this.orderItemRepository.create({
    //       quantity: item.quantity,
    //       price: item.price,
    //       order: savedOrder,
    //       product: product,
    //     });

    //     orderItems.push(orderItem);
    //   }

    //   await this.orderItemRepository.save(orderItems);

    //  // Update total amount
    //   savedOrder.totalAmount = orderItems.reduce(
    //     (sum, item) => sum + item.price * item.quantity,
    //     0,
    //   );
    //   return this.orderRepository.save(savedOrder);
  

//   async updateOrder(
//     id: string,
//     updateOrderDto: UpdateOrderDto,
//   ): Promise<Order> {
//     try {
//       const existingOrder = await this.orderRepository.findOne({
//       where: { id: id },
//         relations: ['orderItems'],
//       });

//       if (!existingOrder) {
//         throw new NotFoundException('Order not found');
//       }

//       // Ensure userId is a number if present
//       const dtoToMerge = {
//         ...updateOrderDto,
//         ...(updateOrderDto.userId !== undefined && { userId: Number(updateOrderDto.userId) }),
//       };

//       // Remove userId if it's not a valid number
//       if (
//         dtoToMerge.userId !== undefined &&
//         (isNaN(Number(dtoToMerge.userId)) || dtoToMerge.userId === null)
//       ) {
//         delete dtoToMerge.userId;
//       }

//       const updatedOrder = this.orderRepository.merge(
//         existingOrder,
//         dtoToMerge as Partial<Order>,
//       );
//       return this.orderRepository.save(updatedOrder);
//     } catch (error) {
//       throw new InternalServerErrorException(error);
//     }
//   }

//   async deleteOrder(id: string): Promise<void> {
//     try {
//       const result = await this.orderRepository.delete(Number(id));
//       if (result.affected === 0) {
//         throw new NotFoundException(`Order with ID ${id} not found`);
//       }
//       return;
//     } catch (error) {
//       throw new InternalServerErrorException(error);
//     }
//   }
// }


import {Controller,Get,Post,Body,ParseIntPipe,Delete,Req,Res,Put,HttpStatus,Param,Query,ForbiddenException} from '@nestjs/common';
import { OrdersService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
export class OrderController{
constructor(
   private readonly orderService: OrdersService ){}
@Post('/')
addOrder( 
    @Body() orderBody: CreateOrderDto){
    return this.orderService.addOrder(orderBody);
    }
 @Put('/:id')
   updateOrder(@Body() updateOrderDto :UpdateOrderDto,
   @Param('id') id:string,){
    return this.orderService.updateOrder(id,updateOrderDto);

   }
  
       @Get('/')
    getAllOrder():Promise<Order[]>{
        return this.orderService.getAllOrders();
    }
   @Get('/:id')
   getOneOrders(
   @Param('id') id :string,){
    return this.orderService.getOneOrder(id);
   }
   @Delete('/id')
   deleteOrder(@Param('id') id:string):Promise<void>{
    return this.orderService.deleteOrder(id);

   }
}
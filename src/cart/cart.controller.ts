import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartItemDto } from './dto/create-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get(':userId')
  async getCart(@Param('userId') userId: string) {
    return this.cartService.getCart(userId);
  }

  @Post('add')
  async addToCart(@Body() body: CreateCartItemDto) {
    const { userId, productId, quantity } = body;

    if (!userId || !productId || quantity === undefined) {
      throw new BadRequestException('Missing required fields');
    }

    return this.cartService.addToCart(userId, { productId, quantity, userId });
  }

  @Put(':id')
  async updateCartItem(
    @Param('id') id: string,
    @Body() body: UpdateCartItemDto,
  ) {
    const { userId, quantity } = body;
    if (!userId) throw new BadRequestException('Missing userId');
    return this.cartService.updateCartItem(userId, id, { userId, quantity });
  }

  @Delete(':id')
  async removeCartItem(@Param('id') id: string, @Body() body: { userId: string }) {
    const { userId } = body;
    if (!userId) throw new BadRequestException('Missing userId');
    return this.cartService.removeCartItem(userId, id);
  }

  @Delete('clear/:userId')
  async clearCart(@Param('userId') userId: string) {
    return this.cartService.clearCart(userId);
  }
}

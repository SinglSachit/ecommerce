import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart.entity';
import { Product } from '../products/entities/product.entity';
import { CreateCartItemDto } from './dto/create-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart.dto';
import { isUUID } from 'class-validator';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartRepo: Repository<CartItem>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}


async getCart(userId: string): Promise<CartItem[]> {
  if (!isUUID(userId)) throw new BadRequestException('Invalid user ID');

  const items = await this.cartRepo
    .createQueryBuilder('cart')
    .leftJoinAndSelect('cart.product', 'product') 
    .where('cart.userId = :userId', { userId })  
    .orderBy('cart.createdAt', 'DESC')
    .getMany();

  if (!items.length) throw new NotFoundException('Your cart is empty');

  return items;
}


  async addToCart(userId: string, dto: CreateCartItemDto): Promise<CartItem> {
    if (!isUUID(userId) || !isUUID(dto.productId)) {
      throw new BadRequestException('Invalid UUID format');
    }

    if (dto.quantity <= 0) throw new BadRequestException('Quantity must be > 0');

    const product = await this.productRepo.findOne({ where: { id: dto.productId } });
    if (!product) throw new NotFoundException('Product not found');

    let existing = await this.cartRepo.findOne({ where: { userId, productId: dto.productId } });
    if (existing) {
      existing.quantity += dto.quantity;
      return this.cartRepo.save(existing);
    }

    const newItem = this.cartRepo.create({ userId, productId: dto.productId, quantity: dto.quantity });
    return this.cartRepo.save(newItem);
  }


  async updateCartItem(userId: string, id: string, dto: UpdateCartItemDto): Promise<CartItem> {
    if (!isUUID(userId) || !isUUID(id)) throw new BadRequestException('Invalid UUID');

    const item = await this.cartRepo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Cart item not found');
    if (item.userId !== userId) throw new ForbiddenException('Not allowed');

    if (dto.quantity !== undefined && dto.quantity > 0) item.quantity = dto.quantity;
    return this.cartRepo.save(item);
  }


  async removeCartItem(userId: string, id: string): Promise<void> {
    if (!isUUID(userId) || !isUUID(id)) throw new BadRequestException('Invalid UUID');

    const item = await this.cartRepo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Cart item not found');
    if (item.userId !== userId) throw new ForbiddenException('Not allowed');

    await this.cartRepo.delete(id);
  }


  async clearCart(userId: string): Promise<{ message: string }> {
    if (!isUUID(userId)) throw new BadRequestException('Invalid userId');

    const items = await this.cartRepo.find({ where: { userId } });
    if (!items.length) throw new NotFoundException('Cart is already empty');

    await this.cartRepo.delete({ userId });
    return { message: 'All items removed from cart successfully' };
  }
}

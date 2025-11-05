import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import {CategoriesModule } from './categories/categories.module';
import { OrderModule } from './order/order.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadModule } from './upload/upload.module';
import { CartModule } from './cart/cart.module';
import { PaymentsModule } from './payments/payments.module';
import {ConfigModule} from '@nestjs/config';
import config from './config/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load:[config],
    }),
    TypeOrmModule.forRoot({
      //use variables from config file
      //@ts-expect-error dbType from env is string but TypeORM expects specific union
    type: config().database.dbType,
    host: config().database.host,
    port: config().database.port,
    username: config().database.username,
    password: config().database.password,
    autoLoadEntities: true,
    database: config().database.database,
    // Disable automatic schema synchronization in environments with existing data
    // to avoid failures when the DB contains rows that violate new constraints.
    synchronize: false,
    logging:false,
  }), UsersModule, ProductsModule,CategoriesModule, OrderModule, UploadModule, CartModule, PaymentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
function forRoot(arg0: { isGlobal: boolean; load: any[]; }): import("@nestjs/common").Type<any> | import("@nestjs/common").DynamicModule | Promise<import("@nestjs/common").DynamicModule> | import("@nestjs/common").ForwardReference<any> {
  throw new Error('Function not implemented.');
}


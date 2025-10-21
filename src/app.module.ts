import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './presentation/controllers/user.controller';
import { AuthController } from './presentation/controllers/auth.controller';
import { ProductController } from './presentation/controllers/product.controller';
import { CustomerController } from './presentation/controllers/customer.controller';
import { UserService } from './application/services/user.service';
import { AuthService } from './application/services/auth.service';
import { ProductService } from './application/services/product.service';
import { OrderService } from './application/services/order.service';
import { CustomerService } from './application/services/customer.service';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { ProductRepository } from './infrastructure/repositories/product.repository';
import { OrderRepository } from './infrastructure/repositories/order.repository';
import { JwtStrategy } from './presentation/strategies/jwt.strategy';
import { PrismaClient } from '../generated/prisma';

// Use Cases
import { CreateUserUseCase } from './domain/use-cases/users/create-user.use-case';
import { AuthenticateUserUseCase } from './domain/use-cases/users/authenticate-user.use-case';
import { GetUserByIdUseCase } from './domain/use-cases/users/get-user-by-id.use-case';
import { GetAllUsersUseCase } from './domain/use-cases/users/get-all-users.use-case';
import { UpdateUserUseCase } from './domain/use-cases/users/update-user.use-case';
import { DeleteUserUseCase } from './domain/use-cases/users/delete-user.use-case';

import { CreateProductUseCase } from './domain/use-cases/products/create-product.use-case';
import { GetProductByIdUseCase } from './domain/use-cases/products/get-product-by-id.use-case';
import { GetProductsBySellerUseCase } from './domain/use-cases/products/get-products-by-seller.use-case';
import { GetAllProductsUseCase } from './domain/use-cases/products/get-all-products.use-case';
import { GetProductsByCategoryUseCase } from './domain/use-cases/products/get-products-by-category.use-case';
import { UpdateProductUseCase } from './domain/use-cases/products/update-product.use-case';
import { DeleteProductUseCase } from './domain/use-cases/products/delete-product.use-case';
import { UpdateStockUseCase } from './domain/use-cases/products/update-stock.use-case';
import { CheckStockAvailabilityUseCase } from './domain/use-cases/products/check-stock-availability.use-case';
import { ReduceStockUseCase } from './domain/use-cases/products/reduce-stock.use-case';

import { RegisterUseCase } from './domain/use-cases/auth/register.use-case';
import { LoginUseCase } from './domain/use-cases/auth/login.use-case';
import { VerifyTwoFactorUseCase } from './domain/use-cases/auth/verify-two-factor.use-case';
import { SetupTwoFactorUseCase } from './domain/use-cases/auth/setup-two-factor.use-case';
import { EnableTwoFactorUseCase } from './domain/use-cases/auth/enable-two-factor.use-case';
import { DisableTwoFactorUseCase } from './domain/use-cases/auth/disable-two-factor.use-case';
import { RefreshTokenUseCase } from './domain/use-cases/auth/refresh-token.use-case';

import { CreateOrderUseCase } from './domain/use-cases/orders/create-order.use-case';
import { GetOrderByIdUseCase } from './domain/use-cases/orders/get-order-by-id.use-case';
import { GetOrdersByCustomerUseCase } from './domain/use-cases/orders/get-orders-by-customer.use-case';
import { GetOrdersBySellerUseCase } from './domain/use-cases/orders/get-orders-by-seller.use-case';
import { GetAllOrdersUseCase } from './domain/use-cases/orders/get-all-orders.use-case';
import { UpdateOrderUseCase } from './domain/use-cases/orders/update-order.use-case';
import { UpdateOrderStatusUseCase } from './domain/use-cases/orders/update-order-status.use-case';
import { DeleteOrderUseCase } from './domain/use-cases/orders/delete-order.use-case';
import { GetCustomersUseCase } from './domain/use-cases/users/get-customers.use-case';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [
    AppController,
    UserController,
    AuthController,
    ProductController,
    CustomerController,
  ],
  providers: [
    AppService,
    UserService,
    AuthService,
    ProductService,
    OrderService,
    CustomerService,
    JwtStrategy,
    // Repositories
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    {
      provide: 'IProductRepository',
      useClass: ProductRepository,
    },
    {
      provide: 'IOrderRepository',
      useClass: OrderRepository,
    },
    {
      provide: PrismaClient,
      useValue: new PrismaClient(),
    },
    // Use Cases
    CreateUserUseCase,
    AuthenticateUserUseCase,
    GetUserByIdUseCase,
    GetAllUsersUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    CreateProductUseCase,
    GetProductByIdUseCase,
    GetProductsBySellerUseCase,
    GetAllProductsUseCase,
    GetProductsByCategoryUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase,
    UpdateStockUseCase,
    CheckStockAvailabilityUseCase,
    ReduceStockUseCase,
    RegisterUseCase,
    LoginUseCase,
    VerifyTwoFactorUseCase,
    SetupTwoFactorUseCase,
    EnableTwoFactorUseCase,
    DisableTwoFactorUseCase,
    RefreshTokenUseCase,
    CreateOrderUseCase,
    GetOrderByIdUseCase,
    GetOrdersByCustomerUseCase,
    GetOrdersBySellerUseCase,
    GetAllOrdersUseCase,
    UpdateOrderUseCase,
    UpdateOrderStatusUseCase,
    DeleteOrderUseCase,
    GetCustomersUseCase,
  ],
})
export class AppModule {}

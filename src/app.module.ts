import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './presentation/controllers/user.controller';
import { AuthController } from './presentation/controllers/auth.controller';
import { ProductController } from './presentation/controllers/product.controller';
import { UserService } from './application/services/user.service';
import { AuthService } from './application/services/auth.service';
import { ProductService } from './application/services/product.service';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { ProductRepository } from './infrastructure/repositories/product.repository';
import { JwtStrategy } from './presentation/strategies/jwt.strategy';
import { PrismaClient } from '../generated/prisma';

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
  ],
  providers: [
    AppService,
    UserService,
    AuthService,
    ProductService,
    JwtStrategy,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    {
      provide: 'IProductRepository',
      useClass: ProductRepository,
    },
    {
      provide: PrismaClient,
      useValue: new PrismaClient(),
    },
  ],
})
export class AppModule {}

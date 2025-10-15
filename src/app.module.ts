import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './presentation/controllers/user.controller';
import { UserService } from './application/services/user.service';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { PrismaClient } from '../generated/prisma';

@Module({
  imports: [],
  controllers: [AppController, UserController],
  providers: [
    AppService,
    UserService,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    {
      provide: PrismaClient,
      useValue: new PrismaClient(),
    },
  ],
})
export class AppModule {}

import { injectable } from 'tsyringe';
import { User, Role } from '../../domain/entities/user.entity';
import { Order } from '../../domain/entities/order.entity';
import {
  CreateCustomerDto,
  UpdateCustomerDto,
} from '../dto/create-customer.dto';
import { CreateUserUseCase } from '../../domain/use-cases/users/create-user.use-case';
import { GetCustomersUseCase } from '../../domain/use-cases/users/get-customers.use-case';
import { GetUserByIdUseCase } from '../../domain/use-cases/users/get-user-by-id.use-case';
import { UpdateUserUseCase } from '../../domain/use-cases/users/update-user.use-case';
import { DeleteUserUseCase } from '../../domain/use-cases/users/delete-user.use-case';
import { GetOrdersByCustomerUseCase } from '../../domain/use-cases/orders/get-orders-by-customer.use-case';

@injectable()
export class CustomerService {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getCustomersUseCase: GetCustomersUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly getOrdersByCustomerUseCase: GetOrdersByCustomerUseCase,
  ) {}

  async createCustomer(dto: CreateCustomerDto): Promise<User> {
    return this.createUserUseCase.execute({
      name: dto.name,
      email: dto.email,
      password: dto.password,
      role: Role.CUSTOMER,
    });
  }

  async getCustomerById(id: string): Promise<User | null> {
    const user = await this.getUserByIdUseCase.execute(id);
    return user && user.role === Role.CUSTOMER ? user : null;
  }

  async getAllCustomers(): Promise<User[]> {
    return this.getCustomersUseCase.execute();
  }

  async updateCustomer(
    id: string,
    dto: UpdateCustomerDto,
  ): Promise<User | null> {
    const updateData: any = {};

    if (dto.name) updateData.name = dto.name;
    if (dto.email) updateData.email = dto.email;
    if (dto.password) {
      updateData.password = dto.password; // Hashing will be handled in the use case
    }

    const updatedUser = await this.updateUserUseCase.execute(id, updateData);
    return updatedUser && updatedUser.role === Role.CUSTOMER
      ? updatedUser
      : null;
  }

  async deleteCustomer(id: string): Promise<boolean> {
    const user = await this.getUserByIdUseCase.execute(id);
    if (!user || user.role !== Role.CUSTOMER) {
      return false;
    }
    return this.deleteUserUseCase.execute(id);
  }

  async getCustomerOrders(customerId: string): Promise<Order[]> {
    const customer = await this.getCustomerById(customerId);
    if (!customer) {
      return [];
    }
    return this.getOrdersByCustomerUseCase.execute(customerId);
  }
}

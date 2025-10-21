import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customer.service';
import { CreateUserUseCase } from '../../domain/use-cases/users/create-user.use-case';
import { GetCustomersUseCase } from '../../domain/use-cases/users/get-customers.use-case';
import { GetUserByIdUseCase } from '../../domain/use-cases/users/get-user-by-id.use-case';
import { UpdateUserUseCase } from '../../domain/use-cases/users/update-user.use-case';
import { DeleteUserUseCase } from '../../domain/use-cases/users/delete-user.use-case';
import { GetOrdersByCustomerUseCase } from '../../domain/use-cases/orders/get-orders-by-customer.use-case';
import { User, Role } from '../../domain/entities/user.entity';
import { Order } from '../../domain/entities/order.entity';

describe('CustomerService', () => {
  let service: CustomerService;
  let createUserUseCase: jest.Mocked<CreateUserUseCase>;
  let getCustomersUseCase: jest.Mocked<GetCustomersUseCase>;
  let getUserByIdUseCase: jest.Mocked<GetUserByIdUseCase>;
  let updateUserUseCase: jest.Mocked<UpdateUserUseCase>;
  let deleteUserUseCase: jest.Mocked<DeleteUserUseCase>;
  let getOrdersByCustomerUseCase: jest.Mocked<GetOrdersByCustomerUseCase>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: CreateUserUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: GetCustomersUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: GetUserByIdUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: UpdateUserUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: DeleteUserUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: GetOrdersByCustomerUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
    createUserUseCase = module.get(CreateUserUseCase);
    getCustomersUseCase = module.get(GetCustomersUseCase);
    getUserByIdUseCase = module.get(GetUserByIdUseCase);
    updateUserUseCase = module.get(UpdateUserUseCase);
    deleteUserUseCase = module.get(DeleteUserUseCase);
    getOrdersByCustomerUseCase = module.get(GetOrdersByCustomerUseCase);
  });

  it('should create a customer', async () => {
    const dto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'pass',
    };
    const user = new User({
      ...dto,
      role: Role.CUSTOMER,
      isTwoFactorEnabled: false,
    });
    createUserUseCase.execute.mockResolvedValue(user);

    const result = await service.createCustomer(dto);

    expect(result).toEqual(user);
    expect(createUserUseCase.execute).toHaveBeenCalledWith({
      name: dto.name,
      email: dto.email,
      password: dto.password,
      role: Role.CUSTOMER,
    });
  });

  it('should get customer by id', async () => {
    const user = new User({
      name: 'John',
      email: 'john@example.com',
      password: 'pass',
      role: Role.CUSTOMER,
      isTwoFactorEnabled: false,
    });
    getUserByIdUseCase.execute.mockResolvedValue(user);

    const result = await service.getCustomerById('1');

    expect(result).toEqual(user);
  });

  it('should return null if user is not a customer', async () => {
    const user = new User({
      name: 'John',
      email: 'john@example.com',
      password: 'pass',
      role: Role.SELLER,
      isTwoFactorEnabled: false,
    });
    getUserByIdUseCase.execute.mockResolvedValue(user);

    const result = await service.getCustomerById('1');

    expect(result).toBeNull();
  });

  it('should get all customers', async () => {
    const customers = [
      new User({
        name: 'John',
        email: 'john@example.com',
        password: 'pass',
        role: Role.CUSTOMER,
        isTwoFactorEnabled: false,
      }),
    ];
    getCustomersUseCase.execute.mockResolvedValue(customers);

    const result = await service.getAllCustomers();

    expect(result).toEqual(customers);
  });

  it('should update customer', async () => {
    const dto = { name: 'Jane Doe' };
    const updatedUser = new User({
      name: 'Jane Doe',
      email: 'john@example.com',
      password: 'pass',
      role: Role.CUSTOMER,
      isTwoFactorEnabled: false,
    });
    updateUserUseCase.execute.mockResolvedValue(updatedUser);

    const result = await service.updateCustomer('1', dto);

    expect(result).toEqual(updatedUser);
  });

  it('should delete customer', async () => {
    const user = new User({
      name: 'John',
      email: 'john@example.com',
      password: 'pass',
      role: Role.CUSTOMER,
      isTwoFactorEnabled: false,
    });
    getUserByIdUseCase.execute.mockResolvedValue(user);
    deleteUserUseCase.execute.mockResolvedValue(true);

    const result = await service.deleteCustomer('1');

    expect(result).toBe(true);
  });

  it('should return false if trying to delete non-customer', async () => {
    const user = new User({
      name: 'John',
      email: 'john@example.com',
      password: 'pass',
      role: Role.SELLER,
      isTwoFactorEnabled: false,
    });
    getUserByIdUseCase.execute.mockResolvedValue(user);

    const result = await service.deleteCustomer('1');

    expect(result).toBe(false);
  });

  it('should get customer orders', async () => {
    const user = new User({
      name: 'John',
      email: 'john@example.com',
      password: 'pass',
      role: Role.CUSTOMER,
      isTwoFactorEnabled: false,
    });
    const orders: Order[] = [];
    getUserByIdUseCase.execute.mockResolvedValue(user);
    getOrdersByCustomerUseCase.execute.mockResolvedValue(orders);

    const result = await service.getCustomerOrders('1');

    expect(result).toEqual(orders);
  });

  it('should return empty array if customer not found', async () => {
    getUserByIdUseCase.execute.mockResolvedValue(null);

    const result = await service.getCustomerOrders('1');

    expect(result).toEqual([]);
  });
});

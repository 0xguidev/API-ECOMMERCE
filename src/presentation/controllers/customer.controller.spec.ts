import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from './customer.controller';
import { CustomerService } from '../../application/services/customer.service';
import { User, Role } from '../../domain/entities/user.entity';
import { Order } from '../../domain/entities/order.entity';

describe('CustomerController', () => {
  let controller: CustomerController;
  let service: jest.Mocked<CustomerService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        {
          provide: CustomerService,
          useValue: {
            createCustomer: jest.fn(),
            getCustomerById: jest.fn(),
            getAllCustomers: jest.fn(),
            updateCustomer: jest.fn(),
            deleteCustomer: jest.fn(),
            getCustomerOrders: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CustomerController>(CustomerController);
    service = module.get(CustomerService);
  });

  it('should create a customer', async () => {
    const dto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    };
    const user = new User({
      ...dto,
      role: Role.CUSTOMER,
      isTwoFactorEnabled: false,
    });
    service.createCustomer.mockResolvedValue(user);

    const result = await controller.create(dto);

    expect(result).toEqual(user);
  });

  it('should get customer by id', async () => {
    const user = new User({
      name: 'John',
      email: 'john@example.com',
      password: 'password123',
      role: Role.CUSTOMER,
      isTwoFactorEnabled: false,
    });
    service.getCustomerById.mockResolvedValue(user);

    const result = await controller.findOne('1');

    expect(result).toEqual(user);
  });

  it('should get all customers', async () => {
    const customers = [
      new User({
        name: 'John',
        email: 'john@example.com',
        password: 'password123',
        role: Role.CUSTOMER,
        isTwoFactorEnabled: false,
      }),
    ];
    service.getAllCustomers.mockResolvedValue(customers);

    const result = await controller.findAll();

    expect(result).toEqual(customers);
  });

  it('should update customer', async () => {
    const dto = { name: 'Jane Doe' };
    const updatedUser = new User({
      name: 'Jane Doe',
      email: 'john@example.com',
      password: 'password123',
      role: Role.CUSTOMER,
      isTwoFactorEnabled: false,
    });
    service.updateCustomer.mockResolvedValue(updatedUser);

    const result = await controller.update('1', dto);

    expect(result).toEqual(updatedUser);
  });

  it('should delete customer', async () => {
    service.deleteCustomer.mockResolvedValue(true);

    const result = await controller.remove('1');

    expect(result).toBe(true);
  });

  it('should get customer orders', async () => {
    const orders: Order[] = [];
    service.getCustomerOrders.mockResolvedValue(orders);

    const result = await controller.getOrders('1');

    expect(result).toEqual(orders);
  });
});

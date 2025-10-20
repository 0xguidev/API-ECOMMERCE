import 'reflect-metadata';
import { container } from 'tsyringe';
import { GetCustomersUseCase } from './get-customers.use-case';
import { IUserRepository } from '../../repositories/user.repository.interface';
import { User, Role } from '../../entities/user.entity';

describe('GetCustomersUseCase', () => {
  let useCase: GetCustomersUseCase;
  let userRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    userRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<IUserRepository>;

    container.registerInstance('IUserRepository', userRepository);
    useCase = container.resolve(GetCustomersUseCase);
  });

  afterEach(() => {
    container.clearInstances();
  });

  it('should return only customers', async () => {
    const users: User[] = [
      new User({
        name: 'Customer 1',
        email: 'customer1@example.com',
        password: 'password123',
        role: Role.CUSTOMER,
        isTwoFactorEnabled: false,
      }),
      new User({
        name: 'Seller 1',
        email: 'seller1@example.com',
        password: 'password123',
        role: Role.SELLER,
        isTwoFactorEnabled: false,
      }),
      new User({
        name: 'Customer 2',
        email: 'customer2@example.com',
        password: 'password123',
        role: Role.CUSTOMER,
        isTwoFactorEnabled: false,
      }),
    ];

    userRepository.findAll.mockResolvedValue(users);

    const result = await useCase.execute();

    expect(result).toHaveLength(2);
    expect(result.every((user) => user.role === Role.CUSTOMER)).toBe(true);
  });

  it('should return empty array if no customers', async () => {
    const users: User[] = [
      new User({
        name: 'Seller 1',
        email: 'seller1@example.com',
        password: 'password123',
        role: Role.SELLER,
        isTwoFactorEnabled: false,
      }),
      new User({
        name: 'Admin 1',
        email: 'admin1@example.com',
        password: 'password123',
        role: Role.ADMIN,
        isTwoFactorEnabled: false,
      }),
    ];

    userRepository.findAll.mockResolvedValue(users);

    const result = await useCase.execute();

    expect(result).toEqual([]);
  });
});

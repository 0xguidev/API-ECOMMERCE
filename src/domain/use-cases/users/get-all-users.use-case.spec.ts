import 'reflect-metadata';
import { GetAllUsersUseCase } from './get-all-users.use-case';
import { IUserRepository } from '../../repositories/user.repository.interface';
import { User, Role } from '../../entities/user.entity';

describe('GetAllUsersUseCase', () => {
  let useCase: GetAllUsersUseCase;
  let userRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    userRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<IUserRepository>;

    useCase = new GetAllUsersUseCase(userRepository);
  });

  it('should return all users', async () => {
    const mockUsers = [
      new User({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedpassword1',
        role: Role.CUSTOMER,
        isTwoFactorEnabled: false,
      }),
      new User({
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'hashedpassword2',
        role: Role.SELLER,
        isTwoFactorEnabled: true,
      }),
    ];

    userRepository.findAll.mockResolvedValue(mockUsers);

    const result = await useCase.execute();

    expect(userRepository.findAll).toHaveBeenCalled();
    expect(result).toHaveLength(2);
    expect(result[0]).toBeInstanceOf(User);
    expect(result[1]).toBeInstanceOf(User);
    expect(result[0].name).toBe('John Doe');
    expect(result[1].name).toBe('Jane Smith');
  });

  it('should return empty array when no users exist', async () => {
    userRepository.findAll.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(userRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});

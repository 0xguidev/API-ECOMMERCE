import 'reflect-metadata';
import { GetUserByIdUseCase } from './get-user-by-id.use-case';
import { IUserRepository } from '../../repositories/user.repository.interface';
import { User, Role } from '../../entities/user.entity';

describe('GetUserByIdUseCase', () => {
  let useCase: GetUserByIdUseCase;
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

    useCase = new GetUserByIdUseCase(userRepository);
  });

  it('should return user when found by id', async () => {
    const userId = 'user-123';
    const mockUser = new User({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashedpassword',
      role: Role.CUSTOMER,
      isTwoFactorEnabled: false,
    });

    userRepository.findById.mockResolvedValue(mockUser);

    const result = await useCase.execute(userId);

    expect(userRepository.findById).toHaveBeenCalledWith(userId);
    expect(result).toBeInstanceOf(User);
    expect(result.id).toBe(mockUser.id);
  });

  it('should return null when user not found', async () => {
    const userId = 'nonexistent-user';
    userRepository.findById.mockResolvedValue(null);

    const result = await useCase.execute(userId);

    expect(userRepository.findById).toHaveBeenCalledWith(userId);
    expect(result).toBeNull();
  });
});

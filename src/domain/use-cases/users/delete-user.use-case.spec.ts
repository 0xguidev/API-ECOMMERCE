import 'reflect-metadata';
import { DeleteUserUseCase } from './delete-user.use-case';
import { IUserRepository } from '../../repositories/user.repository.interface';

describe('DeleteUserUseCase', () => {
  let useCase: DeleteUserUseCase;
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

    useCase = new DeleteUserUseCase(userRepository);
  });

  it('should delete user successfully', async () => {
    const userId = 'user-123';
    userRepository.delete.mockResolvedValue(true);

    const result = await useCase.execute(userId);

    expect(userRepository.delete).toHaveBeenCalledWith(userId);
    expect(result).toBe(true);
  });

  it('should return false when user not found', async () => {
    const userId = 'nonexistent-user';
    userRepository.delete.mockResolvedValue(false);

    const result = await useCase.execute(userId);

    expect(userRepository.delete).toHaveBeenCalledWith(userId);
    expect(result).toBe(false);
  });
});

import 'reflect-metadata';
import { DisableTwoFactorUseCase } from './disable-two-factor.use-case';
import { IUserRepository } from '../../repositories/user.repository.interface';
import { User, Role } from '../../entities/user.entity';

describe('DisableTwoFactorUseCase', () => {
  let useCase: DisableTwoFactorUseCase;
  let userRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    userRepository = {
      findById: jest.fn(),
      create: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<IUserRepository>;

    useCase = new DisableTwoFactorUseCase(userRepository);
  });

  it('should disable 2FA successfully', async () => {
    const userId = 'user-123';

    const mockUser = new User({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashedpassword',
      role: Role.CUSTOMER,
      isTwoFactorEnabled: true,
      twoFactorSecret: 'JBSWY3DPEHPK3PXP',
    });

    userRepository.update.mockResolvedValue(mockUser);

    await useCase.execute(userId);

    expect(userRepository.update).toHaveBeenCalledWith(userId, {
      isTwoFactorEnabled: false,
      twoFactorSecret: undefined,
    });
  });
});

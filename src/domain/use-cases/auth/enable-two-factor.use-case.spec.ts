import 'reflect-metadata';
import { EnableTwoFactorUseCase } from './enable-two-factor.use-case';
import { IUserRepository } from '../../repositories/user.repository.interface';
import { User, Role } from '../../entities/user.entity';
import * as speakeasy from 'speakeasy';

describe('EnableTwoFactorUseCase', () => {
  let useCase: EnableTwoFactorUseCase;
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

    useCase = new EnableTwoFactorUseCase(userRepository);
  });

  it('should enable 2FA successfully', async () => {
    const userId = 'user-123';
    const token = '123456';
    const secret = 'JBSWY3DPEHPK3PXP';

    const mockUser = new User({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashedpassword',
      role: Role.CUSTOMER,
      isTwoFactorEnabled: false,
      twoFactorSecret: secret,
    });

    userRepository.findById.mockResolvedValue(mockUser);
    userRepository.update.mockResolvedValue(mockUser);

    // Mock speakeasy.totp.verify to return true
    jest.spyOn(speakeasy.totp, 'verify').mockReturnValue(true);

    await useCase.execute(userId, token);

    expect(userRepository.findById).toHaveBeenCalledWith(userId);
    expect(speakeasy.totp.verify).toHaveBeenCalledWith({
      secret,
      encoding: 'base32',
      token,
    });
    expect(userRepository.update).toHaveBeenCalledWith(userId, {
      isTwoFactorEnabled: true,
    });
  });

  it('should throw error when user not found', async () => {
    const userId = 'nonexistent-user';
    const token = '123456';

    userRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(userId, token)).rejects.toThrow(
      'User not found or 2FA not set up',
    );

    expect(userRepository.findById).toHaveBeenCalledWith(userId);
  });

  it('should throw error when user has no 2FA secret', async () => {
    const userId = 'user-123';
    const token = '123456';

    const mockUser = new User({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashedpassword',
      role: Role.CUSTOMER,
      isTwoFactorEnabled: false,
    });

    userRepository.findById.mockResolvedValue(mockUser);

    await expect(useCase.execute(userId, token)).rejects.toThrow(
      'User not found or 2FA not set up',
    );

    expect(userRepository.findById).toHaveBeenCalledWith(userId);
  });

  it('should throw error when token is invalid', async () => {
    const userId = 'user-123';
    const token = 'invalid-token';
    const secret = 'JBSWY3DPEHPK3PXP';

    const mockUser = new User({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashedpassword',
      role: Role.CUSTOMER,
      isTwoFactorEnabled: false,
      twoFactorSecret: secret,
    });

    userRepository.findById.mockResolvedValue(mockUser);

    // Mock speakeasy.totp.verify to return false
    jest.spyOn(speakeasy.totp, 'verify').mockReturnValue(false);

    await expect(useCase.execute(userId, token)).rejects.toThrow(
      'Invalid 2FA token',
    );

    expect(userRepository.findById).toHaveBeenCalledWith(userId);
    expect(speakeasy.totp.verify).toHaveBeenCalledWith({
      secret,
      encoding: 'base32',
      token,
    });
  });
});

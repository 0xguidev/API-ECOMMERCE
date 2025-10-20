import 'reflect-metadata';
import { VerifyTwoFactorUseCase } from './verify-two-factor.use-case';
import { IUserRepository } from '../../repositories/user.repository.interface';
import { User, Role } from '../../entities/user.entity';
import * as speakeasy from 'speakeasy';

describe('VerifyTwoFactorUseCase', () => {
  let useCase: VerifyTwoFactorUseCase;
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

    useCase = new VerifyTwoFactorUseCase(userRepository);
  });

  it('should verify 2FA token successfully', async () => {
    const userId = 'user-123';
    const token = '123456';
    const secret = 'JBSWY3DPEHPK3PXP';

    const mockUser = new User({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashedpassword',
      role: Role.CUSTOMER,
      isTwoFactorEnabled: true,
      twoFactorSecret: secret,
    });

    userRepository.findById.mockResolvedValue(mockUser);

    // Mock speakeasy.totp.verify to return true
    jest.spyOn(speakeasy.totp, 'verify').mockReturnValue(true);

    const result = await useCase.execute({ userId, token });

    expect(userRepository.findById).toHaveBeenCalledWith(userId);
    expect(speakeasy.totp.verify).toHaveBeenCalledWith({
      secret,
      encoding: 'base32',
      token,
    });
    expect(result).toBe(mockUser);
  });

  it('should return null when user not found', async () => {
    const userId = 'nonexistent-user';
    const token = '123456';

    userRepository.findById.mockResolvedValue(null);

    const result = await useCase.execute({ userId, token });

    expect(userRepository.findById).toHaveBeenCalledWith(userId);
    expect(result).toBeNull();
  });

  it('should return null when user has no 2FA secret', async () => {
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

    const result = await useCase.execute({ userId, token });

    expect(userRepository.findById).toHaveBeenCalledWith(userId);
    expect(result).toBeNull();
  });

  it('should return null when token is invalid', async () => {
    const userId = 'user-123';
    const token = 'invalid-token';
    const secret = 'JBSWY3DPEHPK3PXP';

    const mockUser = new User({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashedpassword',
      role: Role.CUSTOMER,
      isTwoFactorEnabled: true,
      twoFactorSecret: secret,
    });

    userRepository.findById.mockResolvedValue(mockUser);

    // Mock speakeasy.totp.verify to return false
    jest.spyOn(speakeasy.totp, 'verify').mockReturnValue(false);

    const result = await useCase.execute({ userId, token });

    expect(userRepository.findById).toHaveBeenCalledWith(userId);
    expect(speakeasy.totp.verify).toHaveBeenCalledWith({
      secret,
      encoding: 'base32',
      token,
    });
    expect(result).toBeNull();
  });
});

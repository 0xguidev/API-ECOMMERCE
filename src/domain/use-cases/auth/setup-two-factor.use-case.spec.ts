import 'reflect-metadata';
import { SetupTwoFactorUseCase } from './setup-two-factor.use-case';
import { IUserRepository } from '../../repositories/user.repository.interface';
import { User, Role } from '../../entities/user.entity';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';

describe('SetupTwoFactorUseCase', () => {
  let useCase: SetupTwoFactorUseCase;
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

    useCase = new SetupTwoFactorUseCase(userRepository);
  });

  it('should setup 2FA successfully', async () => {
    const userId = 'user-123';
    const secret = 'JBSWY3DPEHPK3PXP';
    const qrCodeUrl = 'data:image/png;base64,...';

    const mockUser = new User({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashedpassword',
      role: Role.CUSTOMER,
      isTwoFactorEnabled: false,
    });

    const mockSecret = {
      base32: secret,
      otpauth_url:
        'otpauth://totp/Ecommerce%20App%20(john@example.com)?secret=JBSWY3DPEHPK3PXP&issuer=Ecommerce%20API',
    };

    userRepository.findById.mockResolvedValue(mockUser);
    userRepository.update.mockResolvedValue(mockUser);

    // Mock speakeasy.generateSecret
    jest.spyOn(speakeasy, 'generateSecret').mockReturnValue(mockSecret as any);
    // Mock qrcode.toDataURL
    (jest.spyOn(qrcode, 'toDataURL') as any).mockResolvedValue(qrCodeUrl);

    const result = await useCase.execute(userId);

    expect(userRepository.findById).toHaveBeenCalledWith(userId);
    expect(speakeasy.generateSecret).toHaveBeenCalledWith({
      name: 'Ecommerce App (john@example.com)',
      issuer: 'Ecommerce API',
    });
    expect(qrcode.toDataURL).toHaveBeenCalledWith(mockSecret.otpauth_url);
    expect(userRepository.update).toHaveBeenCalledWith(userId, {
      twoFactorSecret: secret,
    });
    expect(result).toEqual({
      secret,
      qrCodeUrl,
    });
  });

  it('should throw error when user not found', async () => {
    const userId = 'nonexistent-user';

    userRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(userId)).rejects.toThrow('User not found');

    expect(userRepository.findById).toHaveBeenCalledWith(userId);
  });
});

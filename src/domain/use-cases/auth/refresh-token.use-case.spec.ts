import 'reflect-metadata';
import { RefreshTokenUseCase } from './refresh-token.use-case';
import { IUserRepository } from '../../repositories/user.repository.interface';
import { User, Role } from '../../entities/user.entity';
import { JwtService } from '@nestjs/jwt';

describe('RefreshTokenUseCase', () => {
  let useCase: RefreshTokenUseCase;
  let userRepository: jest.Mocked<IUserRepository>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(() => {
    userRepository = {
      findById: jest.fn(),
      create: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<IUserRepository>;

    jwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
      signAsync: jest.fn(),
      verifyAsync: jest.fn(),
      decode: jest.fn(),
    } as any;

    useCase = new RefreshTokenUseCase(userRepository, jwtService);
  });

  it('should refresh tokens successfully', async () => {
    const refreshToken = 'valid-refresh-token';
    const userId = 'user-123';

    const mockUser = new User({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashedpassword',
      role: Role.CUSTOMER,
      isTwoFactorEnabled: false,
    });

    const payload = { sub: userId, email: mockUser.email, role: mockUser.role };
    const newAccessToken = 'new-access-token';
    const newRefreshToken = 'new-refresh-token';

    jwtService.verify.mockReturnValue(payload);
    userRepository.findById.mockResolvedValue(mockUser);
    jwtService.sign
      .mockReturnValueOnce(newAccessToken)
      .mockReturnValueOnce(newRefreshToken);

    const result = await useCase.execute(refreshToken);

    expect(jwtService.verify).toHaveBeenCalledWith(refreshToken);
    expect(userRepository.findById).toHaveBeenCalledWith(userId);
    expect(jwtService.sign).toHaveBeenNthCalledWith(
      1,
      { sub: mockUser.id, email: mockUser.email, role: mockUser.role },
      {
        expiresIn: '15m',
      },
    );
    expect(jwtService.sign).toHaveBeenNthCalledWith(
      2,
      { sub: mockUser.id, email: mockUser.email, role: mockUser.role },
      {
        expiresIn: '7d',
      },
    );
    expect(result).toEqual({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  });

  it('should throw error when refresh token is invalid', async () => {
    const refreshToken = 'invalid-refresh-token';

    jwtService.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    await expect(useCase.execute(refreshToken)).rejects.toThrow(
      'Invalid refresh token',
    );

    expect(jwtService.verify).toHaveBeenCalledWith(refreshToken);
  });

  it('should throw error when user not found', async () => {
    const refreshToken = 'valid-refresh-token';
    const userId = 'nonexistent-user';

    const payload = {
      sub: userId,
      email: 'john@example.com',
      role: Role.CUSTOMER,
    };

    jwtService.verify.mockReturnValue(payload);
    userRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(refreshToken)).rejects.toThrow(
      'Invalid refresh token',
    );

    expect(jwtService.verify).toHaveBeenCalledWith(refreshToken);
    expect(userRepository.findById).toHaveBeenCalledWith(userId);
  });
});

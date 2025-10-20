import 'reflect-metadata';
import { LoginUseCase } from './login.use-case';
import { AuthenticateUserUseCase } from '../users/authenticate-user.use-case';
import { User, Role } from '../../entities/user.entity';

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
  let authenticateUserUseCase: jest.Mocked<AuthenticateUserUseCase>;

  beforeEach(() => {
    authenticateUserUseCase = {
      execute: jest.fn(),
    } as any;

    useCase = new LoginUseCase(authenticateUserUseCase);
  });

  it('should login user successfully without 2FA', async () => {
    const input = {
      email: 'john@example.com',
      password: 'password123',
    };

    const mockUser = new User({
      name: 'John Doe',
      email: input.email,
      password: 'hashedpassword',
      role: Role.CUSTOMER,
      isTwoFactorEnabled: false,
    });

    authenticateUserUseCase.execute.mockResolvedValue(mockUser);

    const result = await useCase.execute(input);

    expect(authenticateUserUseCase.execute).toHaveBeenCalledWith(input);
    expect(result).toEqual({ user: mockUser });
  });

  it('should return requiresTwoFactor when user has 2FA enabled', async () => {
    const input = {
      email: 'john@example.com',
      password: 'password123',
    };

    const mockUser = new User({
      name: 'John Doe',
      email: input.email,
      password: 'hashedpassword',
      role: Role.CUSTOMER,
      isTwoFactorEnabled: true,
    });

    authenticateUserUseCase.execute.mockResolvedValue(mockUser);

    const result = await useCase.execute(input);

    expect(authenticateUserUseCase.execute).toHaveBeenCalledWith(input);
    expect(result).toEqual({ user: mockUser, requiresTwoFactor: true });
  });

  it('should return null when authentication fails', async () => {
    const input = {
      email: 'john@example.com',
      password: 'wrongpassword',
    };

    authenticateUserUseCase.execute.mockResolvedValue(null);

    const result = await useCase.execute(input);

    expect(authenticateUserUseCase.execute).toHaveBeenCalledWith(input);
    expect(result).toBeNull();
  });
});

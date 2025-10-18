import 'reflect-metadata';
import { AuthenticateUserUseCase } from './authenticate-user.use-case';
import { IUserRepository } from '../../repositories/user.repository.interface';
import { User, Role } from '../../entities/user.entity';
import * as bcrypt from 'bcryptjs';

describe('AuthenticateUserUseCase', () => {
  let useCase: AuthenticateUserUseCase;
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

    useCase = new AuthenticateUserUseCase(userRepository);
  });

  it('should authenticate user with valid credentials', async () => {
    const input = {
      email: 'john@example.com',
      password: 'password123',
    };

    const hashedPassword = '$2a$10$exampleHashedPassword';
    const mockUser = new User({
      name: 'John Doe',
      email: input.email,
      password: hashedPassword,
      role: Role.CUSTOMER,
      isTwoFactorEnabled: false,
    });

    userRepository.findByEmail.mockResolvedValue(mockUser);

    // Mock bcrypt.compare to return true for valid password
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

    const result = await useCase.execute(input);

    expect(userRepository.findByEmail).toHaveBeenCalledWith(input.email);
    expect(result).toBeInstanceOf(User);
    expect(result.email).toBe(input.email);
  });

  it('should return null when user not found', async () => {
    const input = {
      email: 'nonexistent@example.com',
      password: 'password123',
    };

    userRepository.findByEmail.mockResolvedValue(null);

    const result = await useCase.execute(input);

    expect(userRepository.findByEmail).toHaveBeenCalledWith(input.email);
    expect(result).toBeNull();
  });

  it('should return null when password is invalid', async () => {
    const input = {
      email: 'john@example.com',
      password: 'wrongpassword',
    };

    const hashedPassword = '$2a$10$hashedpassword';
    const mockUser = new User({
      name: 'John Doe',
      email: input.email,
      password: hashedPassword,
      role: Role.CUSTOMER,
      isTwoFactorEnabled: false,
    });

    userRepository.findByEmail.mockResolvedValue(mockUser);

    // Mock bcrypt.compare to return false for invalid password
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

    const result = await useCase.execute(input);

    expect(userRepository.findByEmail).toHaveBeenCalledWith(input.email);
    expect(result).toBeNull();
  });

  it('should return null when user has no password', async () => {
    const input = {
      email: 'john@example.com',
      password: 'password123',
    };

    const mockUser = new User({
      name: 'John Doe',
      email: input.email,
      password: undefined,
      role: Role.CUSTOMER,
      isTwoFactorEnabled: false,
    });

    userRepository.findByEmail.mockResolvedValue(mockUser);

    const result = await useCase.execute(input);

    expect(userRepository.findByEmail).toHaveBeenCalledWith(input.email);
    expect(result).toBeNull();
  });
});

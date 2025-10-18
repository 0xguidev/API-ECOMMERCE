import 'reflect-metadata';
import { UpdateUserUseCase } from './update-user.use-case';
import { IUserRepository } from '../../repositories/user.repository.interface';
import { User, Role } from '../../entities/user.entity';
import * as bcrypt from 'bcryptjs';

describe('UpdateUserUseCase', () => {
  let useCase: UpdateUserUseCase;
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

    useCase = new UpdateUserUseCase(userRepository);
  });

  it('should update user name', async () => {
    const userId = 'user-123';
    const input = { name: 'Updated Name' };
    const updatedUser = new User({
      name: 'Updated Name',
      email: 'john@example.com',
      password: 'hashedpassword',
      role: Role.CUSTOMER,
      isTwoFactorEnabled: false,
    });

    userRepository.update.mockResolvedValue(updatedUser);

    const result = await useCase.execute(userId, input);

    expect(userRepository.update).toHaveBeenCalledWith(userId, {
      name: 'Updated Name',
    });
    expect(result).toBeInstanceOf(User);
    expect(result.name).toBe('Updated Name');
  });

  it('should update user email', async () => {
    const userId = 'user-123';
    const input = { email: 'newemail@example.com' };
    const updatedUser = new User({
      name: 'John Doe',
      email: 'newemail@example.com',
      password: 'hashedpassword',
      role: Role.CUSTOMER,
      isTwoFactorEnabled: false,
    });

    userRepository.update.mockResolvedValue(updatedUser);

    const result = await useCase.execute(userId, input);

    expect(userRepository.update).toHaveBeenCalledWith(userId, {
      email: 'newemail@example.com',
    });
    expect(result.email).toBe('newemail@example.com');
  });

  it('should update user role', async () => {
    const userId = 'user-123';
    const input = { role: Role.SELLER };
    const updatedUser = new User({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashedpassword',
      role: Role.SELLER,
      isTwoFactorEnabled: false,
    });

    userRepository.update.mockResolvedValue(updatedUser);

    const result = await useCase.execute(userId, input);

    expect(userRepository.update).toHaveBeenCalledWith(userId, {
      role: Role.SELLER,
    });
    expect(result.role).toBe(Role.SELLER);
  });

  it('should hash password when updating', async () => {
    const userId = 'user-123';
    const input = { password: 'newpassword123' };
    const hashedPassword = '$2a$10$newHashedPassword';
    const updatedUser = new User({
      name: 'John Doe',
      email: 'john@example.com',
      password: hashedPassword,
      role: Role.CUSTOMER,
      isTwoFactorEnabled: false,
    });

    userRepository.update.mockResolvedValue(updatedUser);

    // Mock bcrypt.hash
    jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);

    const result = await useCase.execute(userId, input);

    expect(bcrypt.hash).toHaveBeenCalledWith('newpassword123', 10);
    expect(userRepository.update).toHaveBeenCalledWith(userId, {
      password: hashedPassword,
    });
    expect(result.password).toBe(hashedPassword);
  });

  it('should update multiple fields', async () => {
    const userId = 'user-123';
    const input = {
      name: 'Updated Name',
      email: 'newemail@example.com',
      role: Role.SELLER,
    };
    const updatedUser = new User({
      name: 'Updated Name',
      email: 'newemail@example.com',
      password: 'hashedpassword',
      role: Role.SELLER,
      isTwoFactorEnabled: false,
    });

    userRepository.update.mockResolvedValue(updatedUser);

    const result = await useCase.execute(userId, input);

    expect(userRepository.update).toHaveBeenCalledWith(userId, {
      name: 'Updated Name',
      email: 'newemail@example.com',
      role: Role.SELLER,
    });
    expect(result.name).toBe('Updated Name');
    expect(result.email).toBe('newemail@example.com');
    expect(result.role).toBe(Role.SELLER);
  });

  it('should return null when user not found', async () => {
    const userId = 'nonexistent-user';
    const input = { name: 'Updated Name' };

    userRepository.update.mockResolvedValue(null);

    const result = await useCase.execute(userId, input);

    expect(userRepository.update).toHaveBeenCalledWith(userId, {
      name: 'Updated Name',
    });
    expect(result).toBeNull();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserUseCase } from './create-user.use-case';
import { IUserRepository } from '../../repositories/user.repository.interface';
import { User, Role } from '../../entities/user.entity';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let userRepository: jest.Mocked<IUserRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        {
          provide: 'IUserRepository',
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<CreateUserUseCase>(CreateUserUseCase);
    userRepository = module.get('IUserRepository');
  });

  it('should create a user successfully', async () => {
    const input = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: Role.CUSTOMER,
    };

    const mockUser = new User({
      name: input.name,
      email: input.email,
      password: 'hashedpassword',
      role: input.role,
      isTwoFactorEnabled: false,
    });

    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.create.mockResolvedValue(mockUser);

    const result = await useCase.execute(input);

    expect(userRepository.findByEmail).toHaveBeenCalledWith(input.email);
    expect(userRepository.create).toHaveBeenCalled();
    expect(result).toBeInstanceOf(User);
    expect(result.name).toBe(input.name);
    expect(result.email).toBe(input.email);
    expect(result.role).toBe(input.role);
  });

  it('should throw error when user with email already exists', async () => {
    const input = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: Role.CUSTOMER,
    };

    const existingUser = new User({
      name: 'Existing User',
      email: input.email,
      password: 'hashedpassword',
      role: Role.CUSTOMER,
      isTwoFactorEnabled: false,
    });

    userRepository.findByEmail.mockResolvedValue(existingUser);

    await expect(useCase.execute(input)).rejects.toThrow(
      'User with this email already exists',
    );

    expect(userRepository.findByEmail).toHaveBeenCalledWith(input.email);
    expect(userRepository.create).not.toHaveBeenCalled();
  });

  it('should hash the password before creating user', async () => {
    const input = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: Role.CUSTOMER,
    };

    const mockUser = new User({
      name: input.name,
      email: input.email,
      password: 'hashedpassword',
      role: input.role,
      isTwoFactorEnabled: false,
    });

    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.create.mockResolvedValue(mockUser);

    await useCase.execute(input);

    const createCall = userRepository.create.mock.calls[0][0];
    expect(createCall.password).not.toBe(input.password);
    expect(createCall.password).toBeDefined();
  });
});

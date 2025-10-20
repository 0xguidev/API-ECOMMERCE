import 'reflect-metadata';
import { RegisterUseCase } from './register.use-case';
import { CreateUserUseCase } from '../users/create-user.use-case';
import { User, Role } from '../../entities/user.entity';

describe('RegisterUseCase', () => {
  let useCase: RegisterUseCase;
  let createUserUseCase: jest.Mocked<CreateUserUseCase>;

  beforeEach(() => {
    createUserUseCase = {
      execute: jest.fn(),
    } as any;

    useCase = new RegisterUseCase(createUserUseCase);
  });

  it('should register a user successfully', async () => {
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

    createUserUseCase.execute.mockResolvedValue(mockUser);

    const result = await useCase.execute(input);

    expect(createUserUseCase.execute).toHaveBeenCalledWith(input);
    expect(result).toBeInstanceOf(User);
    expect(result.name).toBe(input.name);
    expect(result.email).toBe(input.email);
  });
});

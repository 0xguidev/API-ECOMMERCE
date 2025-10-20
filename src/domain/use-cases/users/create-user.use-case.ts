import { inject, injectable } from 'tsyringe';
import * as bcrypt from 'bcryptjs';
import { User, Role } from '../../entities/user.entity';
import { IUserRepository } from '../../repositories/user.repository.interface';

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: Role;
}

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(input: CreateUserInput): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);

    const user = new User({
      name: input.name,
      email: input.email,
      password: hashedPassword,
      role: input.role,
      isTwoFactorEnabled: false,
    });

    return this.userRepository.create(user);
  }
}

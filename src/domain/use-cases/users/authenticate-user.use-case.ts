import { inject, injectable } from 'tsyringe';
import * as bcrypt from 'bcryptjs';
import { User } from '../../entities/user.entity';
import { IUserRepository } from '../../repositories/user.repository.interface';

export interface AuthenticateUserInput {
  email: string;
  password: string;
}

@injectable()
export class AuthenticateUserUseCase {
  constructor(
    @inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(input: AuthenticateUserInput): Promise<User | null> {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user || !user.password) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }
}

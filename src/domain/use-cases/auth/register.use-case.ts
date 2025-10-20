import { injectable } from 'tsyringe';
import { User } from '../../entities/user.entity';
import {
  CreateUserUseCase,
  CreateUserInput,
} from '../users/create-user.use-case';

@injectable()
export class RegisterUseCase {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  async execute(input: CreateUserInput): Promise<User> {
    return this.createUserUseCase.execute(input);
  }
}

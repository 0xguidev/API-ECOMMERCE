import { inject, injectable } from 'tsyringe';
import * as bcrypt from 'bcryptjs';
import { User, Role } from '../../entities/user.entity';
import { IUserRepository } from '../../repositories/user.repository.interface';

export interface UpdateUserInput {
  name?: string;
  email?: string;
  role?: Role;
  password?: string;
}

@injectable()
export class UpdateUserUseCase {
  constructor(
    @inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string, input: UpdateUserInput): Promise<User | null> {
    const updateData: Partial<User> = {};

    if (input.name) updateData.name = input.name;
    if (input.email) updateData.email = input.email;
    if (input.role) updateData.role = input.role;
    if (input.password) {
      updateData.password = await bcrypt.hash(input.password, 10);
    }

    return this.userRepository.update(id, updateData);
  }
}

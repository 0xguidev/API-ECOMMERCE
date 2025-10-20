import { inject, injectable } from 'tsyringe';
import { User, Role } from '../../entities/user.entity';
import { IUserRepository } from '../../repositories/user.repository.interface';

@injectable()
export class GetCustomersUseCase {
  constructor(
    @inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(): Promise<User[]> {
    const users = await this.userRepository.findAll();
    return users.filter((user) => user.role === Role.CUSTOMER);
  }
}

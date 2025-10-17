import { inject, injectable } from 'tsyringe';
import { User } from '../../entities/user.entity';
import { IUserRepository } from '../../repositories/user.repository.interface';

@injectable()
export class GetAllUsersUseCase {
  constructor(
    @inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(): Promise<User[]> {
    return this.userRepository.findAll();
  }
}

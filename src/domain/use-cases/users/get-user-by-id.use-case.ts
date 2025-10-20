import { inject, injectable } from 'tsyringe';
import { User } from '../../entities/user.entity';
import { IUserRepository } from '../../repositories/user.repository.interface';

@injectable()
export class GetUserByIdUseCase {
  constructor(
    @inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }
}

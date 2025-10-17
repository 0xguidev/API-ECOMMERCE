
import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../../repositories/user.repository.interface';

@injectable()
export class DeleteUserUseCase {
  constructor(
    @inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string): Promise<boolean> {
    return this.userRepository.delete(id);
  }
}

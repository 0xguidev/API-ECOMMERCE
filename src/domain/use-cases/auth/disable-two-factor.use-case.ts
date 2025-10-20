import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../../repositories/user.repository.interface';

@injectable()
export class DisableTwoFactorUseCase {
  constructor(
    @inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string): Promise<void> {
    await this.userRepository.update(userId, {
      isTwoFactorEnabled: false,
      twoFactorSecret: undefined,
    } as Partial<import('../../entities/user.entity').User>);
  }
}

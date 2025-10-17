import { inject, injectable } from 'tsyringe';
import * as speakeasy from 'speakeasy';
import { IUserRepository } from '../../repositories/user.repository.interface';

@injectable()
export class EnableTwoFactorUseCase {
  constructor(
    @inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string, token: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user || !user.twoFactorSecret) {
      throw new Error('User not found or 2FA not set up');
    }

    const isValid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
    });

    if (!isValid) {
      throw new Error('Invalid 2FA token');
    }

    await this.userRepository.update(userId, {
      isTwoFactorEnabled: true,
    } as Partial<import('../../entities/user.entity').User>);
  }
}

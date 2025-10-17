import { inject, injectable } from 'tsyringe';
import * as speakeasy from 'speakeasy';
import { User } from '../../entities/user.entity';
import { IUserRepository } from '../../repositories/user.repository.interface';

export interface VerifyTwoFactorInput {
  userId: string;
  token: string;
}

@injectable()
export class VerifyTwoFactorUseCase {
  constructor(
    @inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(input: VerifyTwoFactorInput): Promise<User | null> {
    const user = await this.userRepository.findById(input.userId);
    if (!user || !user.twoFactorSecret) {
      return null;
    }

    const isValid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: input.token,
    });

    if (!isValid) {
      return null;
    }

    return user;
  }
}

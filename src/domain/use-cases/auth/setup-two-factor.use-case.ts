import { inject, injectable } from 'tsyringe';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import { IUserRepository } from '../../repositories/user.repository.interface';

export interface TwoFactorSetupResult {
  secret: string;
  qrCodeUrl: string;
}

@injectable()
export class SetupTwoFactorUseCase {
  constructor(
    @inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string): Promise<TwoFactorSetupResult> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const secret = speakeasy.generateSecret({
      name: `Ecommerce App (${user.email})`,
      issuer: 'Ecommerce API',
    });

    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);

    // Update user with 2FA secret but don't enable yet
    await this.userRepository.update(userId, {
      twoFactorSecret: secret.base32,
    } as Partial<import('../../entities/user.entity').User>);

    return {
      secret: secret.base32,
      qrCodeUrl,
    };
  }
}

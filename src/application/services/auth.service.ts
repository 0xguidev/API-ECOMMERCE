import { inject, injectable } from 'tsyringe';
import { JwtService } from '@nestjs/jwt';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { UserService } from './user.service';
import { LoginUserDto, VerifyTwoFactorDto } from '../dto/create-user.dto';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface TwoFactorSetup {
  secret: string;
  qrCodeUrl: string;
}

@injectable()
export class AuthService {
  constructor(
    @inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: any): Promise<User> {
    return this.userService.createUser(dto);
  }

  async login(
    dto: LoginUserDto,
  ): Promise<{ user: User; tokens?: AuthTokens; requiresTwoFactor?: boolean }> {
    const user = await this.userService.authenticateUser(dto);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (user.isTwoFactorEnabled) {
      return { user, requiresTwoFactor: true };
    }

    const tokens = await this.generateTokens(user);
    return { user, tokens };
  }

  async verifyTwoFactor(
    userId: string,
    dto: VerifyTwoFactorDto,
  ): Promise<AuthTokens> {
    const user = await this.userRepository.findById(userId);
    if (!user || !user.twoFactorSecret) {
      throw new Error('User not found or 2FA not enabled');
    }

    const isValid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: dto.token,
    });

    if (!isValid) {
      throw new Error('Invalid 2FA token');
    }

    return this.generateTokens(user);
  }

  async setupTwoFactor(userId: string): Promise<TwoFactorSetup> {
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
    } as Partial<User>);

    return {
      secret: secret.base32,
      qrCodeUrl,
    };
  }

  async enableTwoFactor(userId: string, token: string): Promise<void> {
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
    } as Partial<User>);
  }

  async disableTwoFactor(userId: string): Promise<void> {
    await this.userRepository.update(userId, {
      isTwoFactorEnabled: false,
      twoFactorSecret: undefined,
    } as Partial<User>);
  }

  private async generateTokens(user: User): Promise<AuthTokens> {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.userRepository.findById(payload.sub);

      if (!user) {
        throw new Error('User not found');
      }

      return this.generateTokens(user);
    } catch {
      throw new Error('Invalid refresh token');
    }
  }
}

import { injectable } from 'tsyringe';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../domain/entities/user.entity';
import { UserService } from './user.service';
import { LoginUserDto, VerifyTwoFactorDto } from '../dto/create-user.dto';
import { RegisterUseCase } from '../../domain/use-cases/auth/register.use-case';
import { LoginUseCase } from '../../domain/use-cases/auth/login.use-case';
import { VerifyTwoFactorUseCase } from '../../domain/use-cases/auth/verify-two-factor.use-case';
import { SetupTwoFactorUseCase } from '../../domain/use-cases/auth/setup-two-factor.use-case';
import { EnableTwoFactorUseCase } from '../../domain/use-cases/auth/enable-two-factor.use-case';
import { DisableTwoFactorUseCase } from '../../domain/use-cases/auth/disable-two-factor.use-case';
import { RefreshTokenUseCase } from '../../domain/use-cases/auth/refresh-token.use-case';

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
    private readonly userService: UserService,
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly verifyTwoFactorUseCase: VerifyTwoFactorUseCase,
    private readonly setupTwoFactorUseCase: SetupTwoFactorUseCase,
    private readonly enableTwoFactorUseCase: EnableTwoFactorUseCase,
    private readonly disableTwoFactorUseCase: DisableTwoFactorUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: any): Promise<User> {
    return this.registerUseCase.execute(dto);
  }

  async login(
    dto: LoginUserDto,
  ): Promise<{ user: User; tokens?: AuthTokens; requiresTwoFactor?: boolean }> {
    const result = await this.loginUseCase.execute(dto);
    if (!result) {
      throw new Error('Invalid credentials');
    }

    if (result.requiresTwoFactor) {
      return { user: result.user, requiresTwoFactor: true };
    }

    const tokens = await this.generateTokens(result.user);
    return { user: result.user, tokens };
  }

  private async generateTokens(user: User): Promise<AuthTokens> {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return { accessToken, refreshToken };
  }

  async verifyTwoFactor(
    userId: string,
    dto: VerifyTwoFactorDto,
  ): Promise<AuthTokens> {
    const user = await this.verifyTwoFactorUseCase.execute({
      userId,
      token: dto.token,
    });
    if (!user) {
      throw new Error('Invalid 2FA token');
    }

    return this.generateTokens(user);
  }

  async setupTwoFactor(userId: string): Promise<TwoFactorSetup> {
    return this.setupTwoFactorUseCase.execute(userId);
  }

  async enableTwoFactor(userId: string, token: string): Promise<void> {
    return this.enableTwoFactorUseCase.execute(userId, token);
  }

  async disableTwoFactor(userId: string): Promise<void> {
    return this.disableTwoFactorUseCase.execute(userId);
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    return this.refreshTokenUseCase.execute(refreshToken);
  }
}

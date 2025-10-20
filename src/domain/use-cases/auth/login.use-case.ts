import { injectable } from 'tsyringe';
import { User } from '../../entities/user.entity';
import { AuthenticateUserUseCase } from '../users/authenticate-user.use-case';

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResult {
  user: User;
  requiresTwoFactor?: boolean;
}

@injectable()
export class LoginUseCase {
  constructor(
    private readonly authenticateUserUseCase: AuthenticateUserUseCase,
  ) {}

  async execute(input: LoginInput): Promise<LoginResult | null> {
    const user = await this.authenticateUserUseCase.execute(input);
    if (!user) {
      return null;
    }

    if (user.isTwoFactorEnabled) {
      return { user, requiresTwoFactor: true };
    }

    return { user };
  }
}

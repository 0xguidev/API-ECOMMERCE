import { Body, Controller, Post } from '@nestjs/common';
import {
  AuthService,
  AuthTokens,
  TwoFactorSetup,
} from '../../application/services/auth.service';
import {
  CreateUserDto,
  createUserSchema,
  LoginUserDto,
  loginUserSchema,
  verifyTwoFactorSchema,
} from '../../application/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: CreateUserDto) {
    const dto = createUserSchema.parse(body);
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() body: LoginUserDto) {
    const dto = loginUserSchema.parse(body);
    return this.authService.login(dto);
  }

  @Post('verify-2fa')
  async verifyTwoFactor(@Body() body: { userId: string; token: string }) {
    const dto = verifyTwoFactorSchema.parse({ token: body.token });
    return this.authService.verifyTwoFactor(body.userId, dto);
  }

  @Post('setup-2fa')
  async setupTwoFactor(@Body() body: { userId: string }): Promise<TwoFactorSetup> {
    return this.authService.setupTwoFactor(body.userId);
  }

  @Post('enable-2fa')
  async enableTwoFactor(@Body() body: { userId: string; token: string }) {
    return this.authService.enableTwoFactor(body.userId, body.token);
  }

  @Post('disable-2fa')
  async disableTwoFactor(@Body() body: { userId: string }) {
    return this.authService.disableTwoFactor(body.userId);
  }

  @Post('refresh')
  async refreshToken(@Body() body: { refreshToken: string }): Promise<AuthTokens> {
    return this.authService.refreshToken(body.refreshToken);
  }
}

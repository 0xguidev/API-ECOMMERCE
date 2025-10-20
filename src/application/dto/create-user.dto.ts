import { z } from 'zod';
import { Role } from '../../domain/entities/user.entity';

export const createUserSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  role: z.nativeEnum(Role).optional().default(Role.CUSTOMER),
});

export const loginUserSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

export const verifyTwoFactorSchema = z.object({
  token: z.string().min(6, 'Token deve ter 6 dígitos'),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type LoginUserDto = z.infer<typeof loginUserSchema>;
export type VerifyTwoFactorDto = z.infer<typeof verifyTwoFactorSchema>;

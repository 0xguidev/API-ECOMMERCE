import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  price: z.number().positive('Preço deve ser positivo'),
  stock: z.number().int().min(0, 'Estoque deve ser maior ou igual a 0'),
  sellerId: z.string().uuid('ID do vendedor inválido'),
  category: z.string().optional(),
  images: z.array(z.string().url('URL da imagem inválida')).default([]),
  variations: z.any().optional(),
});

export const updateProductSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').optional(),
  description: z.string().optional(),
  price: z.number().positive('Preço deve ser positivo').optional(),
  stock: z
    .number()
    .int()
    .min(0, 'Estoque deve ser maior ou igual a 0')
    .optional(),
  category: z.string().optional(),
  images: z.array(z.string().url('URL da imagem inválida')).optional(),
  variations: z.any().optional(),
});

export type CreateProductDto = z.infer<typeof createProductSchema>;
export type UpdateProductDto = z.infer<typeof updateProductSchema>;

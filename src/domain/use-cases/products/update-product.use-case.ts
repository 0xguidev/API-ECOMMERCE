import { inject, injectable } from 'tsyringe';
import { Product } from '../../entities/product.entity';
import { IProductRepository } from '../../repositories/product.repository.interface';

export interface UpdateProductInput {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  category?: string;
  images?: string[];
  variations?: any[];
}

@injectable()
export class UpdateProductUseCase {
  constructor(
    @inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(
    id: string,
    input: UpdateProductInput,
  ): Promise<Product | null> {
    return this.productRepository.update(id, input);
  }
}

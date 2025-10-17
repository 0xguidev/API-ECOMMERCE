import { inject, injectable } from 'tsyringe';
import { Product } from '../../entities/product.entity';
import { IProductRepository } from '../../repositories/product.repository.interface';

@injectable()
export class GetProductsByCategoryUseCase {
  constructor(
    @inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(category: string): Promise<Product[]> {
    return this.productRepository.findByCategory(category);
  }
}

import { inject, injectable } from 'tsyringe';
import { Product } from '../../entities/product.entity';
import { IProductRepository } from '../../repositories/product.repository.interface';

@injectable()
export class GetProductsBySellerUseCase {
  constructor(
    @inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(sellerId: string): Promise<Product[]> {
    return this.productRepository.findBySellerId(sellerId);
  }
}

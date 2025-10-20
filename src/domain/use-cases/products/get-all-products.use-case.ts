import { inject, injectable } from 'tsyringe';
import { Product } from '../../entities/product.entity';
import { IProductRepository } from '../../repositories/product.repository.interface';

@injectable()
export class GetAllProductsUseCase {
  constructor(
    @inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(): Promise<Product[]> {
    return this.productRepository.findAll();
  }
}

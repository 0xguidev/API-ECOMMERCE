import { inject, injectable } from 'tsyringe';
import { Product } from '../../entities/product.entity';
import { IProductRepository } from '../../repositories/product.repository.interface';

@injectable()
export class GetProductByIdUseCase {
  constructor(
    @inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(id: string): Promise<Product | null> {
    return this.productRepository.findById(id);
  }
}

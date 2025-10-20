import { inject, injectable } from 'tsyringe';
import { Product } from '../../entities/product.entity';
import { IProductRepository } from '../../repositories/product.repository.interface';

@injectable()
export class UpdateStockUseCase {
  constructor(
    @inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(id: string, stock: number): Promise<Product | null> {
    return this.productRepository.updateStock(id, stock);
  }
}

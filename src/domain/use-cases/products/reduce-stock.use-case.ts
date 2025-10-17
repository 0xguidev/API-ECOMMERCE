import { inject, injectable } from 'tsyringe';
import { Product } from '../../entities/product.entity';
import { IProductRepository } from '../../repositories/product.repository.interface';

@injectable()
export class ReduceStockUseCase {
  constructor(
    @inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(id: string, quantity: number): Promise<Product | null> {
    const product = await this.productRepository.findById(id);
    if (!product || product.stock < quantity) {
      return null;
    }

    const newStock = product.stock - quantity;
    return this.productRepository.updateStock(id, newStock);
  }
}

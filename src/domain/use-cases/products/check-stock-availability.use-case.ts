import { inject, injectable } from 'tsyringe';
import { IProductRepository } from '../../repositories/product.repository.interface';

@injectable()
export class CheckStockAvailabilityUseCase {
  constructor(
    @inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(id: string, quantity: number): Promise<boolean> {
    const product = await this.productRepository.findById(id);
    return product ? product.stock >= quantity : false;
  }
}

import { inject, injectable } from 'tsyringe';
import { IProductRepository } from '../../repositories/product.repository.interface';

@injectable()
export class DeleteProductUseCase {
  constructor(
    @inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(id: string): Promise<boolean> {
    return this.productRepository.delete(id);
  }
}

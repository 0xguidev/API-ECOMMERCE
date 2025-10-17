import { inject, injectable } from 'tsyringe';
import { Product } from '../../entities/product.entity';
import { IProductRepository } from '../../repositories/product.repository.interface';

export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  stock: number;
  sellerId: string;
  category: string;
  images: string[];
  variations: any[];
}

@injectable()
export class CreateProductUseCase {
  constructor(
    @inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(input: CreateProductInput): Promise<Product> {
    const product = new Product({
      name: input.name,
      description: input.description,
      price: input.price,
      stock: input.stock,
      sellerId: input.sellerId,
      category: input.category,
      images: input.images,
      variations: input.variations,
    });

    return this.productRepository.create(product);
  }
}

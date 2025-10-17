import { inject, injectable } from 'tsyringe';
import { Product } from '../../domain/entities/product.entity';
import { IProductRepository } from '../../domain/repositories/product.repository.interface';
import { CreateProductDto, UpdateProductDto } from '../dto/create-product.dto';

@injectable()
export class ProductService {
  constructor(
    @inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async createProduct(dto: CreateProductDto): Promise<Product> {
    const product = new Product({
      name: dto.name,
      description: dto.description,
      price: dto.price,
      stock: dto.stock,
      sellerId: dto.sellerId,
      category: dto.category,
      images: dto.images,
      variations: dto.variations,
    });

    return this.productRepository.create(product);
  }

  async getProductById(id: string): Promise<Product | null> {
    return this.productRepository.findById(id);
  }

  async getProductsBySeller(sellerId: string): Promise<Product[]> {
    return this.productRepository.findBySellerId(sellerId);
  }

  async getAllProducts(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return this.productRepository.findByCategory(category);
  }

  async updateProduct(
    id: string,
    dto: UpdateProductDto,
  ): Promise<Product | null> {
    return this.productRepository.update(id, dto);
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.productRepository.delete(id);
  }

  async updateStock(id: string, stock: number): Promise<Product | null> {
    return this.productRepository.updateStock(id, stock);
  }

  async checkStockAvailability(id: string, quantity: number): Promise<boolean> {
    const product = await this.productRepository.findById(id);
    return product ? product.stock >= quantity : false;
  }

  async reduceStock(id: string, quantity: number): Promise<Product | null> {
    const product = await this.productRepository.findById(id);
    if (!product || product.stock < quantity) {
      return null;
    }

    const newStock = product.stock - quantity;
    return this.productRepository.updateStock(id, newStock);
  }
}

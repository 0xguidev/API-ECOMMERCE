import { injectable } from 'tsyringe';
import { Product } from '../../domain/entities/product.entity';
import { CreateProductDto, UpdateProductDto } from '../dto/create-product.dto';
import { CreateProductUseCase } from '../../domain/use-cases/products/create-product.use-case';
import { GetProductByIdUseCase } from '../../domain/use-cases/products/get-product-by-id.use-case';
import { GetProductsBySellerUseCase } from '../../domain/use-cases/products/get-products-by-seller.use-case';
import { GetAllProductsUseCase } from '../../domain/use-cases/products/get-all-products.use-case';
import { GetProductsByCategoryUseCase } from '../../domain/use-cases/products/get-products-by-category.use-case';
import { UpdateProductUseCase } from '../../domain/use-cases/products/update-product.use-case';
import { DeleteProductUseCase } from '../../domain/use-cases/products/delete-product.use-case';
import { UpdateStockUseCase } from '../../domain/use-cases/products/update-stock.use-case';
import { CheckStockAvailabilityUseCase } from '../../domain/use-cases/products/check-stock-availability.use-case';
import { ReduceStockUseCase } from '../../domain/use-cases/products/reduce-stock.use-case';

@injectable()
export class ProductService {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly getProductByIdUseCase: GetProductByIdUseCase,
    private readonly getProductsBySellerUseCase: GetProductsBySellerUseCase,
    private readonly getAllProductsUseCase: GetAllProductsUseCase,
    private readonly getProductsByCategoryUseCase: GetProductsByCategoryUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
    private readonly updateStockUseCase: UpdateStockUseCase,
    private readonly checkStockAvailabilityUseCase: CheckStockAvailabilityUseCase,
    private readonly reduceStockUseCase: ReduceStockUseCase,
  ) {}

  async createProduct(dto: CreateProductDto): Promise<Product> {
    return this.createProductUseCase.execute({
      name: dto.name,
      description: dto.description,
      price: dto.price,
      stock: dto.stock,
      sellerId: dto.sellerId,
      category: dto.category,
      images: dto.images,
      variations: dto.variations,
    });
  }

  async getProductById(id: string): Promise<Product | null> {
    return this.getProductByIdUseCase.execute(id);
  }

  async getProductsBySeller(sellerId: string): Promise<Product[]> {
    return this.getProductsBySellerUseCase.execute(sellerId);
  }

  async getAllProducts(): Promise<Product[]> {
    return this.getAllProductsUseCase.execute();
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return this.getProductsByCategoryUseCase.execute(category);
  }

  async updateProduct(
    id: string,
    dto: UpdateProductDto,
  ): Promise<Product | null> {
    return this.updateProductUseCase.execute(id, dto);
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.deleteProductUseCase.execute(id);
  }

  async updateStock(id: string, stock: number): Promise<Product | null> {
    return this.updateStockUseCase.execute(id, stock);
  }

  async checkStockAvailability(id: string, quantity: number): Promise<boolean> {
    return this.checkStockAvailabilityUseCase.execute(id, quantity);
  }

  async reduceStock(id: string, quantity: number): Promise<Product | null> {
    return this.reduceStockUseCase.execute(id, quantity);
  }
}

import 'reflect-metadata';
import { UpdateStockUseCase } from './update-stock.use-case';
import { IProductRepository } from '../../repositories/product.repository.interface';
import { Product } from '../../entities/product.entity';

describe('UpdateStockUseCase', () => {
  let useCase: UpdateStockUseCase;
  let productRepository: jest.Mocked<IProductRepository>;

  beforeEach(() => {
    productRepository = {
      findById: jest.fn(),
      create: jest.fn(),
      findAll: jest.fn(),
      findBySellerId: jest.fn(),
      findByCategory: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      updateStock: jest.fn(),
    } as jest.Mocked<IProductRepository>;

    useCase = new UpdateStockUseCase(productRepository);
  });

  it('should update stock successfully', async () => {
    const productId = 'product-123';
    const newStock = 50;

    const updatedProduct = new Product(
      {
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        stock: newStock,
        sellerId: 'seller-123',
        category: 'Electronics',
        images: [],
        variations: [],
      },
      productId,
    );

    productRepository.updateStock.mockResolvedValue(updatedProduct);

    const result = await useCase.execute(productId, newStock);

    expect(productRepository.updateStock).toHaveBeenCalledWith(
      productId,
      newStock,
    );
    expect(result).toBeInstanceOf(Product);
    expect(result?.stock).toBe(newStock);
  });

  it('should return null when product not found', async () => {
    const productId = 'nonexistent-product';
    const newStock = 50;

    productRepository.updateStock.mockResolvedValue(null);

    const result = await useCase.execute(productId, newStock);

    expect(productRepository.updateStock).toHaveBeenCalledWith(
      productId,
      newStock,
    );
    expect(result).toBeNull();
  });
});

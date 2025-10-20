import 'reflect-metadata';
import { CheckStockAvailabilityUseCase } from './check-stock-availability.use-case';
import { IProductRepository } from '../../repositories/product.repository.interface';
import { Product } from '../../entities/product.entity';

describe('CheckStockAvailabilityUseCase', () => {
  let useCase: CheckStockAvailabilityUseCase;
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

    useCase = new CheckStockAvailabilityUseCase(productRepository);
  });

  it('should return true when stock is sufficient', async () => {
    const productId = 'product-123';
    const quantity = 5;

    const product = new Product(
      {
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        stock: 10,
        sellerId: 'seller-123',
        category: 'Electronics',
        images: [],
        variations: [],
      },
      productId,
    );

    productRepository.findById.mockResolvedValue(product);

    const result = await useCase.execute(productId, quantity);

    expect(productRepository.findById).toHaveBeenCalledWith(productId);
    expect(result).toBe(true);
  });

  it('should return false when stock is insufficient', async () => {
    const productId = 'product-123';
    const quantity = 15;

    const product = new Product(
      {
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        stock: 10,
        sellerId: 'seller-123',
        category: 'Electronics',
        images: [],
        variations: [],
      },
      productId,
    );

    productRepository.findById.mockResolvedValue(product);

    const result = await useCase.execute(productId, quantity);

    expect(productRepository.findById).toHaveBeenCalledWith(productId);
    expect(result).toBe(false);
  });

  it('should return false when product not found', async () => {
    const productId = 'nonexistent-product';
    const quantity = 5;

    productRepository.findById.mockResolvedValue(null);

    const result = await useCase.execute(productId, quantity);

    expect(productRepository.findById).toHaveBeenCalledWith(productId);
    expect(result).toBe(false);
  });
});

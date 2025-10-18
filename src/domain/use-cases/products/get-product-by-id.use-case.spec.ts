import 'reflect-metadata';
import { GetProductByIdUseCase } from './get-product-by-id.use-case';
import { IProductRepository } from '../../repositories/product.repository.interface';
import { Product } from '../../entities/product.entity';

describe('GetProductByIdUseCase', () => {
  let useCase: GetProductByIdUseCase;
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

    useCase = new GetProductByIdUseCase(productRepository);
  });

  it('should return product when found', async () => {
    const productId = 'product-123';
    const mockProduct = new Product({
      name: 'Test Product',
      description: 'Test Description',
      price: 100,
      stock: 10,
      sellerId: 'seller-123',
      category: 'Electronics',
      images: ['image1.jpg'],
      variations: [],
    });

    productRepository.findById.mockResolvedValue(mockProduct);

    const result = await useCase.execute(productId);

    expect(productRepository.findById).toHaveBeenCalledWith(productId);
    expect(result).toBeInstanceOf(Product);
    expect(result.name).toBe('Test Product');
  });

  it('should return null when product not found', async () => {
    const productId = 'nonexistent-product';
    productRepository.findById.mockResolvedValue(null);

    const result = await useCase.execute(productId);

    expect(productRepository.findById).toHaveBeenCalledWith(productId);
    expect(result).toBeNull();
  });
});

import 'reflect-metadata';
import { CreateProductUseCase } from './create-product.use-case';
import { IProductRepository } from '../../repositories/product.repository.interface';
import { Product } from '../../entities/product.entity';

describe('CreateProductUseCase', () => {
  let useCase: CreateProductUseCase;
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

    useCase = new CreateProductUseCase(productRepository);
  });

  it('should create product successfully', async () => {
    const input = {
      name: 'Test Product',
      description: 'Test Description',
      price: 100,
      stock: 10,
      sellerId: 'seller-123',
      category: 'Electronics',
      images: ['image1.jpg'],
      variations: [],
    };

    const createdProduct = new Product(input, 'product-123');

    productRepository.create.mockResolvedValue(createdProduct);

    const result = await useCase.execute(input);

    expect(productRepository.create).toHaveBeenCalledWith(expect.any(Product));
    expect(result).toBeInstanceOf(Product);
    expect(result.name).toBe('Test Product');
    expect(result.price).toBe(100);
    expect(result.stock).toBe(10);
  });

  it('should create product with variations', async () => {
    const input = {
      name: 'Test Product',
      description: 'Test Description',
      price: 100,
      stock: 10,
      sellerId: 'seller-123',
      category: 'Electronics',
      images: ['image1.jpg'],
      variations: [{ size: 'M', color: 'red' }],
    };

    const createdProduct = new Product(input, 'product-123');

    productRepository.create.mockResolvedValue(createdProduct);

    const result = await useCase.execute(input);

    expect(productRepository.create).toHaveBeenCalledWith(expect.any(Product));
    expect(result.variations).toEqual([{ size: 'M', color: 'red' }]);
  });
});

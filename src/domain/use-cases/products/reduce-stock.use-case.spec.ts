import 'reflect-metadata';
import { ReduceStockUseCase } from './reduce-stock.use-case';
import { IProductRepository } from '../../repositories/product.repository.interface';
import { Product } from '../../entities/product.entity';

describe('ReduceStockUseCase', () => {
  let useCase: ReduceStockUseCase;
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

    useCase = new ReduceStockUseCase(productRepository);
  });

  it('should reduce stock successfully', async () => {
    const productId = 'product-123';
    const quantity = 5;
    const initialStock = 10;
    const expectedStock = initialStock - quantity;

    const product = new Product(
      {
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        stock: initialStock,
        sellerId: 'seller-123',
        category: 'Electronics',
        images: [],
        variations: [],
      },
      productId,
    );

    const updatedProduct = new Product(
      {
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        stock: expectedStock,
        sellerId: 'seller-123',
        category: 'Electronics',
        images: [],
        variations: [],
      },
      productId,
    );

    productRepository.findById.mockResolvedValue(product);
    productRepository.updateStock.mockResolvedValue(updatedProduct);

    const result = await useCase.execute(productId, quantity);

    expect(productRepository.findById).toHaveBeenCalledWith(productId);
    expect(productRepository.updateStock).toHaveBeenCalledWith(
      productId,
      expectedStock,
    );
    expect(result).toBeInstanceOf(Product);
    expect(result?.stock).toBe(expectedStock);
  });

  it('should return null when stock is insufficient', async () => {
    const productId = 'product-123';
    const quantity = 15;
    const initialStock = 10;

    const product = new Product(
      {
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        stock: initialStock,
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
    expect(productRepository.updateStock).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it('should return null when product not found', async () => {
    const productId = 'nonexistent-product';
    const quantity = 5;

    productRepository.findById.mockResolvedValue(null);

    const result = await useCase.execute(productId, quantity);

    expect(productRepository.findById).toHaveBeenCalledWith(productId);
    expect(productRepository.updateStock).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });
});

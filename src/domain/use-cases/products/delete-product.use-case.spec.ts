import 'reflect-metadata';
import { DeleteProductUseCase } from './delete-product.use-case';
import { IProductRepository } from '../../repositories/product.repository.interface';

describe('DeleteProductUseCase', () => {
  let useCase: DeleteProductUseCase;
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

    useCase = new DeleteProductUseCase(productRepository);
  });

  it('should delete product successfully', async () => {
    const productId = 'product-123';

    productRepository.delete.mockResolvedValue(true);

    const result = await useCase.execute(productId);

    expect(productRepository.delete).toHaveBeenCalledWith(productId);
    expect(result).toBe(true);
  });

  it('should return false when product not found', async () => {
    const productId = 'nonexistent-product';

    productRepository.delete.mockResolvedValue(false);

    const result = await useCase.execute(productId);

    expect(productRepository.delete).toHaveBeenCalledWith(productId);
    expect(result).toBe(false);
  });
});

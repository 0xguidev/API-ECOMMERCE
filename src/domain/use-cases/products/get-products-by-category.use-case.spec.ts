import 'reflect-metadata';
import { GetProductsByCategoryUseCase } from './get-products-by-category.use-case';
import { IProductRepository } from '../../repositories/product.repository.interface';
import { Product } from '../../entities/product.entity';

describe('GetProductsByCategoryUseCase', () => {
  let useCase: GetProductsByCategoryUseCase;
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

    useCase = new GetProductsByCategoryUseCase(productRepository);
  });

  it('should return products by category', async () => {
    const category = 'Electronics';
    const products = [
      new Product(
        {
          name: 'Laptop',
          description: 'Gaming laptop',
          price: 1500,
          stock: 5,
          sellerId: 'seller-1',
          category,
          images: ['laptop.jpg'],
          variations: [],
        },
        'product-1',
      ),
      new Product(
        {
          name: 'Mouse',
          description: 'Wireless mouse',
          price: 50,
          stock: 20,
          sellerId: 'seller-2',
          category,
          images: ['mouse.jpg'],
          variations: [],
        },
        'product-2',
      ),
    ];

    productRepository.findByCategory.mockResolvedValue(products);

    const result = await useCase.execute(category);

    expect(productRepository.findByCategory).toHaveBeenCalledWith(category);
    expect(result).toEqual(products);
    expect(result).toHaveLength(2);
  });

  it('should return empty array when category has no products', async () => {
    const category = 'NonExistentCategory';

    productRepository.findByCategory.mockResolvedValue([]);

    const result = await useCase.execute(category);

    expect(productRepository.findByCategory).toHaveBeenCalledWith(category);
    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });
});

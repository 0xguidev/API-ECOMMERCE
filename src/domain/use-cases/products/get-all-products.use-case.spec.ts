import 'reflect-metadata';
import { GetAllProductsUseCase } from './get-all-products.use-case';
import { IProductRepository } from '../../repositories/product.repository.interface';
import { Product } from '../../entities/product.entity';

describe('GetAllProductsUseCase', () => {
  let useCase: GetAllProductsUseCase;
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

    useCase = new GetAllProductsUseCase(productRepository);
  });

  it('should return all products', async () => {
    const products = [
      new Product(
        {
          name: 'Product 1',
          description: 'Description 1',
          price: 100,
          stock: 10,
          sellerId: 'seller-1',
          category: 'Electronics',
          images: ['image1.jpg'],
          variations: [],
        },
        'product-1',
      ),
      new Product(
        {
          name: 'Product 2',
          description: 'Description 2',
          price: 200,
          stock: 5,
          sellerId: 'seller-2',
          category: 'Books',
          images: ['image2.jpg'],
          variations: [],
        },
        'product-2',
      ),
    ];

    productRepository.findAll.mockResolvedValue(products);

    const result = await useCase.execute();

    expect(productRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual(products);
    expect(result).toHaveLength(2);
  });

  it('should return empty array when no products exist', async () => {
    productRepository.findAll.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(productRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });
});

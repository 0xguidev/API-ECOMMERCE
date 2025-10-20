import 'reflect-metadata';
import { GetProductsBySellerUseCase } from './get-products-by-seller.use-case';
import { IProductRepository } from '../../repositories/product.repository.interface';
import { Product } from '../../entities/product.entity';

describe('GetProductsBySellerUseCase', () => {
  let useCase: GetProductsBySellerUseCase;
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

    useCase = new GetProductsBySellerUseCase(productRepository);
  });

  it('should return products by seller id', async () => {
    const sellerId = 'seller-123';
    const products = [
      new Product(
        {
          name: 'Product 1',
          description: 'Description 1',
          price: 100,
          stock: 10,
          sellerId,
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
          sellerId,
          category: 'Books',
          images: ['image2.jpg'],
          variations: [],
        },
        'product-2',
      ),
    ];

    productRepository.findBySellerId.mockResolvedValue(products);

    const result = await useCase.execute(sellerId);

    expect(productRepository.findBySellerId).toHaveBeenCalledWith(sellerId);
    expect(result).toEqual(products);
    expect(result).toHaveLength(2);
  });

  it('should return empty array when seller has no products', async () => {
    const sellerId = 'seller-456';

    productRepository.findBySellerId.mockResolvedValue([]);

    const result = await useCase.execute(sellerId);

    expect(productRepository.findBySellerId).toHaveBeenCalledWith(sellerId);
    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });
});

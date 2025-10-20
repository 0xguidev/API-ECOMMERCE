import 'reflect-metadata';
import {
  UpdateProductUseCase,
  UpdateProductInput,
} from './update-product.use-case';
import { IProductRepository } from '../../repositories/product.repository.interface';
import { Product } from '../../entities/product.entity';

describe('UpdateProductUseCase', () => {
  let useCase: UpdateProductUseCase;
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

    useCase = new UpdateProductUseCase(productRepository);
  });

  it('should update product successfully', async () => {
    const productId = 'product-1';
    const updateInput: UpdateProductInput = {
      name: 'Updated Laptop',
      price: 1600,
      stock: 8,
    };

    const updatedProduct = new Product(
      {
        name: 'Updated Laptop',
        description: 'Gaming laptop',
        price: 1600,
        stock: 8,
        sellerId: 'seller-1',
        category: 'Electronics',
        images: ['laptop.jpg'],
        variations: [],
      },
      productId,
    );

    productRepository.update.mockResolvedValue(updatedProduct);

    const result = await useCase.execute(productId, updateInput);

    expect(productRepository.update).toHaveBeenCalledWith(
      productId,
      updateInput,
    );
    expect(result).toEqual(updatedProduct);
  });

  it('should return null when product not found', async () => {
    const productId = 'non-existent';
    const updateInput: UpdateProductInput = {
      name: 'Updated Name',
    };

    productRepository.update.mockResolvedValue(null);

    const result = await useCase.execute(productId, updateInput);

    expect(productRepository.update).toHaveBeenCalledWith(
      productId,
      updateInput,
    );
    expect(result).toBeNull();
  });

  it('should update partial fields', async () => {
    const productId = 'product-1';
    const updateInput: UpdateProductInput = {
      price: 1200,
    };

    const updatedProduct = new Product(
      {
        name: 'Laptop',
        description: 'Gaming laptop',
        price: 1200,
        stock: 5,
        sellerId: 'seller-1',
        category: 'Electronics',
        images: ['laptop.jpg'],
        variations: [],
      },
      productId,
    );

    productRepository.update.mockResolvedValue(updatedProduct);

    const result = await useCase.execute(productId, updateInput);

    expect(productRepository.update).toHaveBeenCalledWith(
      productId,
      updateInput,
    );
    expect(result).toEqual(updatedProduct);
  });
});

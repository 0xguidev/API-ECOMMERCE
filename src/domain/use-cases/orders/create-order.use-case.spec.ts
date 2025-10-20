import 'reflect-metadata';
import { CreateOrderUseCase } from './create-order.use-case';
import { IOrderRepository } from '../../repositories/order.repository.interface';
import { IProductRepository } from '../../repositories/product.repository.interface';
import { CheckStockAvailabilityUseCase } from '../products/check-stock-availability.use-case';
import { ReduceStockUseCase } from '../products/reduce-stock.use-case';
import { Order, OrderStatus } from '../../entities/order.entity';

describe('CreateOrderUseCase', () => {
  let useCase: CreateOrderUseCase;
  let orderRepository: jest.Mocked<IOrderRepository>;
  let productRepository: jest.Mocked<IProductRepository>;
  let checkStockAvailabilityUseCase: CheckStockAvailabilityUseCase;
  let reduceStockUseCase: ReduceStockUseCase;

  beforeEach(() => {
    orderRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByCustomerId: jest.fn(),
      findBySellerId: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      updateStatus: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<IOrderRepository>;

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

    checkStockAvailabilityUseCase = new CheckStockAvailabilityUseCase(
      productRepository,
    );
    reduceStockUseCase = new ReduceStockUseCase(productRepository);

    useCase = new CreateOrderUseCase(
      orderRepository,
      checkStockAvailabilityUseCase,
      reduceStockUseCase,
    );
  });

  it('should create order successfully', async () => {
    const input = {
      customerId: 'customer-123',
      sellerId: 'seller-123',
      items: [
        {
          productId: 'product-1',
          quantity: 2,
          price: 50,
        },
        {
          productId: 'product-2',
          quantity: 1,
          price: 100,
        },
      ],
      shippingAddress: { street: '123 Main St', city: 'Anytown' },
      paymentIntentId: 'pi_123',
    };

    const mockOrder = new Order({
      customerId: input.customerId,
      sellerId: input.sellerId,
      totalAmount: 200, // 2*50 + 1*100
      status: OrderStatus.PENDING,
      shippingAddress: input.shippingAddress,
      paymentIntentId: input.paymentIntentId,
    });

    productRepository.findById.mockResolvedValue({
      id: 'product-1',
      name: 'Product 1',
      description: 'Description',
      price: 50,
      stock: 10,
      sellerId: 'seller-123',
      category: 'Test',
      images: [],
      variations: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    productRepository.findById.mockResolvedValueOnce({
      id: 'product-2',
      name: 'Product 2',
      description: 'Description',
      price: 100,
      stock: 5,
      sellerId: 'seller-123',
      category: 'Test',
      images: [],
      variations: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    orderRepository.create.mockResolvedValue(mockOrder);

    const result = await useCase.execute(input);

    expect(productRepository.findById).toHaveBeenCalledTimes(4);
    expect(orderRepository.create).toHaveBeenCalledWith(expect.any(Order));
    expect(productRepository.updateStock).toHaveBeenCalledTimes(2);
    expect(result).toBeInstanceOf(Order);
    expect(result.totalAmount).toBe(200);
  });

  it('should throw error when stock is not available', async () => {
    const input = {
      customerId: 'customer-123',
      sellerId: 'seller-123',
      items: [
        {
          productId: 'product-1',
          quantity: 2,
          price: 50,
        },
      ],
      shippingAddress: { street: '123 Main St', city: 'Anytown' },
    };

    productRepository.findById.mockResolvedValue({
      id: 'product-1',
      name: 'Product 1',
      description: 'Description',
      price: 50,
      stock: 1, // Less than required
      sellerId: 'seller-123',
      category: 'Test',
      images: [],
      variations: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    await expect(useCase.execute(input)).rejects.toThrow(
      'Insufficient stock for product product-1',
    );

    expect(productRepository.findById).toHaveBeenCalledWith('product-1');
    expect(orderRepository.create).not.toHaveBeenCalled();
    expect(productRepository.updateStock).not.toHaveBeenCalled();
  });

  it('should create order without payment intent', async () => {
    const input = {
      customerId: 'customer-123',
      sellerId: 'seller-123',
      items: [
        {
          productId: 'product-1',
          quantity: 1,
          price: 75,
        },
      ],
      shippingAddress: { street: '123 Main St', city: 'Anytown' },
    };

    const mockOrder = new Order({
      customerId: input.customerId,
      sellerId: input.sellerId,
      totalAmount: 75,
      status: OrderStatus.PENDING,
      shippingAddress: input.shippingAddress,
    });

    productRepository.findById.mockResolvedValue({
      id: 'product-1',
      name: 'Product 1',
      description: 'Description',
      price: 75,
      stock: 10,
      sellerId: 'seller-123',
      category: 'Test',
      images: [],
      variations: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    orderRepository.create.mockResolvedValue(mockOrder);

    const result = await useCase.execute(input);

    expect(result.totalAmount).toBe(75);
    expect(result.paymentIntentId).toBeUndefined();
  });
});

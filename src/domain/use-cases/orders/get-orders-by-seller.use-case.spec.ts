import 'reflect-metadata';
import { GetOrdersBySellerUseCase } from './get-orders-by-seller.use-case';
import { IOrderRepository } from '../../repositories/order.repository.interface';
import { Order, OrderStatus } from '../../entities/order.entity';

describe('GetOrdersBySellerUseCase', () => {
  let useCase: GetOrdersBySellerUseCase;
  let orderRepository: jest.Mocked<IOrderRepository>;

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

    useCase = new GetOrdersBySellerUseCase(orderRepository);
  });

  it('should return orders for seller', async () => {
    const sellerId = 'seller-123';
    const mockOrders = [
      new Order(
        {
          customerId: 'customer-123',
          sellerId,
          totalAmount: 100,
          status: OrderStatus.PENDING,
          shippingAddress: { street: '123 Main St', city: 'Anytown' },
        },
        'order-1',
      ),
      new Order(
        {
          customerId: 'customer-456',
          sellerId,
          totalAmount: 200,
          status: OrderStatus.PAID,
          shippingAddress: { street: '456 Oak St', city: 'Othertown' },
        },
        'order-2',
      ),
    ];

    orderRepository.findBySellerId.mockResolvedValue(mockOrders);

    const result = await useCase.execute(sellerId);

    expect(orderRepository.findBySellerId).toHaveBeenCalledWith(sellerId);
    expect(result).toHaveLength(2);
    expect(result[0]).toBeInstanceOf(Order);
    expect(result[0].sellerId).toBe(sellerId);
    expect(result[1].sellerId).toBe(sellerId);
  });

  it('should return empty array when seller has no orders', async () => {
    const sellerId = 'seller-without-orders';

    orderRepository.findBySellerId.mockResolvedValue([]);

    const result = await useCase.execute(sellerId);

    expect(orderRepository.findBySellerId).toHaveBeenCalledWith(sellerId);
    expect(result).toEqual([]);
  });
});

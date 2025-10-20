import 'reflect-metadata';
import { GetOrdersByCustomerUseCase } from './get-orders-by-customer.use-case';
import { IOrderRepository } from '../../repositories/order.repository.interface';
import { Order, OrderStatus } from '../../entities/order.entity';

describe('GetOrdersByCustomerUseCase', () => {
  let useCase: GetOrdersByCustomerUseCase;
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

    useCase = new GetOrdersByCustomerUseCase(orderRepository);
  });

  it('should return orders for customer', async () => {
    const customerId = 'customer-123';
    const mockOrders = [
      new Order(
        {
          customerId,
          sellerId: 'seller-123',
          totalAmount: 100,
          status: OrderStatus.PENDING,
          shippingAddress: { street: '123 Main St', city: 'Anytown' },
        },
        'order-1',
      ),
      new Order(
        {
          customerId,
          sellerId: 'seller-456',
          totalAmount: 200,
          status: OrderStatus.PAID,
          shippingAddress: { street: '456 Oak St', city: 'Othertown' },
        },
        'order-2',
      ),
    ];

    orderRepository.findByCustomerId.mockResolvedValue(mockOrders);

    const result = await useCase.execute(customerId);

    expect(orderRepository.findByCustomerId).toHaveBeenCalledWith(customerId);
    expect(result).toHaveLength(2);
    expect(result[0]).toBeInstanceOf(Order);
    expect(result[0].customerId).toBe(customerId);
    expect(result[1].customerId).toBe(customerId);
  });

  it('should return empty array when customer has no orders', async () => {
    const customerId = 'customer-without-orders';

    orderRepository.findByCustomerId.mockResolvedValue([]);

    const result = await useCase.execute(customerId);

    expect(orderRepository.findByCustomerId).toHaveBeenCalledWith(customerId);
    expect(result).toEqual([]);
  });
});

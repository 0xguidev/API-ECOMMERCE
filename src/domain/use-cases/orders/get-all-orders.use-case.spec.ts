import 'reflect-metadata';
import { GetAllOrdersUseCase } from './get-all-orders.use-case';
import { IOrderRepository } from '../../repositories/order.repository.interface';
import { Order, OrderStatus } from '../../entities/order.entity';

describe('GetAllOrdersUseCase', () => {
  let useCase: GetAllOrdersUseCase;
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

    useCase = new GetAllOrdersUseCase(orderRepository);
  });

  it('should return all orders', async () => {
    const mockOrders = [
      new Order(
        {
          customerId: 'customer-123',
          sellerId: 'seller-123',
          totalAmount: 100,
          status: OrderStatus.PENDING,
          shippingAddress: { street: '123 Main St', city: 'Anytown' },
        },
        'order-1',
      ),
      new Order(
        {
          customerId: 'customer-456',
          sellerId: 'seller-456',
          totalAmount: 200,
          status: OrderStatus.PAID,
          shippingAddress: { street: '456 Oak St', city: 'Othertown' },
        },
        'order-2',
      ),
      new Order(
        {
          customerId: 'customer-789',
          sellerId: 'seller-123',
          totalAmount: 150,
          status: OrderStatus.SHIPPED,
          shippingAddress: { street: '789 Pine St', city: 'Thirddtown' },
        },
        'order-3',
      ),
    ];

    orderRepository.findAll.mockResolvedValue(mockOrders);

    const result = await useCase.execute();

    expect(orderRepository.findAll).toHaveBeenCalled();
    expect(result).toHaveLength(3);
    expect(result[0]).toBeInstanceOf(Order);
    expect(result[1]).toBeInstanceOf(Order);
    expect(result[2]).toBeInstanceOf(Order);
  });

  it('should return empty array when no orders exist', async () => {
    orderRepository.findAll.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(orderRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});

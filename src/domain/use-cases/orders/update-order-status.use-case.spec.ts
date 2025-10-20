import 'reflect-metadata';
import { UpdateOrderStatusUseCase } from './update-order-status.use-case';
import { IOrderRepository } from '../../repositories/order.repository.interface';
import { Order, OrderStatus } from '../../entities/order.entity';

describe('UpdateOrderStatusUseCase', () => {
  let useCase: UpdateOrderStatusUseCase;
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

    useCase = new UpdateOrderStatusUseCase(orderRepository);
  });

  it('should update order status successfully', async () => {
    const orderId = 'order-123';
    const newStatus = OrderStatus.SHIPPED;

    const updatedOrder = new Order(
      {
        customerId: 'customer-123',
        sellerId: 'seller-123',
        totalAmount: 100,
        status: newStatus,
        shippingAddress: { street: '123 Main St', city: 'Anytown' },
      },
      orderId,
    );

    orderRepository.updateStatus.mockResolvedValue(updatedOrder);

    const result = await useCase.execute(orderId, newStatus);

    expect(orderRepository.updateStatus).toHaveBeenCalledWith(
      orderId,
      newStatus,
    );
    expect(result).toBeInstanceOf(Order);
    expect(result?.status).toBe(newStatus);
  });

  it('should update status to different values', async () => {
    const testCases = [
      { orderId: 'order-1', status: OrderStatus.PAID },
      { orderId: 'order-2', status: OrderStatus.DELIVERED },
      { orderId: 'order-3', status: OrderStatus.CANCELLED },
    ];

    for (const { orderId, status } of testCases) {
      const updatedOrder = new Order(
        {
          customerId: 'customer-123',
          sellerId: 'seller-123',
          totalAmount: 100,
          status,
          shippingAddress: { street: '123 Main St', city: 'Anytown' },
        },
        orderId,
      );

      orderRepository.updateStatus.mockResolvedValue(updatedOrder);

      const result = await useCase.execute(orderId, status);

      expect(orderRepository.updateStatus).toHaveBeenCalledWith(
        orderId,
        status,
      );
      expect(result?.status).toBe(status);
    }
  });

  it('should return null when order not found', async () => {
    const orderId = 'non-existent-order';
    const newStatus = OrderStatus.CANCELLED;

    orderRepository.updateStatus.mockResolvedValue(null);

    const result = await useCase.execute(orderId, newStatus);

    expect(orderRepository.updateStatus).toHaveBeenCalledWith(
      orderId,
      newStatus,
    );
    expect(result).toBeNull();
  });
});

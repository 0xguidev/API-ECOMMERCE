import 'reflect-metadata';
import { GetOrderByIdUseCase } from './get-order-by-id.use-case';
import { IOrderRepository } from '../../repositories/order.repository.interface';
import { Order, OrderStatus } from '../../entities/order.entity';

describe('GetOrderByIdUseCase', () => {
  let useCase: GetOrderByIdUseCase;
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

    useCase = new GetOrderByIdUseCase(orderRepository);
  });

  it('should return order when found', async () => {
    const orderId = 'order-123';
    const mockOrder = new Order(
      {
        customerId: 'customer-123',
        sellerId: 'seller-123',
        totalAmount: 100,
        status: OrderStatus.PENDING,
        shippingAddress: { street: '123 Main St', city: 'Anytown' },
      },
      orderId,
    );

    orderRepository.findById.mockResolvedValue(mockOrder);

    const result = await useCase.execute(orderId);

    expect(orderRepository.findById).toHaveBeenCalledWith(orderId);
    expect(result).toBeInstanceOf(Order);
    expect(result?.id).toBe(orderId);
    expect(result?.totalAmount).toBe(100);
  });

  it('should return null when order not found', async () => {
    const orderId = 'non-existent-order';

    orderRepository.findById.mockResolvedValue(null);

    const result = await useCase.execute(orderId);

    expect(orderRepository.findById).toHaveBeenCalledWith(orderId);
    expect(result).toBeNull();
  });
});

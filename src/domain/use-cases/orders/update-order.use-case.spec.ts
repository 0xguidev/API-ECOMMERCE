import 'reflect-metadata';
import { UpdateOrderUseCase } from './update-order.use-case';
import { IOrderRepository } from '../../repositories/order.repository.interface';
import { Order, OrderStatus } from '../../entities/order.entity';

describe('UpdateOrderUseCase', () => {
  let useCase: UpdateOrderUseCase;
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

    useCase = new UpdateOrderUseCase(orderRepository);
  });

  it('should update order successfully', async () => {
    const orderId = 'order-123';
    const updateInput = {
      status: OrderStatus.SHIPPED,
      shippingAddress: { street: 'Updated St', city: 'Updated City' },
    };

    const updatedOrder = new Order(
      {
        customerId: 'customer-123',
        sellerId: 'seller-123',
        totalAmount: 100,
        status: OrderStatus.SHIPPED,
        shippingAddress: updateInput.shippingAddress,
      },
      orderId,
    );

    orderRepository.update.mockResolvedValue(updatedOrder);

    const result = await useCase.execute(orderId, updateInput);

    expect(orderRepository.update).toHaveBeenCalledWith(orderId, updateInput);
    expect(result).toBeInstanceOf(Order);
    expect(result?.status).toBe(OrderStatus.SHIPPED);
    expect(result?.shippingAddress).toEqual(updateInput.shippingAddress);
  });

  it('should update order with partial data', async () => {
    const orderId = 'order-123';
    const updateInput = {
      paymentIntentId: 'pi_updated',
    };

    const updatedOrder = new Order(
      {
        customerId: 'customer-123',
        sellerId: 'seller-123',
        totalAmount: 100,
        status: OrderStatus.PENDING,
        shippingAddress: { street: '123 Main St', city: 'Anytown' },
        paymentIntentId: 'pi_updated',
      },
      orderId,
    );

    orderRepository.update.mockResolvedValue(updatedOrder);

    const result = await useCase.execute(orderId, updateInput);

    expect(orderRepository.update).toHaveBeenCalledWith(orderId, updateInput);
    expect(result?.paymentIntentId).toBe('pi_updated');
  });

  it('should return null when order not found', async () => {
    const orderId = 'non-existent-order';
    const updateInput = {
      status: OrderStatus.CANCELLED,
    };

    orderRepository.update.mockResolvedValue(null);

    const result = await useCase.execute(orderId, updateInput);

    expect(orderRepository.update).toHaveBeenCalledWith(orderId, updateInput);
    expect(result).toBeNull();
  });
});

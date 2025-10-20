import 'reflect-metadata';
import { DeleteOrderUseCase } from './delete-order.use-case';
import { IOrderRepository } from '../../repositories/order.repository.interface';

describe('DeleteOrderUseCase', () => {
  let useCase: DeleteOrderUseCase;
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

    useCase = new DeleteOrderUseCase(orderRepository);
  });

  it('should delete order successfully', async () => {
    const orderId = 'order-123';

    orderRepository.delete.mockResolvedValue(true);

    const result = await useCase.execute(orderId);

    expect(orderRepository.delete).toHaveBeenCalledWith(orderId);
    expect(result).toBe(true);
  });

  it('should return false when order not found', async () => {
    const orderId = 'non-existent-order';

    orderRepository.delete.mockResolvedValue(false);

    const result = await useCase.execute(orderId);

    expect(orderRepository.delete).toHaveBeenCalledWith(orderId);
    expect(result).toBe(false);
  });
});

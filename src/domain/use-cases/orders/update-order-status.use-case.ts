import { inject, injectable } from 'tsyringe';
import { Order, OrderStatus } from '../../entities/order.entity';
import { IOrderRepository } from '../../repositories/order.repository.interface';

@injectable()
export class UpdateOrderStatusUseCase {
  constructor(
    @inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(id: string, status: OrderStatus): Promise<Order | null> {
    return this.orderRepository.updateStatus(id, status);
  }
}

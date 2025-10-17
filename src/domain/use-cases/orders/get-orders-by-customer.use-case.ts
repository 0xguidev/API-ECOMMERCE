import { inject, injectable } from 'tsyringe';
import { Order } from '../../entities/order.entity';
import { IOrderRepository } from '../../repositories/order.repository.interface';

@injectable()
export class GetOrdersByCustomerUseCase {
  constructor(
    @inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(customerId: string): Promise<Order[]> {
    return this.orderRepository.findByCustomerId(customerId);
  }
}

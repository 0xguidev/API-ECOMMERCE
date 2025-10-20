import { inject, injectable } from 'tsyringe';
import { Order } from '../../entities/order.entity';
import { IOrderRepository } from '../../repositories/order.repository.interface';

@injectable()
export class GetAllOrdersUseCase {
  constructor(
    @inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(): Promise<Order[]> {
    return this.orderRepository.findAll();
  }
}

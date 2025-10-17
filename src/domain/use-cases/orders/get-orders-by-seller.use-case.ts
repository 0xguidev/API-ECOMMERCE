import { inject, injectable } from 'tsyringe';
import { Order } from '../../entities/order.entity';
import { IOrderRepository } from '../../repositories/order.repository.interface';

@injectable()
export class GetOrdersBySellerUseCase {
  constructor(
    @inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(sellerId: string): Promise<Order[]> {
    return this.orderRepository.findBySellerId(sellerId);
  }
}

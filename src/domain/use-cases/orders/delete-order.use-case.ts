import { inject, injectable } from 'tsyringe';
import { IOrderRepository } from '../../repositories/order.repository.interface';

@injectable()
export class DeleteOrderUseCase {
  constructor(
    @inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(id: string): Promise<boolean> {
    return this.orderRepository.delete(id);
  }
}

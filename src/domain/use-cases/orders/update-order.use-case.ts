import { inject, injectable } from 'tsyringe';
import { Order, OrderStatus } from '../../entities/order.entity';
import { IOrderRepository } from '../../repositories/order.repository.interface';

export interface UpdateOrderInput {
  status?: OrderStatus;
  shippingAddress?: any;
  paymentIntentId?: string;
}

@injectable()
export class UpdateOrderUseCase {
  constructor(
    @inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(id: string, input: UpdateOrderInput): Promise<Order | null> {
    return this.orderRepository.update(id, input);
  }
}

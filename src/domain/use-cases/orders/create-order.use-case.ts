import { inject, injectable } from 'tsyringe';
import { Order, OrderStatus } from '../../entities/order.entity';
import { IOrderRepository } from '../../repositories/order.repository.interface';
import { CheckStockAvailabilityUseCase } from '../products/check-stock-availability.use-case';
import { ReduceStockUseCase } from '../products/reduce-stock.use-case';

export interface CreateOrderInput {
  customerId: string;
  sellerId: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  shippingAddress: any;
  paymentIntentId?: string;
}

@injectable()
export class CreateOrderUseCase {
  constructor(
    @inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository,
    private readonly checkStockAvailabilityUseCase: CheckStockAvailabilityUseCase,
    private readonly reduceStockUseCase: ReduceStockUseCase,
  ) {}

  async execute(input: CreateOrderInput): Promise<Order> {
    // Calculate total amount
    const totalAmount = input.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    // Check stock availability for all items
    for (const item of input.items) {
      const isAvailable = await this.checkStockAvailabilityUseCase.execute(
        item.productId,
        item.quantity,
      );
      if (!isAvailable) {
        throw new Error(`Insufficient stock for product ${item.productId}`);
      }
    }

    // Create order
    const order = new Order({
      customerId: input.customerId,
      sellerId: input.sellerId,
      totalAmount,
      status: OrderStatus.PENDING,
      shippingAddress: input.shippingAddress,
      paymentIntentId: input.paymentIntentId,
    });

    const createdOrder = await this.orderRepository.create(order);

    // Reduce stock for all items
    for (const item of input.items) {
      await this.reduceStockUseCase.execute(item.productId, item.quantity);
    }

    return createdOrder;
  }
}

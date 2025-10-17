import { injectable } from 'tsyringe';
import { Order } from '../../domain/entities/order.entity';
import { CreateOrderUseCase } from '../../domain/use-cases/orders/create-order.use-case';
import { GetOrderByIdUseCase } from '../../domain/use-cases/orders/get-order-by-id.use-case';
import { GetOrdersByCustomerUseCase } from '../../domain/use-cases/orders/get-orders-by-customer.use-case';
import { GetOrdersBySellerUseCase } from '../../domain/use-cases/orders/get-orders-by-seller.use-case';
import { GetAllOrdersUseCase } from '../../domain/use-cases/orders/get-all-orders.use-case';
import { UpdateOrderUseCase } from '../../domain/use-cases/orders/update-order.use-case';
import { UpdateOrderStatusUseCase } from '../../domain/use-cases/orders/update-order-status.use-case';
import { DeleteOrderUseCase } from '../../domain/use-cases/orders/delete-order.use-case';
import { OrderStatus } from '../../domain/entities/order.entity';

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

export interface UpdateOrderInput {
  status?: OrderStatus;
  shippingAddress?: any;
  paymentIntentId?: string;
}

@injectable()
export class OrderService {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly getOrderByIdUseCase: GetOrderByIdUseCase,
    private readonly getOrdersByCustomerUseCase: GetOrdersByCustomerUseCase,
    private readonly getOrdersBySellerUseCase: GetOrdersBySellerUseCase,
    private readonly getAllOrdersUseCase: GetAllOrdersUseCase,
    private readonly updateOrderUseCase: UpdateOrderUseCase,
    private readonly updateOrderStatusUseCase: UpdateOrderStatusUseCase,
    private readonly deleteOrderUseCase: DeleteOrderUseCase,
  ) {}

  async createOrder(input: CreateOrderInput): Promise<Order> {
    return this.createOrderUseCase.execute(input);
  }

  async getOrderById(id: string): Promise<Order | null> {
    return this.getOrderByIdUseCase.execute(id);
  }

  async getOrdersByCustomer(customerId: string): Promise<Order[]> {
    return this.getOrdersByCustomerUseCase.execute(customerId);
  }

  async getOrdersBySeller(sellerId: string): Promise<Order[]> {
    return this.getOrdersBySellerUseCase.execute(sellerId);
  }

  async getAllOrders(): Promise<Order[]> {
    return this.getAllOrdersUseCase.execute();
  }

  async updateOrder(
    id: string,
    input: UpdateOrderInput,
  ): Promise<Order | null> {
    return this.updateOrderUseCase.execute(id, input);
  }

  async updateOrderStatus(
    id: string,
    status: OrderStatus,
  ): Promise<Order | null> {
    return this.updateOrderStatusUseCase.execute(id, status);
  }

  async deleteOrder(id: string): Promise<boolean> {
    return this.deleteOrderUseCase.execute(id);
  }
}

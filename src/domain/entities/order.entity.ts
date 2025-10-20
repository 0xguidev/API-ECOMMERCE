import { v4 as uuidv4 } from 'uuid';

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export class Order {
  public readonly id: string;
  public readonly customerId: string;
  public readonly sellerId: string;
  public status: OrderStatus;
  public totalAmount: number;
  public shippingAddress: any; // JSON
  public paymentIntentId?: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(
    props: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>,
    id?: string,
  ) {
    Object.assign(this, props);

    if (!id) {
      this.id = uuidv4();
    } else {
      this.id = id;
    }

    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

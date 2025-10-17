import { v4 as uuidv4 } from 'uuid';

export class OrderItem {
  public readonly id: string;
  public readonly orderId: string;
  public readonly productId: string;
  public quantity: number;
  public price: number; // Preço no momento da compra
  public createdAt: Date;

  constructor(props: Omit<OrderItem, 'id' | 'createdAt'>, id?: string) {
    Object.assign(this, props);

    if (!id) {
      this.id = uuidv4();
    } else {
      this.id = id;
    }

    this.createdAt = new Date();
  }
}

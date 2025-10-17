import { v4 as uuidv4 } from 'uuid';

export class Product {
  public readonly id: string;
  public name: string;
  public description?: string;
  public price: number;
  public stock: number;
  public readonly sellerId: string;
  public category?: string;
  public images: string[];
  public variations?: any; // JSON para variações
  public createdAt: Date;
  public updatedAt: Date;

  constructor(
    props: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>,
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

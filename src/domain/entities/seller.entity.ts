import { v4 as uuidv4 } from 'uuid';

export class Seller {
  public readonly id: string;
  public readonly userId: string;
  public storeName: string;
  public description?: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(
    props: Omit<Seller, 'id' | 'createdAt' | 'updatedAt'>,
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

import { v4 as uuidv4 } from 'uuid';

export class User {
  public readonly id: string;
  public name: string;
  public email: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(
    props: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
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

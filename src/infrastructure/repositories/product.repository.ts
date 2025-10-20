import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../../../generated/prisma';
import { Product } from '../../domain/entities/product.entity';
import { IProductRepository } from '../../domain/repositories/product.repository.interface';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(product: Product): Promise<Product> {
    const createdProduct = await this.prisma.product.create({
      data: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        sellerId: product.sellerId,
        category: product.category,
        images: product.images,
        variations: product.variations,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      },
    });
    return new Product(createdProduct, createdProduct.id);
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    return product ? new Product(product, product.id) : null;
  }

  async findBySellerId(sellerId: string): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: { sellerId },
    });
    return products.map((product) => new Product(product, product.id));
  }

  async findAll(): Promise<Product[]> {
    const products = await this.prisma.product.findMany();
    return products.map((product) => new Product(product, product.id));
  }

  async findByCategory(category: string): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: { category },
    });
    return products.map((product) => new Product(product, product.id));
  }

  async update(
    id: string,
    productData: Partial<Product>,
  ): Promise<Product | null> {
    try {
      const updatedProduct = await this.prisma.product.update({
        where: { id },
        data: {
          ...productData,
          updatedAt: new Date(),
        },
      });
      return new Product(updatedProduct, updatedProduct.id);
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.product.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }

  async updateStock(id: string, stock: number): Promise<Product | null> {
    try {
      const updatedProduct = await this.prisma.product.update({
        where: { id },
        data: {
          stock,
          updatedAt: new Date(),
        },
      });
      return new Product(updatedProduct, updatedProduct.id);
    } catch {
      return null;
    }
  }
}

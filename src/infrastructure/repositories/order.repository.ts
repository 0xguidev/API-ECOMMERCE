import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../../../generated/prisma';
import { Order } from '../../domain/entities/order.entity';
import { IOrderRepository } from '../../domain/repositories/order.repository.interface';

@Injectable()
export class OrderRepository implements IOrderRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(order: Order): Promise<Order> {
    const createdOrder = await this.prisma.order.create({
      data: {
        id: order.id,
        customerId: order.customerId,
        sellerId: order.sellerId,
        totalAmount: order.totalAmount,
        status: order.status as any,
        shippingAddress: order.shippingAddress,
        paymentIntentId: order.paymentIntentId,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      },
      include: {
        items: true,
      },
    });

    return new Order(
      {
        customerId: createdOrder.customerId,
        sellerId: createdOrder.sellerId,
        totalAmount: createdOrder.totalAmount,
        status: createdOrder.status as any,
        shippingAddress: createdOrder.shippingAddress,
        paymentIntentId: createdOrder.paymentIntentId,
      },
      createdOrder.id,
    );
  }

  async findById(id: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    if (!order) return null;

    return new Order(
      {
        customerId: order.customerId,
        sellerId: order.sellerId,
        totalAmount: order.totalAmount,
        status: order.status as any,
        shippingAddress: order.shippingAddress,
        paymentIntentId: order.paymentIntentId,
      },
      order.id,
    );
  }

  async findByCustomerId(customerId: string): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      where: { customerId },
      include: {
        items: true,
      },
    });

    return orders.map(
      (order) =>
        new Order(
          {
            customerId: order.customerId,
            sellerId: order.sellerId,
            totalAmount: order.totalAmount,
            status: order.status as any,
            shippingAddress: order.shippingAddress,
            paymentIntentId: order.paymentIntentId,
          },
          order.id,
        ),
    );
  }

  async findBySellerId(sellerId: string): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      where: { sellerId },
      include: {
        items: true,
      },
    });

    return orders.map(
      (order) =>
        new Order(
          {
            customerId: order.customerId,
            sellerId: order.sellerId,
            totalAmount: order.totalAmount,
            status: order.status as any,
            shippingAddress: order.shippingAddress,
            paymentIntentId: order.paymentIntentId,
          },
          order.id,
        ),
    );
  }

  async findAll(): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      include: {
        items: true,
      },
    });

    return orders.map(
      (order) =>
        new Order(
          {
            customerId: order.customerId,
            sellerId: order.sellerId,
            totalAmount: order.totalAmount,
            status: order.status as any,
            shippingAddress: order.shippingAddress,
            paymentIntentId: order.paymentIntentId,
          },
          order.id,
        ),
    );
  }

  async update(id: string, orderData: Partial<Order>): Promise<Order | null> {
    try {
      const updatedOrder = await this.prisma.order.update({
        where: { id },
        data: {
          ...orderData,
          updatedAt: new Date(),
        },
        include: {
          items: true,
        },
      });

      return new Order(
        {
          customerId: updatedOrder.customerId,
          sellerId: updatedOrder.sellerId,
          totalAmount: updatedOrder.totalAmount,
          status: updatedOrder.status as any,
          shippingAddress: updatedOrder.shippingAddress,
          paymentIntentId: updatedOrder.paymentIntentId,
        },
        updatedOrder.id,
      );
    } catch {
      return null;
    }
  }

  async updateStatus(id: string, status: string): Promise<Order | null> {
    try {
      const updatedOrder = await this.prisma.order.update({
        where: { id },
        data: {
          status: status as any,
          updatedAt: new Date(),
        },
        include: {
          items: true,
        },
      });

      return new Order(
        {
          customerId: updatedOrder.customerId,
          sellerId: updatedOrder.sellerId,
          totalAmount: updatedOrder.totalAmount,
          status: updatedOrder.status as any,
          shippingAddress: updatedOrder.shippingAddress,
          paymentIntentId: updatedOrder.paymentIntentId,
        },
        updatedOrder.id,
      );
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.order.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }
}

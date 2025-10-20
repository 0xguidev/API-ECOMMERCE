import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaClient } from '../generated/prisma';

describe('Customer (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaClient;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = new PrismaClient();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  beforeEach(async () => {
    await prisma.order.deleteMany();
    await prisma.user.deleteMany();
  });

  it('/customers (POST) - should create a customer', () => {
    return request(app.getHttpServer())
      .post('/customers')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body.name).toBe('John Doe');
        expect(res.body.email).toBe('john@example.com');
        expect(res.body.role).toBe('CUSTOMER');
      });
  });

  it('/customers (GET) - should get all customers', async () => {
    await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed',
        role: 'CUSTOMER',
      },
    });

    return request(app.getHttpServer())
      .get('/customers')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(1);
        expect(res.body[0].role).toBe('CUSTOMER');
      });
  });

  it('/customers/:id (GET) - should get customer by id', async () => {
    const customer = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed',
        role: 'CUSTOMER',
      },
    });

    return request(app.getHttpServer())
      .get(`/customers/${customer.id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toBe(customer.id);
        expect(res.body.role).toBe('CUSTOMER');
      });
  });

  it('/customers/:id/orders (GET) - should get customer orders', async () => {
    const customer = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed',
        role: 'CUSTOMER',
      },
    });

    return request(app.getHttpServer())
      .get(`/customers/${customer.id}/orders`)
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });
});

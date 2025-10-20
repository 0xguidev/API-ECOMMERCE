import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CustomerService } from '../../application/services/customer.service';
import {
  CreateCustomerDto,
  createCustomerSchema,
  UpdateCustomerDto,
  updateCustomerSchema,
} from '../../application/dto/create-customer.dto';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  async create(@Body() body: CreateCustomerDto) {
    const dto = createCustomerSchema.parse(body);
    return this.customerService.createCustomer(dto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.customerService.getCustomerById(id);
  }

  @Get()
  async findAll() {
    return this.customerService.getAllCustomers();
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdateCustomerDto) {
    const dto = updateCustomerSchema.parse(body);
    return this.customerService.updateCustomer(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.customerService.deleteCustomer(id);
  }

  @Get(':id/orders')
  async getOrders(@Param('id') id: string) {
    return this.customerService.getCustomerOrders(id);
  }
}

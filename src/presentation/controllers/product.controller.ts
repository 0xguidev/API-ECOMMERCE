import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from '../../application/services/product.service';
import {
  CreateProductDto,
  createProductSchema,
  UpdateProductDto,
  updateProductSchema,
} from '../../application/dto/create-product.dto';
import { JwtAuthGuard } from '../middleware/jwt-auth.guard';
import { RolesGuard } from '../middleware/roles.guard';

@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(@Body() body: CreateProductDto) {
    const dto = createProductSchema.parse(body);
    return this.productService.createProduct(dto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productService.getProductById(id);
  }

  @Get()
  async findAll(@Query('category') category?: string) {
    if (category) {
      return this.productService.getProductsByCategory(category);
    }
    return this.productService.getAllProducts();
  }

  @Get('seller/:sellerId')
  async findBySeller(@Param('sellerId') sellerId: string) {
    return this.productService.getProductsBySeller(sellerId);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdateProductDto) {
    const dto = updateProductSchema.parse(body);
    return this.productService.updateProduct(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.productService.deleteProduct(id);
  }

  @Put(':id/stock')
  async updateStock(@Param('id') id: string, @Body() body: { stock: number }) {
    return this.productService.updateStock(id, body.stock);
  }
}

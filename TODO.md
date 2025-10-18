# TODO: Criar Testes para Todos os Use Cases do Projeto

## Testes Unitários para Use Cases

### Users
- [x] create-user.use-case.spec.ts
- [x] authenticate-user.use-case.spec.ts
- [x] get-user-by-id.use-case.spec.ts
- [x] get-all-users.use-case.spec.ts
- [x] update-user.use-case.spec.ts
- [x] delete-user.use-case.spec.ts

### Products
- [ ] create-product.use-case.spec.ts
- [x] get-product-by-id.use-case.spec.ts
- [ ] get-products-by-seller.use-case.spec.ts
- [ ] get-all-products.use-case.spec.ts
- [ ] get-products-by-category.use-case.spec.ts
- [ ] update-product.use-case.spec.ts
- [ ] delete-product.use-case.spec.ts
- [ ] update-stock.use-case.spec.ts
- [ ] check-stock-availability.use-case.spec.ts
- [ ] reduce-stock.use-case.spec.ts

### Auth
- [ ] register.use-case.spec.ts
- [ ] login.use-case.spec.ts
- [ ] verify-two-factor.use-case.spec.ts
- [ ] setup-two-factor.use-case.spec.ts
- [ ] enable-two-factor.use-case.spec.ts
- [ ] disable-two-factor.use-case.spec.ts
- [ ] refresh-token.use-case.spec.ts

### Orders
- [ ] create-order.use-case.spec.ts
- [ ] get-order-by-id.use-case.spec.ts
- [ ] get-orders-by-customer.use-case.spec.ts
- [ ] get-orders-by-seller.use-case.spec.ts
- [ ] get-all-orders.use-case.spec.ts
- [ ] update-order.use-case.spec.ts
- [ ] update-order-status.use-case.spec.ts
- [ ] delete-order.use-case.spec.ts

## Testes de Integração para Serviços
- [ ] user.service.spec.ts
- [ ] product.service.spec.ts
- [ ] auth.service.spec.ts
- [ ] order.service.spec.ts

## Testes E2E para Controllers
- [ ] user.controller.e2e-spec.ts
- [ ] product.controller.e2e-spec.ts
- [ ] auth.controller.e2e-spec.ts
- [ ] order.controller.e2e-spec.ts

## Testes para Repositórios
- [ ] user.repository.spec.ts
- [ ] product.repository.spec.ts
- [ ] order.repository.spec.ts

## Configuração de Testes
- [ ] Configurar Jest com mocks para Prisma
- [ ] Configurar test database (SQLite em memória)
- [ ] Configurar mocks para dependências externas (JWT, bcrypt, speakeasy)

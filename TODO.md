# TODO: Implementar CRUD de Clientes e Histórico de Pedidos

## Passos para Implementação

### 1. Criar DTO para Customer ✅

- Criar `src/application/dto/create-customer.dto.ts` baseado no `create-user.dto.ts`, forçando role CUSTOMER.

### 2. Criar Use Case para Listar Customers ✅

- Criar `src/domain/use-cases/users/get-customers.use-case.ts` para filtrar usuários por role CUSTOMER.

### 3. Criar Customer Service ✅

- Criar `src/application/services/customer.service.ts` para encapsular lógica de negócio, reutilizando use cases existentes.

### 4. Criar Customer Controller ✅

- Criar `src/presentation/controllers/customer.controller.ts` com endpoints CRUD para customers e GET /customers/:id/orders para histórico.

### 5. Atualizar App Module ✅

- Atualizar `src/app.module.ts` para importar e declarar CustomerController, CustomerService, GetCustomersUseCase.

### 6. Escrever Testes ✅

- Testes unitários para novos use cases e service.
- Testes e2e para novos endpoints.

### 7. Documentar

- Adicionar documentação para novos endpoints (usando @ApiTags, @ApiOperation se Swagger estiver configurado).

### 8. Executar Lint e Testes

- Garantir que linting e testes passem antes de commitar.

### 9. Commits e Pull Request

- Commit separado para CRUD de customers (feat: add customer CRUD).
- Commit separado para histórico de pedidos (feat: add customer order history).
- Criar pull request.

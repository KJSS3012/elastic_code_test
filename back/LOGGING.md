# Sistema de Logging Estruturado

Este projeto implementa um sistema de logging estruturado usando Winston com contexto rico para rastreabilidade completa das operações.

## Características

### 🏗️ **Logs Estruturados em JSON**

- Todos os logs são emitidos em formato JSON estruturado
- Fácil parsing e indexação por ferramentas como ELK Stack
- Campos padronizados para consistência

### 🔍 **Correlation ID**

- Cada request HTTP recebe um correlation ID único (UUID v4)
- Permite rastrear todas as operações relacionadas a uma request
- Incluído em headers de response (`X-Correlation-ID`)

### 👤 **Contexto de Usuário**

- User ID e role são automaticamente capturados e incluídos nos logs
- Facilita auditoria e debugging de problemas específicos de usuários

### 🌐 **Contexto HTTP**

- Método HTTP, rota, IP, User-Agent
- Tempo de resposta automaticamente calculado
- Status codes para identificação de erros

### ⚡ **Performance Tracking**

- Medição automática de tempo de resposta
- Logs de operações lentas
- Métricas de performance por operação

## Estrutura dos Logs

### Campos Padrão

```json
{
  "timestamp": "2024-01-10T10:30:00.000Z",
  "level": "info",
  "message": "Operation completed successfully",
  "service": "elastic-back",
  "environment": "production",
  "correlationId": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "user123",
  "userRole": "farmer",
  "route": "/api/crops",
  "method": "POST",
  "ip": "192.168.1.100",
  "userAgent": "Mozilla/5.0...",
  "responseTime": 250,
  "statusCode": 201,
  "type": "http_request",
  "operation": "create_crop",
  "module": "crops",
  "success": true,
  "metadata": {
    "cropName": "Milho",
    "farmerId": "farmer456"
  }
}
```

## Tipos de Logs

### 1. **HTTP Requests**

Automaticamente logados pelo middleware:

- Request de entrada
- Response de saída
- Tempo de processamento
- Status codes

### 2. **Business Operations**

Operações de negócio específicas:

- CRUD operations
- Validações
- Processamento de dados
- Integrações

### 3. **Database Operations**

Operações de banco de dados:

- Queries executadas
- Tempo de execução
- Tabelas acessadas

### 4. **Errors & Exceptions**

Tratamento de erros:

- Stack traces
- Contexto do erro
- User e operação relacionados

## Como Usar

### 1. **Injeção do Logger**

```typescript
import { LoggerService } from './shared/logging/logger.service';

@Injectable()
export class ExampleService {
  constructor(private readonly logger: LoggerService) {}
}
```

### 2. **Logging Básico**

```typescript
// Log de informação
this.logger.log('Operation started', {
  correlationId: 'uuid-here',
  operation: 'create_user',
  module: 'users',
});

// Log de erro
this.logger.error('Operation failed', error.stack, {
  correlationId: 'uuid-here',
  operation: 'create_user',
  module: 'users',
  error: error.message,
});
```

### 3. **Business Operations**

```typescript
this.logger.logBusinessOperation('create_crop', true, {
  correlationId,
  duration: 150,
  module: 'crops',
  metadata: { cropId: '123', cropName: 'Milho' },
});
```

### 4. **Database Operations**

```typescript
this.logger.logDatabaseOperation('INSERT', 'crops', 50, {
  correlationId,
  module: 'crops',
});
```

### 5. **Usando Decorators**

```typescript
@LogOperation({
  operation: 'create_crop',
  module: 'crops',
  logInput: true,
  logOutput: true
})
async create(createCropDto: CreateCropDto) {
  // Operação automaticamente logada
}
```

## Configuração

### Variáveis de Ambiente

```bash
# Nível de log
LOG_LEVEL=info

# Diretório de logs
LOG_DIR=logs

# Formato
LOG_FORMAT=json

# Performance
LOG_SLOW_QUERIES=true
LOG_SLOW_QUERY_THRESHOLD=1000ms
```

### Arquivos de Log

- `logs/combined.log` - Todos os logs
- `logs/error.log` - Apenas erros
- Console - Logs formatados para desenvolvimento

## Middleware Automático

O sistema inclui middleware que automaticamente:

1. Gera correlation ID para cada request
2. Adiciona o ID ao response header
3. Loga início e fim de cada request
4. Captura tempo de resposta
5. Identifica usuário atual
6. Trata erros automaticamente

## Interceptor de Logging

O interceptor captura:

- Responses de sucesso
- Erros e exceptions
- Tempo de processamento
- Operações de negócio baseadas na rota

## Boas Práticas

### ✅ **Fazer**

- Usar correlation IDs em todas as operações
- Incluir contexto relevante nos logs
- Logar início e fim de operações importantes
- Usar níveis de log apropriados
- Sanitizar dados sensíveis

### ❌ **Evitar**

- Logar senhas ou tokens
- Logs excessivos em produção
- Logs sem contexto
- Informações pessoais desnecessárias

## Monitoramento

Os logs podem ser integrados com:

- **ELK Stack** (Elasticsearch, Logstash, Kibana)
- **Grafana** para dashboards
- **Prometheus** para métricas
- **Sentry** para error tracking

## Exemplos de Queries

### Encontrar todas as requests de um usuário:

```json
{
  "query": {
    "match": {
      "userId": "user123"
    }
  }
}
```

### Rastrear uma operação completa:

```json
{
  "query": {
    "match": {
      "correlationId": "550e8400-e29b-41d4-a716-446655440000"
    }
  },
  "sort": [{ "timestamp": "asc" }]
}
```

### Operações lentas:

```json
{
  "query": {
    "range": {
      "responseTime": {
        "gte": 1000
      }
    }
  }
}
```

Este sistema de logging fornece visibilidade completa sobre todas as operações da aplicação, facilitando debugging, monitoramento e auditoria.

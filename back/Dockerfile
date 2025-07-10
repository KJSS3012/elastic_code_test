# Dockerfile para o Backend (NestJS)
FROM node:18-alpine AS development

# Instalar dependências do sistema necessárias
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=development

# Copiar código fonte
COPY . .

# Gerar o Prisma Client (se estiver usando Prisma)
# RUN npx prisma generate

# Build da aplicação
RUN npm run build

# Estágio de produção
FROM node:18-alpine AS production

# Instalar dependências do sistema
RUN apk add --no-cache dumb-init

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar apenas dependências de produção
RUN npm ci --only=production && npm cache clean --force

# Copiar build da aplicação do estágio anterior
COPY --from=development --chown=nestjs:nodejs /app/dist ./dist
COPY --from=development --chown=nestjs:nodejs /app/node_modules ./node_modules

# Mudar para usuário não-root
USER nestjs

# Expor porta
EXPOSE 3000

# Usar dumb-init como entrypoint
ENTRYPOINT ["dumb-init", "--"]

# Comando para iniciar a aplicação
CMD ["node", "dist/main"]

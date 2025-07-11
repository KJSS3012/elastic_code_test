-- Script de inicialização do banco de dados
-- Este script é executado automaticamente quando o container PostgreSQL é iniciado pela primeira vez

-- Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Verificar se o banco foi criado corretamente
SELECT 'Database elastic_code initialized successfully!' as message;

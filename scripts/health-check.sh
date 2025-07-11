#!/bin/bash

# Script para verificar se todos os serviços estão funcionando

echo "🔍 Verificando status dos serviços..."

# Verificar backend
echo "Backend (http://localhost:3000/health):"
curl -s http://localhost:3000/health | jq '.' || echo "❌ Backend não está respondendo"

echo ""

# Verificar frontend
echo "Frontend (http://localhost):"
curl -s -o /dev/null -w "%{http_code}" http://localhost || echo "❌ Frontend não está respondendo"

echo ""

# Verificar PostgreSQL
echo "PostgreSQL:"
docker-compose exec postgres pg_isready -U postgres || echo "❌ PostgreSQL não está funcionando"

echo ""
echo "✅ Verificação concluída!"

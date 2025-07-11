#!/bin/bash

# Script de inicialização rápida do Elastic Code

set -e

echo "🚀 Iniciando Elastic Code..."

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado. Por favor, instale o Docker primeiro."
    exit 1
fi

# Verificar se Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não está instalado. Por favor, instale o Docker Compose primeiro."
    exit 1
fi

echo "✅ Docker e Docker Compose encontrados"

# Parar containers existentes se houver
echo "🛑 Parando containers existentes..."
docker-compose down 2>/dev/null || true

# Limpar volumes se solicitado
if [ "$1" = "--clean" ]; then
    echo "🧹 Limpando volumes..."
    docker-compose down -v 2>/dev/null || true
    docker system prune -f
fi

echo "🏗️ Construindo imagens..."
docker-compose build --no-cache

echo "⬆️ Subindo serviços..."
docker-compose up -d

echo "⏳ Aguardando serviços ficarem prontos..."
sleep 30

# Verificar se os serviços estão funcionando
echo "🔍 Verificando status dos serviços..."

# Backend
if curl -s http://localhost:3000/health > /dev/null; then
    echo "✅ Backend: OK"
else
    echo "❌ Backend: Falha"
fi

# Frontend
if curl -s http://localhost > /dev/null; then
    echo "✅ Frontend: OK"
else
    echo "❌ Frontend: Falha"
fi

echo ""
echo "🎉 Elastic Code está rodando!"
echo ""
echo "📱 Acessos disponíveis:"
echo "   Frontend: http://localhost"
echo "   Backend API: http://localhost:3000"
echo ""
echo "📊 Para ver logs:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 Para parar:"
echo "   docker-compose down"

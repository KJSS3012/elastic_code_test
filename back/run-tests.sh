#!/bin/bash

# Script para executar testes do backend
set -e

echo "🧪 Iniciando execução de testes do Backend..."

# Definir ambiente de teste
export NODE_ENV=test

# Limpar cache do Jest
echo "🧹 Limpando cache do Jest..."
npx jest --clearCache

# Executar testes unitários
echo "🔬 Executando testes unitários..."
npm run test:unit || {
    echo "❌ Testes unitários falharam"
    exit 1
}

# Gerar relatório de cobertura
echo "📊 Gerando relatório de cobertura..."
npm run test:cov || {
    echo "⚠️  Erro ao gerar relatório de cobertura"
}

echo "✅ Testes concluídos com sucesso!"
echo "📈 Relatório de cobertura disponível em: coverage/lcov-report/index.html"

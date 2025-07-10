# Script de inicialização para Windows PowerShell

Write-Host "🚀 Iniciando Elastic Code..." -ForegroundColor Green

# Verificar se Docker está instalado
try {
    docker --version | Out-Null
    Write-Host "✅ Docker encontrado" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker não está instalado. Por favor, instale o Docker Desktop primeiro." -ForegroundColor Red
    exit 1
}

# Verificar se Docker Compose está instalado
try {
    docker-compose --version | Out-Null
    Write-Host "✅ Docker Compose encontrado" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker Compose não está instalado." -ForegroundColor Red
    exit 1
}

# Parar containers existentes se houver
Write-Host "🛑 Parando containers existentes..." -ForegroundColor Yellow
docker-compose down 2>$null

# Limpar volumes se solicitado
if ($args[0] -eq "--clean") {
    Write-Host "🧹 Limpando volumes..." -ForegroundColor Yellow
    docker-compose down -v 2>$null
    docker system prune -f
}

Write-Host "🏗️ Construindo imagens..." -ForegroundColor Cyan
docker-compose build --no-cache

Write-Host "⬆️ Subindo serviços..." -ForegroundColor Cyan
docker-compose up -d

Write-Host "⏳ Aguardando serviços ficarem prontos..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Verificar se os serviços estão funcionando
Write-Host "🔍 Verificando status dos serviços..." -ForegroundColor Cyan

# Backend
try {
    Invoke-WebRequest -Uri "http://localhost:3000/health" -UseBasicParsing | Out-Null
    Write-Host "✅ Backend: OK" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend: Falha" -ForegroundColor Red
}

# Frontend
try {
    Invoke-WebRequest -Uri "http://localhost" -UseBasicParsing | Out-Null
    Write-Host "✅ Frontend: OK" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend: Falha" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 Elastic Code está rodando!" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Acessos disponíveis:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost"
Write-Host "   Backend API: http://localhost:3000"
Write-Host ""
Write-Host "📊 Para ver logs:" -ForegroundColor Yellow
Write-Host "   docker-compose logs -f"
Write-Host ""
Write-Host "🛑 Para parar:" -ForegroundColor Yellow
Write-Host "   docker-compose down"

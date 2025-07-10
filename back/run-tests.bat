@echo off
echo 🧪 Iniciando execução de testes do Backend...

REM Definir ambiente de teste
set NODE_ENV=test

REM Limpar cache do Jest
echo 🧹 Limpando cache do Jest...
npx jest --clearCache

REM Executar testes unitários
echo 🔬 Executando testes unitários...
call npm run test:unit
if %errorlevel% neq 0 (
    echo ❌ Testes unitários falharam
    exit /b 1
)

REM Gerar relatório de cobertura
echo 📊 Gerando relatório de cobertura...
call npm run test:cov

echo ✅ Testes concluídos com sucesso!
echo 📈 Relatório de cobertura disponível em: coverage/lcov-report/index.html

# Makefile para Elastic Code
.PHONY: help build up down logs clean dev test

# Comando padrão
help: ## Mostrar ajuda
	@echo "Comandos disponíveis:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

build: ## Construir todas as imagens
	docker-compose build --no-cache

up: ## Subir todos os serviços
	docker-compose up -d

down: ## Parar todos os serviços
	docker-compose down

logs: ## Mostrar logs de todos os serviços
	docker-compose logs -f

clean: ## Limpar containers, volumes e imagens
	docker-compose down -v --rmi all --remove-orphans
	docker system prune -f

dev: ## Subir ambiente de desenvolvimento (apenas PostgreSQL + backend)
	docker-compose -f docker-compose.dev.yml up --build

dev-down: ## Parar ambiente de desenvolvimento
	docker-compose -f docker-compose.dev.yml down

test: ## Executar testes
	docker-compose exec backend npm run test
	docker-compose exec frontend npm run test

install: ## Instalar dependências localmente
	cd back && npm install
	cd front && npm install

status: ## Verificar status dos containers
	docker-compose ps

restart: ## Reiniciar todos os serviços
	docker-compose restart

backup-db: ## Fazer backup do banco de dados
	docker-compose exec postgres pg_dump -U postgres elastic_code > backup_$(shell date +%Y%m%d_%H%M%S).sql

restore-db: ## Restaurar backup do banco (uso: make restore-db FILE=backup.sql)
	docker-compose exec -T postgres psql -U postgres elastic_code < $(FILE)

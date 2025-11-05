# Database Stack Management (using docker-compose)
dbdown:
	cd ./database && env -i PATH="$$PATH" HOME="$$HOME" docker compose -f ./docker-compose.yml down && cd ..

dbup:
	cd ./database && env -i PATH="$$PATH" HOME="$$HOME" docker compose -f ./docker-compose.yml up -d && cd ..

rsdb:
	@echo "⚠️  Resetting databases (deleting all data)..."
	make dbdown
	@echo "🗑️  Removing Docker volumes for twenty-one project only..."
	docker volume rm -f database_twenty_db_data 2>/dev/null || true
	docker volume rm -f twenty_db_data 2>/dev/null || true
	@echo "✅ Database volumes and data cleared."
	make dbup
	@echo "✅ Databases reset and restarted!"

db-setup:
	@echo "⚙️  Setting up databases..."
	make dbup
	npx nx database:reset twenty-server
	@echo "✅ Database setup completed."

db-setup-production:
	@echo "⚙️  Setting up databases..."
	make dbup
	npx nx database:reset twenty-server --configuration=no-seed
	@echo "✅ Database setup completed."

db-logs: ## Show logs for all database services
	cd database && docker-compose logs -f

db-status: ## Show status of all database services
	cd database && docker-compose ps

# Individual service management
postgres-up: ## Start only PostgreSQL
	cd database && docker-compose up -d postgres

redis-up: ## Start only Redis
	cd database && docker-compose up -d redis

clickhouse-up: ## Start only ClickHouse
	cd database && docker-compose up -d clickhouse

grafana-up: ## Start only Grafana
	cd database && docker-compose up -d grafana

otlp-up: ## Start only OpenTelemetry Collector
	cd database && docker-compose up -d opentelemetry-collector

# Legacy commands (deprecated - use db-* commands instead)
postgres-on-docker: postgres-up
	@echo "⚠️  This command is deprecated. Use 'make postgres-up' instead."

redis-on-docker: redis-up
	@echo "⚠️  This command is deprecated. Use 'make redis-up' instead."

clickhouse-on-docker: clickhouse-up
	@echo "⚠️  This command is deprecated. Use 'make clickhouse-up' instead."

grafana-on-docker: grafana-up
	@echo "⚠️  This command is deprecated. Use 'make grafana-up' instead."

opentelemetry-collector-on-docker: otlp-up
	@echo "⚠️  This command is deprecated. Use 'make otlp-up' instead."

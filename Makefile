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

# Windows-compatible commands (using cmd.exe syntax)
win-dbdown: ## Windows: Stop database services
	cd database && set "PATH=%PATH%" && set "HOME=%HOME%" && docker compose -f docker-compose.yml down && cd ..

win-dbup: ## Windows: Start database services
	cd database && set "PATH=%PATH%" && set "HOME=%HOME%" && docker compose -f docker-compose.yml up -d && cd ..

win-rsdb: ## Windows: Reset databases (deleting all data)
	@echo ⚠️  Resetting databases (deleting all data)...
	make win-dbdown
	@echo 🗑️  Removing Docker volumes for twenty-one project only...
	docker volume rm -f database_twenty_db_data 2>nul || echo Volume not found
	docker volume rm -f twenty_db_data 2>nul || echo Volume not found
	@echo ✅ Database volumes and data cleared.
	make win-dbup
	@echo ✅ Databases reset and restarted!

win-db-setup: ## Windows: Setup databases
	@echo ⚙️  Setting up databases...
	make win-dbup
	npx nx database:reset twenty-server
	@echo ✅ Database setup completed.

win-db-setup-production: ## Windows: Setup databases for production
	@echo ⚙️  Setting up databases...
	make win-dbup
	npx nx database:reset twenty-server --configuration=no-seed
	@echo ✅ Database setup completed.

win-db-logs: ## Windows: Show logs for all database services
	cd database && docker-compose logs -f

win-db-status: ## Windows: Show status of all database services
	cd database && docker-compose ps

# Windows Individual service management
win-postgres-up: ## Windows: Start only PostgreSQL
	cd database && docker-compose up -d postgres

win-redis-up: ## Windows: Start only Redis
	cd database && docker-compose up -d redis

win-clickhouse-up: ## Windows: Start only ClickHouse
	cd database && docker-compose up -d clickhouse

win-grafana-up: ## Windows: Start only Grafana
	cd database && docker-compose up -d grafana

win-otlp-up: ## Windows: Start only OpenTelemetry Collector
	cd database && docker-compose up -d opentelemetry-collector

# Windows Legacy commands (deprecated - use win-db-* commands instead)
win-postgres-on-docker: win-postgres-up
	@echo ⚠️  This command is deprecated. Use 'make win-postgres-up' instead.

win-redis-on-docker: win-redis-up
	@echo ⚠️  This command is deprecated. Use 'make win-redis-up' instead.

win-clickhouse-on-docker: win-clickhouse-up
	@echo ⚠️  This command is deprecated. Use 'make win-clickhouse-up' instead.

win-grafana-on-docker: win-grafana-up
	@echo ⚠️  This command is deprecated. Use 'make win-grafana-up' instead.

win-opentelemetry-collector-on-docker: win-otlp-up
	@echo ⚠️  This command is deprecated. Use 'make win-otlp-up' instead.

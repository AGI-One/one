@echo off
REM Reset all databases (delete all data)

echo WARNING: This will delete all database data!
echo Press Ctrl+C to cancel, or
pause

echo Stopping database services...
cd database
docker compose -f docker-compose.yml down
cd ..

echo Removing Docker volumes...
docker volume rm -f database_twenty_db_data 2>nul
docker volume rm -f twenty_db_data 2>nul
docker volume rm -f database_redis_data 2>nul
docker volume rm -f redis_data 2>nul
docker volume rm -f database_clickhouse_data 2>nul
docker volume rm -f clickhouse_data 2>nul
docker volume rm -f database_grafana_data 2>nul
docker volume rm -f grafana_data 2>nul
docker volume rm -f database_otel_data 2>nul
docker volume rm -f otel_data 2>nul
docker volume rm -f database_minio_data 2>nul
docker volume rm -f minio_data 2>nul

echo Starting database services...
cd database
docker compose -f docker-compose.yml up -d
cd ..

echo Done! Databases reset and restarted.
pause

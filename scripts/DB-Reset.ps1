#!/usr/bin/env pwsh
# DB-Reset: Reset all databases (delete all data)
Write-Host "⚠️  Resetting databases (deleting all data)..." -ForegroundColor Yellow

Write-Host "⚙️  Stopping database services..." -ForegroundColor Cyan
Push-Location database
docker compose -f docker-compose.yml down
Pop-Location

Write-Host "🗑️  Removing Docker volumes for twenty-one project only..." -ForegroundColor Yellow
$volumes = @(
    "database_twenty_db_data",
    "twenty_db_data",
    "database_redis_data",
    "redis_data",
    "database_clickhouse_data",
    "clickhouse_data",
    "database_grafana_data",
    "grafana_data",
    "database_otel_data",
    "otel_data",
    "database_minio_data",
    "minio_data"
)

foreach ($volume in $volumes) {
    try {
        docker volume rm -f $volume 2>$null
        Write-Host "  - Removed: $volume" -ForegroundColor DarkGray
    } catch {
        Write-Host "  - Not found: $volume" -ForegroundColor DarkGray
    }
}

Write-Host "✅ Database volumes and data cleared." -ForegroundColor Green

Write-Host "⚙️  Starting database services..." -ForegroundColor Cyan
Push-Location database
docker compose -f docker-compose.yml up -d
Pop-Location

Write-Host "✅ Databases reset and restarted!" -ForegroundColor Green

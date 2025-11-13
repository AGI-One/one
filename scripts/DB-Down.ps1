#!/usr/bin/env pwsh
# DB-Down: Stop all database services
Write-Host "⚙️  Stopping database services..." -ForegroundColor Cyan
Push-Location database
docker compose -f docker-compose.yml down
Pop-Location
Write-Host "✅ Database services stopped." -ForegroundColor Green

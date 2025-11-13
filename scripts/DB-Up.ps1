#!/usr/bin/env pwsh
# DB-Up: Start all database services
Write-Host "⚙️  Starting database services..." -ForegroundColor Cyan
Push-Location database
docker compose -f docker-compose.yml up -d
Pop-Location
Write-Host "✅ Database services started." -ForegroundColor Green

#!/usr/bin/env pwsh
# DB-Setup-Production: Setup databases for production (no seed)
Write-Host "⚙️  Setting up databases for production..." -ForegroundColor Cyan

Write-Host "⚙️  Starting database services..." -ForegroundColor Cyan
Push-Location database
docker compose -f docker-compose.yml up -d
Pop-Location

npx nx database:reset twenty-server --configuration=no-seed
Write-Host "✅ Database setup completed." -ForegroundColor Green

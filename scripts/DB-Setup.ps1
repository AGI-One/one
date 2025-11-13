#!/usr/bin/env pwsh
# DB-Setup: Setup databases with seed data
Write-Host "⚙️  Setting up databases..." -ForegroundColor Cyan

Write-Host "⚙️  Starting database services..." -ForegroundColor Cyan
Push-Location database
docker compose -f docker-compose.yml up -d
Pop-Location

npx nx database:reset twenty-server
Write-Host "✅ Database setup completed." -ForegroundColor Green

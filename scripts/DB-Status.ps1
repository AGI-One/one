#!/usr/bin/env pwsh
# DB-Status: Show database status
Write-Host "⚙️  Database services status:" -ForegroundColor Cyan
Push-Location database
docker-compose ps
Pop-Location

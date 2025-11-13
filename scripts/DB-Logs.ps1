#!/usr/bin/env pwsh
# DB-Logs: Show database logs
Write-Host "⚙️  Showing database logs (Press Ctrl+C to exit)..." -ForegroundColor Cyan
Push-Location database
docker-compose logs -f
Pop-Location

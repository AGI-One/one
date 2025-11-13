#!/usr/bin/env pwsh
# Test-All: Run all tests
Write-Host "⚙️  Running all tests..." -ForegroundColor Cyan
npx nx run-many --target=test --all
Write-Host "✅ Tests completed." -ForegroundColor Green

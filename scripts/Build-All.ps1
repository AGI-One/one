#!/usr/bin/env pwsh
# Build-All: Build all packages
Write-Host "⚙️  Building all packages..." -ForegroundColor Cyan
npx nx run-many --target=build --all
Write-Host "✅ Build completed." -ForegroundColor Green

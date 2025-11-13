#!/usr/bin/env pwsh
# Clean-All: Remove all node_modules and build artifacts
Write-Host "⚠️  Cleaning all node_modules and build artifacts..." -ForegroundColor Yellow

# Remove node_modules
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force "node_modules"
    Write-Host "🗑️  Removed root node_modules" -ForegroundColor Yellow
}

# Remove package node_modules
Get-ChildItem -Path "packages" -Recurse -Directory -Filter "node_modules" -ErrorAction SilentlyContinue | ForEach-Object {
    Remove-Item -Recurse -Force $_.FullName
    Write-Host "🗑️  Removed $($_.FullName)" -ForegroundColor Yellow
}

# Remove dist folders
Get-ChildItem -Path "packages" -Recurse -Directory -Filter "dist" -ErrorAction SilentlyContinue | ForEach-Object {
    Remove-Item -Recurse -Force $_.FullName
    Write-Host "🗑️  Removed $($_.FullName)" -ForegroundColor Yellow
}

Write-Host "✅ Cleanup completed." -ForegroundColor Green

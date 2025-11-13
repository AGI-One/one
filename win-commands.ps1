# Twenty-One Windows Commands (PowerShell)
# Bộ lệnh quản lý dự án Twenty-One cho Windows

# Colors for output
function Write-Success { param($Message) Write-Host "✅ $Message" -ForegroundColor Green }
function Write-Info { param($Message) Write-Host "⚙️  $Message" -ForegroundColor Cyan }
function Write-Warning { param($Message) Write-Host "⚠️  $Message" -ForegroundColor Yellow }
function Write-Error { param($Message) Write-Host "❌ $Message" -ForegroundColor Red }
function Write-Clean { param($Message) Write-Host "🗑️  $Message" -ForegroundColor Yellow }

# =============================================================================
# DATABASE MANAGEMENT COMMANDS
# =============================================================================

function DB-Down {
    <#
    .SYNOPSIS
    Dừng tất cả các database services
    #>
    Write-Info "Stopping database services..."
    Push-Location database
    docker compose -f docker-compose.yml down
    Pop-Location
    Write-Success "Database services stopped."
}

function DB-Up {
    <#
    .SYNOPSIS
    Khởi động tất cả các database services
    #>
    Write-Info "Starting database services..."
    Push-Location database
    docker compose -f docker-compose.yml up -d
    Pop-Location
    Write-Success "Database services started."
}

function DB-Reset {
    <#
    .SYNOPSIS
    Reset tất cả databases (xóa toàn bộ dữ liệu)
    #>
    Write-Warning "Resetting databases (deleting all data)..."
    DB-Down
    
    Write-Clean "Removing Docker volumes for twenty-one project only..."
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
    
    Write-Success "Database volumes and data cleared."
    DB-Up
    Write-Success "Databases reset and restarted!"
}

function DB-Setup {
    <#
    .SYNOPSIS
    Setup databases với seed data
    #>
    Write-Info "Setting up databases..."
    DB-Up
    npx nx database:reset twenty-server
    Write-Success "Database setup completed."
}

function DB-Setup-Production {
    <#
    .SYNOPSIS
    Setup databases cho production (không có seed data)
    #>
    Write-Info "Setting up databases for production..."
    DB-Up
    npx nx database:reset twenty-server --configuration=no-seed
    Write-Success "Database setup completed."
}

function DB-Logs {
    <#
    .SYNOPSIS
    Hiển thị logs của tất cả database services
    #>
    Write-Info "Showing database logs..."
    Push-Location database
    docker-compose logs -f
    Pop-Location
}

function DB-Status {
    <#
    .SYNOPSIS
    Hiển thị trạng thái của tất cả database services
    #>
    Write-Info "Database services status:"
    Push-Location database
    docker-compose ps
    Pop-Location
}

# =============================================================================
# INDIVIDUAL SERVICE MANAGEMENT
# =============================================================================

function Postgres-Up {
    <#
    .SYNOPSIS
    Khởi động chỉ PostgreSQL
    #>
    Write-Info "Starting PostgreSQL..."
    Push-Location database
    docker-compose up -d postgres
    Pop-Location
    Write-Success "PostgreSQL started."
}

function Redis-Up {
    <#
    .SYNOPSIS
    Khởi động chỉ Redis
    #>
    Write-Info "Starting Redis..."
    Push-Location database
    docker-compose up -d redis
    Pop-Location
    Write-Success "Redis started."
}

function ClickHouse-Up {
    <#
    .SYNOPSIS
    Khởi động chỉ ClickHouse
    #>
    Write-Info "Starting ClickHouse..."
    Push-Location database
    docker-compose up -d clickhouse
    Pop-Location
    Write-Success "ClickHouse started."
}

function Grafana-Up {
    <#
    .SYNOPSIS
    Khởi động chỉ Grafana
    #>
    Write-Info "Starting Grafana..."
    Push-Location database
    docker-compose up -d grafana
    Pop-Location
    Write-Success "Grafana started."
}

function OTLP-Up {
    <#
    .SYNOPSIS
    Khởi động chỉ OpenTelemetry Collector
    #>
    Write-Info "Starting OpenTelemetry Collector..."
    Push-Location database
    docker-compose up -d opentelemetry-collector
    Pop-Location
    Write-Success "OpenTelemetry Collector started."
}

# =============================================================================
# DEVELOPMENT COMMANDS
# =============================================================================

function Dev-Server {
    <#
    .SYNOPSIS
    Chạy development server
    #>
    Write-Info "Starting development server..."
    npx nx start twenty-server
}

function Dev-Front {
    <#
    .SYNOPSIS
    Chạy frontend development server
    #>
    Write-Info "Starting frontend development server..."
    npx nx start twenty-front
}

function Dev-All {
    <#
    .SYNOPSIS
    Chạy cả backend và frontend
    #>
    Write-Info "Starting all development servers..."
    Start-Job -Name "Backend" -ScriptBlock { npx nx start twenty-server }
    Start-Job -Name "Frontend" -ScriptBlock { npx nx start twenty-front }
    Write-Success "Development servers started in background jobs."
    Write-Info "Use 'Get-Job' to check status, 'Receive-Job' to see output."
}

function Build-All {
    <#
    .SYNOPSIS
    Build toàn bộ dự án
    #>
    Write-Info "Building all packages..."
    npx nx run-many --target=build --all
    Write-Success "Build completed."
}

function Test-All {
    <#
    .SYNOPSIS
    Chạy tất cả tests
    #>
    Write-Info "Running all tests..."
    npx nx run-many --target=test --all
    Write-Success "Tests completed."
}

function Lint-All {
    <#
    .SYNOPSIS
    Chạy linter cho toàn bộ dự án
    #>
    Write-Info "Running linter..."
    npx nx run-many --target=lint --all
    Write-Success "Linting completed."
}

function Format-All {
    <#
    .SYNOPSIS
    Format code cho toàn bộ dự án
    #>
    Write-Info "Formatting code..."
    npx nx format:write
    Write-Success "Code formatting completed."
}

# =============================================================================
# UTILITY COMMANDS
# =============================================================================

function Clean-All {
    <#
    .SYNOPSIS
    Xóa tất cả node_modules và build artifacts
    #>
    Write-Warning "Cleaning all node_modules and build artifacts..."
    
    # Remove node_modules
    if (Test-Path "node_modules") {
        Remove-Item -Recurse -Force "node_modules"
        Write-Clean "Removed root node_modules"
    }
    
    # Remove package node_modules
    Get-ChildItem -Path "packages" -Recurse -Directory -Filter "node_modules" | ForEach-Object {
        Remove-Item -Recurse -Force $_.FullName
        Write-Clean "Removed $($_.FullName)"
    }
    
    # Remove dist folders
    Get-ChildItem -Path "packages" -Recurse -Directory -Filter "dist" | ForEach-Object {
        Remove-Item -Recurse -Force $_.FullName
        Write-Clean "Removed $($_.FullName)"
    }
    
    Write-Success "Cleanup completed."
}

function Install-Deps {
    <#
    .SYNOPSIS
    Cài đặt tất cả dependencies
    #>
    Write-Info "Installing dependencies..."
    yarn install
    Write-Success "Dependencies installed."
}

function Fresh-Install {
    <#
    .SYNOPSIS
    Xóa mọi thứ và cài đặt lại từ đầu
    #>
    Clean-All
    Install-Deps
    Write-Success "Fresh installation completed."
}

function Show-Help {
    <#
    .SYNOPSIS
    Hiển thị danh sách tất cả lệnh có sẵn
    #>
    Write-Host "`n=== Twenty-One Windows Commands ===" -ForegroundColor Magenta
    Write-Host "`nĐể sử dụng, import file này vào PowerShell session:" -ForegroundColor Yellow
    Write-Host "  . .\win-commands.ps1" -ForegroundColor Cyan
    Write-Host "`nSau đó gọi các function sau:" -ForegroundColor Yellow
    
    Write-Host "`n📦 DATABASE MANAGEMENT:" -ForegroundColor Green
    Write-Host "  DB-Up                  - Khởi động tất cả database services"
    Write-Host "  DB-Down                - Dừng tất cả database services"
    Write-Host "  DB-Reset               - Reset databases (xóa toàn bộ dữ liệu)"
    Write-Host "  DB-Setup               - Setup databases với seed data"
    Write-Host "  DB-Setup-Production    - Setup databases cho production"
    Write-Host "  DB-Logs                - Hiển thị logs của databases"
    Write-Host "  DB-Status              - Hiển thị trạng thái databases"
    
    Write-Host "`n🔧 INDIVIDUAL SERVICES:" -ForegroundColor Green
    Write-Host "  Postgres-Up            - Khởi động PostgreSQL"
    Write-Host "  Redis-Up               - Khởi động Redis"
    Write-Host "  ClickHouse-Up          - Khởi động ClickHouse"
    Write-Host "  Grafana-Up             - Khởi động Grafana"
    Write-Host "  OTLP-Up                - Khởi động OpenTelemetry Collector"
    
    Write-Host "`n💻 DEVELOPMENT:" -ForegroundColor Green
    Write-Host "  Dev-Server             - Chạy backend development server"
    Write-Host "  Dev-Front              - Chạy frontend development server"
    Write-Host "  Dev-All                - Chạy cả backend và frontend"
    Write-Host "  Build-All              - Build toàn bộ dự án"
    Write-Host "  Test-All               - Chạy tất cả tests"
    Write-Host "  Lint-All               - Chạy linter"
    Write-Host "  Format-All             - Format code"
    
    Write-Host "`n🧹 UTILITIES:" -ForegroundColor Green
    Write-Host "  Clean-All              - Xóa node_modules và build artifacts"
    Write-Host "  Install-Deps           - Cài đặt dependencies"
    Write-Host "  Fresh-Install          - Xóa và cài đặt lại từ đầu"
    Write-Host "  Show-Help              - Hiển thị help này"
    
    Write-Host "`n📝 VÍ DỤ SỬ DỤNG:" -ForegroundColor Cyan
    Write-Host "  DB-Up                  # Khởi động databases"
    Write-Host "  DB-Setup               # Setup databases"
    Write-Host "  Dev-Server             # Chạy server"
    Write-Host "  Dev-Front              # Chạy frontend"
    Write-Host ""
}

# Export all functions
Export-ModuleMember -Function *

# Show help when first loaded
Show-Help

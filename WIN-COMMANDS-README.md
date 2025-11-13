# Windows Commands - Hướng dẫn sử dụng

## Cách 1: Chạy trực tiếp Scripts (Đơn giản nhất - Khuyến nghị)

Chạy trực tiếp các script trong thư mục `scripts\`:

```powershell
.\scripts\DB-Up.ps1              # Khởi động databases
.\scripts\DB-Down.ps1            # Dừng databases
.\scripts\DB-Reset.ps1           # Reset databases
.\scripts\DB-Setup.ps1           # Setup databases với seed
.\scripts\DB-Setup-Production.ps1 # Setup production
.\scripts\DB-Logs.ps1            # Xem logs
.\scripts\DB-Status.ps1          # Xem trạng thái
.\scripts\Dev-Server.ps1         # Chạy backend
.\scripts\Dev-Front.ps1          # Chạy frontend
.\scripts\Build-All.ps1          # Build tất cả
.\scripts\Test-All.ps1           # Test tất cả
.\scripts\Clean-All.ps1          # Xóa node_modules
.\scripts\Install-Deps.ps1       # Cài đặt dependencies
```

**Không cần import gì cả, chỉ cần chạy trực tiếp!**

## Cách 2: Sử dụng PowerShell Functions (Nếu muốn gọi ngắn gọn)

### Bước 1: Import script vào PowerShell session
```powershell
. .\win-commands.ps1
```

### Bước 2: Sử dụng các function

#### Quản lý Database
```powershell
DB-Up                    # Khởi động tất cả database services
DB-Down                  # Dừng tất cả database services  
DB-Reset                 # Reset databases (xóa toàn bộ dữ liệu)
DB-Setup                 # Setup databases với seed data
DB-Setup-Production      # Setup databases cho production (không seed)
DB-Logs                  # Xem logs của databases
DB-Status                # Xem trạng thái databases
```

#### Quản lý từng Service riêng lẻ
```powershell
Postgres-Up              # Khởi động PostgreSQL
Redis-Up                 # Khởi động Redis
ClickHouse-Up            # Khởi động ClickHouse
Grafana-Up               # Khởi động Grafana
OTLP-Up                  # Khởi động OpenTelemetry Collector
```

#### Development
```powershell
Dev-Server               # Chạy backend development server
Dev-Front                # Chạy frontend development server
Dev-All                  # Chạy cả backend và frontend (background jobs)
Build-All                # Build toàn bộ dự án
Test-All                 # Chạy tất cả tests
Lint-All                 # Chạy linter
Format-All               # Format code
```

#### Utilities
```powershell
Clean-All                # Xóa node_modules và build artifacts
Install-Deps             # Cài đặt dependencies
Fresh-Install            # Xóa và cài đặt lại từ đầu
Show-Help                # Hiển thị help
```

## Cách 3: Sử dụng Makefile (Cần WSL hoặc Git Bash)

```bash
# Database Management
make dbup                # Khởi động databases
make dbdown              # Dừng databases
make rsdb                # Reset databases
make db-setup            # Setup databases với seed data
make db-setup-production # Setup databases production

# Individual Services
make postgres-up
make redis-up
make clickhouse-up
make grafana-up
make otlp-up

# Logs & Status
make db-logs
make db-status
```

## Cách 4: Sử dụng Windows Batch Files (Tương thích CMD)

Chạy trực tiếp các file `.bat`:
```cmd
db-up.bat                # Khởi động databases
db-down.bat              # Dừng databases
db-reset.bat             # Reset databases
db-setup.bat             # Setup databases
dev-server.bat           # Chạy backend
dev-front.bat            # Chạy frontend
```

## Quy trình Setup ban đầu

### Lần đầu setup project (Cách đơn giản):
```powershell
# 1. Cài đặt dependencies
.\scripts\Install-Deps.ps1

# 2. Khởi động và setup databases
.\scripts\DB-Setup.ps1

# 3. Chạy development server
.\scripts\Dev-Server.ps1    # Backend
# Hoặc
.\scripts\Dev-Front.ps1     # Frontend
```

### Hoặc dùng Functions (nếu đã import):
```powershell
# 1. Import commands
. .\win-commands.ps1

# 2. Cài đặt dependencies
Install-Deps

# 3. Khởi động và setup databases
DB-Setup

# 4. Chạy development servers
Dev-Server    # Hoặc
Dev-Front     # Hoặc
Dev-All       # Chạy cả hai
```

### Reset và bắt đầu lại từ đầu (Cách đơn giản):
```powershell
.\scripts\DB-Reset.ps1
.\scripts\Clean-All.ps1
.\scripts\Install-Deps.ps1
.\scripts\DB-Setup.ps1
```

### Hoặc dùng Functions:
```powershell
. .\win-commands.ps1
DB-Reset
Fresh-Install
DB-Setup
```

## Tips

1. **Để tự động load commands mỗi khi mở PowerShell:**
   Thêm dòng sau vào PowerShell profile của bạn:
   ```powershell
   notepad $PROFILE
   # Thêm dòng này:
   if (Test-Path "C:\Users\admin\Downloads\code\twenty-one\win-commands.ps1") {
       . "C:\Users\admin\Downloads\code\twenty-one\win-commands.ps1"
   }
   ```

2. **Check status của background jobs:**
   ```powershell
   Get-Job                # Xem danh sách jobs
   Receive-Job -Name "Backend"   # Xem output của job
   Stop-Job -Name "Backend"      # Dừng job
   Remove-Job -Name "Backend"    # Xóa job
   ```

3. **Nếu gặp lỗi execution policy:**
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

## Yêu cầu

- Docker Desktop đã cài đặt và đang chạy
- Node.js và Yarn đã cài đặt
- PowerShell 5.1 trở lên (có sẵn trên Windows 10/11)

# 🪟 Windows Commands Quick Reference

Bộ lệnh Windows cho dự án Twenty-One. Có 4 cách sử dụng:

## 🚀 Cách 1: PowerShell Scripts (Đơn giản nhất - Khuyến nghị)

Chạy trực tiếp, không cần import gì:

```powershell
.\scripts\DB-Up.ps1              # ▶️ Khởi động databases
.\scripts\DB-Down.ps1            # ⏹️ Dừng databases
.\scripts\DB-Reset.ps1           # 🔄 Reset databases
.\scripts\DB-Setup.ps1           # ⚙️ Setup + seed data
.\scripts\DB-Setup-Production.ps1 # 🏭 Setup production
.\scripts\DB-Logs.ps1            # 📋 Xem logs
.\scripts\DB-Status.ps1          # ℹ️ Xem trạng thái
.\scripts\Dev-Server.ps1         # 🖥️ Backend server
.\scripts\Dev-Front.ps1          # 💻 Frontend server
.\scripts\Build-All.ps1          # 🔨 Build tất cả
.\scripts\Test-All.ps1           # 🧪 Test tất cả
.\scripts\Clean-All.ps1          # 🧹 Xóa node_modules
.\scripts\Install-Deps.ps1       # 📦 Cài dependencies
```

## 🔧 Cách 2: Batch Files (Double-click)

Chỉ cần double-click các file `.bat`:

| File | Chức năng |
|------|-----------|
| `db-up.bat` | ▶️ Khởi động databases |
| `db-down.bat` | ⏹️ Dừng databases |
| `db-reset.bat` | 🔄 Reset databases (xóa data) |
| `db-setup.bat` | ⚙️ Setup databases + seed data |
| `db-logs.bat` | 📋 Xem logs databases |
| `db-status.bat` | ℹ️ Xem trạng thái databases |
| `dev-server.bat` | 🖥️ Chạy backend server |
| `dev-front.bat` | 💻 Chạy frontend server |

## � Cách 3: PowerShell Functions (Gọi ngắn gọn)

### Load commands một lần:
```powershell
. .\win-commands.ps1
```

### Các lệnh chính:

**Database:**
```powershell
DB-Up                    # Khởi động
DB-Down                  # Dừng
DB-Reset                 # Reset
DB-Setup                 # Setup với seed
DB-Logs                  # Xem logs
DB-Status                # Xem trạng thái
```

**Services riêng lẻ:**
```powershell
Postgres-Up
Redis-Up
ClickHouse-Up
Grafana-Up
OTLP-Up
```

**Development:**
```powershell
Dev-Server               # Backend
Dev-Front                # Frontend
Dev-All                  # Cả hai
Build-All                # Build toàn bộ
Test-All                 # Test
Lint-All                 # Lint
Format-All               # Format code
```

**Utilities:**
```powershell
Clean-All                # Xóa node_modules
Install-Deps             # Cài đặt deps
Fresh-Install            # Cài mới hoàn toàn
Show-Help                # Hiển thị help
```

## 📝 Cách 4: Makefile (Cần WSL/Git Bash)

```bash
make dbup                # Khởi động databases
make dbdown              # Dừng databases
make rsdb                # Reset databases
make db-setup            # Setup databases
```

## 🎯 Quick Start

### Lần đầu setup (Cách 1 - Đơn giản nhất):
```powershell
.\scripts\Install-Deps.ps1       # Cài dependencies
.\scripts\DB-Setup.ps1           # Setup databases
.\scripts\Dev-Server.ps1         # Chạy backend
# Hoặc
.\scripts\Dev-Front.ps1          # Chạy frontend
```

### Lần đầu setup (Cách 2 - Batch files):
```powershell
# Double-click các file sau theo thứ tự:
db-up.bat               # Khởi động databases
db-setup.bat            # Setup databases
dev-server.bat          # Chạy backend
# Hoặc
dev-front.bat           # Chạy frontend
```

### Lần đầu setup (Cách 3 - PowerShell Functions):
. .\win-commands.ps1
Install-Deps
DB-Setup
Dev-Server              # Hoặc Dev-Front
```

### Khi muốn reset (Cách 1):
```powershell
.\scripts\DB-Reset.ps1
```

### Khi muốn reset (Cách 2):
```powershell
# Cách 1:
db-reset.bat

# Cách 2:
. .\win-commands.ps1
DB-Reset
```

## 📚 Xem thêm

Chi tiết đầy đủ trong file: `WIN-COMMANDS-README.md`

## ⚙️ Yêu cầu

- ✅ Docker Desktop (đang chạy)
- ✅ Node.js + Yarn
- ✅ PowerShell 5.1+ (có sẵn trên Windows 10/11)

---
**Tip:** Nếu gặp lỗi execution policy:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

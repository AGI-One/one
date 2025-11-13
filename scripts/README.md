# Scripts Directory

Các PowerShell scripts có thể chạy trực tiếp mà không cần import.

## Cách sử dụng

Từ thư mục root của project, chạy:

```powershell
.\scripts\<tên-script>.ps1
```

## Danh sách Scripts

### Database Management
- `DB-Up.ps1` - Khởi động tất cả database services
- `DB-Down.ps1` - Dừng tất cả database services
- `DB-Reset.ps1` - Reset databases (xóa toàn bộ dữ liệu)
- `DB-Setup.ps1` - Setup databases với seed data
- `DB-Setup-Production.ps1` - Setup databases cho production (không seed)
- `DB-Logs.ps1` - Hiển thị logs của databases
- `DB-Status.ps1` - Hiển thị trạng thái databases

### Development
- `Dev-Server.ps1` - Chạy backend development server
- `Dev-Front.ps1` - Chạy frontend development server
- `Build-All.ps1` - Build toàn bộ dự án
- `Test-All.ps1` - Chạy tất cả tests

### Utilities
- `Clean-All.ps1` - Xóa node_modules và build artifacts
- `Install-Deps.ps1` - Cài đặt dependencies

## Ví dụ

```powershell
# Khởi động databases
.\scripts\DB-Up.ps1

# Setup databases
.\scripts\DB-Setup.ps1

# Chạy backend server
.\scripts\Dev-Server.ps1
```

## Note

- Tất cả scripts đều có colors và error handling
- Không cần import `win-commands.ps1` trước
- Chạy trực tiếp từ thư mục root của project

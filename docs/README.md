# Tài Liệu Hướng Dẫn Sử Dụng Twenty CRM

## Giới thiệu

Twenty là hệ thống CRM (Customer Relationship Management) mã nguồn mở hiện đại, giúp doanh nghiệp quản lý khách hàng, cơ hội bán hàng, và quy trình kinh doanh một cách hiệu quả. Tài liệu này cung cấp hướng dẫn chi tiết về các module chức năng của Twenty CRM.

## Cấu trúc tài liệu

Tài liệu được tổ chức thành **7 module chính**, mỗi module bao gồm:
- **Module dùng để làm gì**: Giải thích chức năng và mục đích
- **Dành cho ai**: Đối tượng sử dụng phù hợp
- **Làm như nào**: Hướng dẫn từng bước thao tác chi tiết

## Danh sách Module

### 1. [Quản Lý Khách Hàng](./module-quan-ly-khach-hang.md)
**Quản lý thông tin People (Khách hàng cá nhân) và Companies (Công ty)**

- Tạo và quản lý hồ sơ khách hàng
- Quản lý danh bạ công ty và liên hệ
- Import/Export dữ liệu khách hàng hàng loạt
- Phân loại và gắn nhãn khách hàng
- Tìm kiếm và lọc nâng cao
- Liên kết khách hàng với cơ hội và công việc

**Dành cho**: Tất cả nhân viên bán hàng, marketing, chăm sóc khách hàng

---

### 2. [Quản Lý Cơ Hội Bán Hàng](./module-quan-ly-co-hoi-ban-hang.md)
**Theo dõi và quản lý pipeline bán hàng từ prospect đến chốt deal**

- Tạo và quản lý cơ hội (Opportunities)
- Thiết lập và theo dõi sales pipeline
- Quản lý các giai đoạn bán hàng
- Dự báo doanh thu
- Gắn cơ hội với khách hàng và công ty
- Theo dõi hoạt động và lịch sử tương tác
- Báo cáo tỷ lệ chuyển đổi

**Dành cho**: Nhân viên bán hàng, Sales Manager, Sales Director

---

### 3. [Quản Lý Công Việc và Giao Tiếp](./module-quan-ly-cong-viec-va-giao-tiep.md)
**Tích hợp quản lý công việc (Tasks), email (Messaging) và lịch (Calendar)**

#### Quản lý công việc (Tasks & Activities)
- Tạo và phân công nhiệm vụ
- Đặt deadline và mức độ ưu tiên
- Theo dõi tiến độ hoàn thành
- Nhận thông báo và nhắc nhở
- Ghi lại hoạt động (cuộc gọi, cuộc họp)
- Theo dõi thời gian làm việc

#### Quản lý email (Messaging)
- Tích hợp Gmail, Outlook
- Đồng bộ hộp thư tự động
- Gửi/nhận email trong CRM
- Tự động liên kết email với khách hàng
- Template email và email sequence
- Theo dõi email đã gửi (đã đọc, đã trả lời)

#### Quản lý lịch (Calendar)
- Tích hợp Google Calendar, Outlook Calendar
- Lên lịch cuộc họp với khách hàng
- Gửi lời mời họp
- Kiểm tra lịch trống/bận của team
- Ghi chú sau sự kiện
- Đồng bộ hai chiều

**Dành cho**: Tất cả nhân viên - đặc biệt là Sales, Marketing, Support

---

### 4. [Tự Động Hóa Workflow](./module-tu-dong-hoa-workflow.md)
**Tạo quy trình tự động để tăng hiệu suất làm việc**

- Tạo workflow tự động hóa
- Thiết lập triggers (sự kiện kích hoạt)
- Cấu hình actions (hành động thực thi)
- Tự động gửi email, tạo task, cập nhật dữ liệu
- Workflow phân công tự động
- Workflow nhắc nhở và follow-up
- Theo dõi và tối ưu workflow

**Dành cho**: System Admin, Sales Manager, Power users

---

### 5. [Báo Cáo và Phân Tích](./module-bao-cao-phan-tich.md)
**Tạo báo cáo và dashboard để theo dõi hiệu suất kinh doanh**

- Tạo và tùy chỉnh báo cáo
- Thiết kế dashboard trực quan
- Báo cáo bán hàng (sales performance)
- Phân tích pipeline và conversion rate
- Báo cáo hoạt động của team
- Dự báo doanh thu
- Export báo cáo (PDF, Excel)

**Dành cho**: Quản lý các cấp, Sales Director, Data Analyst

---

### 6. [Tích Hợp Hệ Thống](./module-tich-hop-he-thong.md)
**Kết nối Twenty CRM với các công cụ và dịch vụ bên ngoài**

- Tích hợp Gmail, Outlook (email & calendar)
- Kết nối với Slack, Microsoft Teams
- Tích hợp Zoom, Google Meet
- API để kết nối hệ thống khác
- Webhooks cho real-time sync
- Zapier/Make.com integration
- Custom integrations

**Dành cho**: IT Manager, System Admin, Developers

---

### 7. [Quản Trị Hệ Thống](./module-quan-tri-he-thong.md)
**Tùy chỉnh cấu trúc dữ liệu và phân quyền truy cập**

#### Tùy chỉnh dữ liệu (Data Model)
- Tạo đối tượng (objects) tùy chỉnh
- Thêm trường (fields) tùy chỉnh
- Thiết lập nhiều loại trường (text, number, dropdown, v.v.)
- Tạo mối quan hệ giữa các đối tượng
- Tùy chỉnh layout và hiển thị
- Validation rules
- Formula fields (tính toán tự động)
- Import/Export schema

#### Quản lý quyền (Permissions)
- Tạo và quản lý roles (vai trò)
- Phân quyền cấp đối tượng (object-level)
- Phân quyền cấp trường (field-level)
- Phân quyền cấp bản ghi (record-level)
- Sharing rules và ownership
- Quản lý quyền export và API
- Two-Factor Authentication (2FA)
- Audit trail và monitoring
- Onboarding/Offboarding users
- Compliance (GDPR, SOC2, HIPAA)

**Dành cho**: System Administrator, IT Security Manager, Compliance Officer

---

## Hướng dẫn bắt đầu

### Cho người dùng mới
1. Bắt đầu với [Module 1: Quản Lý Khách Hàng](./module-quan-ly-khach-hang.md) để làm quen với hệ thống
2. Tiếp theo [Module 2: Quản Lý Cơ Hội](./module-quan-ly-co-hoi-ban-hang.md) để hiểu quy trình bán hàng
3. Sử dụng [Module 3: Quản Lý Công Việc và Giao Tiếp](./module-quan-ly-cong-viec-va-giao-tiep.md) để tổ chức công việc hàng ngày

### Cho quản lý
1. Xem [Module 5: Báo Cáo và Phân Tích](./module-bao-cao-phan-tich.md) để theo dõi hiệu suất team
2. Sử dụng [Module 4: Tự Động Hóa](./module-tu-dong-hoa-workflow.md) để tối ưu quy trình
3. Tham khảo [Module 7: Quản Trị Hệ Thống](./module-quan-tri-he-thong.md) để phân quyền phù hợp

### Cho System Admin
1. **Ưu tiên đọc**: [Module 7: Quản Trị Hệ Thống](./module-quan-tri-he-thong.md)
2. Thiết lập [Module 6: Tích Hợp](./module-tich-hop-he-thong.md) với các công cụ hiện có
3. Tạo [Module 4: Workflow](./module-tu-dong-hoa-workflow.md) để tự động hóa

---

## Tính năng nổi bật

### 🎯 Dễ sử dụng
- Giao diện trực quan, hiện đại
- Tùy chỉnh layout theo nhu cầu
- Mobile-friendly

### 🔗 Tích hợp mạnh mẽ
- Gmail, Outlook email & calendar
- Slack, Teams messaging
- Zoom, Google Meet video calls
- API đầy đủ cho custom integration

### 🤖 Tự động hóa thông minh
- Workflow automation
- Email sequences
- Task automation
- Field auto-calculation

### 🔒 Bảo mật cao
- Role-based permissions
- Field-level security
- Two-Factor Authentication
- Audit trail đầy đủ

### 📊 Báo cáo chi tiết
- Dashboard tùy chỉnh
- Real-time analytics
- Sales forecasting
- Export linh hoạt

### 🎨 Tùy biến cao
- Custom objects & fields
- Custom layouts
- Custom workflows
- Custom integrations

---

## Lưu ý quan trọng

### Về bảo mật
- **Luôn bật 2FA** cho tài khoản có quyền admin
- **Không share passwords** hoặc API keys
- **Review permissions** định kỳ (mỗi quý)
- **Backup dữ liệu** thường xuyên

### Về dữ liệu
- **Import từ từ** để kiểm tra chất lượng dữ liệu
- **Validate data** trước khi import hàng loạt
- **Backup trước** mọi thay đổi lớn
- **Document changes** trong data model

### Về sử dụng
- **Training users** khi có thay đổi lớn
- **Test trong sandbox** trước khi áp dụng production
- **Document workflows** để dễ maintain
- **Regular cleanup** data và unused fields

---

## Hỗ trợ và tài nguyên

### Tài liệu kỹ thuật
- [Twenty Documentation](https://twenty.com/docs)
- [API Reference](https://twenty.com/api)
- [GitHub Repository](https://github.com/twentyhq/twenty)

### Cộng đồng
- [Discord Community](https://discord.gg/twenty)
- [GitHub Discussions](https://github.com/twentyhq/twenty/discussions)

### Đóng góp
Twenty là dự án mã nguồn mở. Bạn có thể đóng góp tại [GitHub](https://github.com/twentyhq/twenty).

---

## Changelog

### Phiên bản tài liệu hiện tại
- **7 modules tổng hợp** từ 12 modules ban đầu
- Gộp các modules liên quan để dễ theo dõi:
  - Tasks + Email + Calendar → **Quản Lý Công Việc và Giao Tiếp**
  - Data Model + Permissions → **Quản Trị Hệ Thống**
- Nội dung đầy đủ, không chứa code
- Hướng dẫn bằng tiếng Việt

---

## Liên hệ

Nếu có thắc mắc hoặc cần hỗ trợ, vui lòng:
- Tạo issue trên GitHub repository
- Tham gia Discord community
- Liên hệ System Administrator của tổ chức

---

**Cập nhật lần cuối**: 2024

**License**: Tài liệu này được phân phối theo giấy phép mã nguồn mở, tương ứng với Twenty CRM.

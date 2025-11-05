# Module Quản Trị Hệ Thống (Data Model & Permissions)

## Module dùng để làm gì

Module Quản Trị Hệ Thống là trung tâm điều khiển của toàn bộ CRM, cho phép quản trị viên tùy chỉnh cấu trúc dữ liệu, phân quyền truy cập, và đảm bảo an ninh thông tin. Module này kết hợp hai chức năng quan trọng: **Tùy chỉnh mô hình dữ liệu** (Data Model) và **Quản lý quyền hạn** (Permissions), giúp hệ thống CRM phù hợp với quy trình riêng của từng doanh nghiệp và bảo vệ dữ liệu nhạy cảm.

### Các chức năng chính

**Tùy chỉnh dữ liệu (Data Model):**
- Tạo đối tượng (object) mới để quản lý dữ liệu đặc thù
- Thêm trường (field) tùy chỉnh cho đối tượng có sẵn
- Thiết lập nhiều loại trường: text, number, date, dropdown, checkbox, v.v.
- Tạo mối quan hệ giữa các đối tượng (relationships)
- Tùy chỉnh layout và hiển thị dữ liệu
- Import/export cấu trúc dữ liệu

**Quản lý quyền (Permissions):**
- Tạo và quản lý vai trò (roles) trong tổ chức
- Phân quyền truy cập theo đối tượng (object-level permissions)
- Phân quyền theo trường dữ liệu (field-level permissions)
- Phân quyền theo bản ghi (record-level permissions)
- Thiết lập ownership và sharing rules
- Kiểm soát quyền xuất dữ liệu và API access
- Theo dõi lịch sử truy cập và thay đổi

## Dành cho ai

**Đối tượng sử dụng chính:**

- **System Administrator (Quản trị viên hệ thống)**:
  - Thiết kế và quản lý toàn bộ cấu trúc dữ liệu
  - Quản lý hệ thống phân quyền
  - Theo dõi và bảo trì hệ thống

- **IT Manager**:
  - Tùy chỉnh hệ thống cho phù hợp với quy trình nghiệp vụ
  - Đảm bảo an ninh dữ liệu

- **Business Analyst**:
  - Phân tích nhu cầu và thiết kế data model phù hợp
  - Đề xuất cấu trúc dữ liệu tối ưu

- **IT Security Manager**:
  - Đảm bảo an ninh dữ liệu
  - Tuân thủ quy định (GDPR, SOC2, HIPAA)

- **Giám đốc điều hành/HR Manager**:
  - Quyết định chính sách phân quyền cấp cao
  - Quản lý quyền truy cập khi nhân viên vào/ra

- **Compliance Officer**:
  - Đảm bảo tuân thủ các quy định về bảo vệ dữ liệu

## Làm như nào (Các bước thao tác)

---

## PHẦN 1: TÙY CHỈNH DỮ LIỆU (DATA MODEL)

### 1. Truy cập Data Model Settings

**Bước 1:** Nhấn vào biểu tượng Settings (⚙️) ở menu

**Bước 2:** Chọn "Data Model" hoặc "Objects & Fields"

**Bước 3:** Xem danh sách các đối tượng hiện có:
- **Standard Objects**: Đối tượng có sẵn (Person, Company, Opportunity, Task, v.v.)
- **Custom Objects**: Đối tượng tùy chỉnh đã tạo

### 2. Tạo đối tượng tùy chỉnh mới

**Bước 1:** Trong Data Model, nhấn "+ New Object"

**Bước 2:** Điền thông tin đối tượng:
- **Object Name (Singular)**: Tên số ít (VD: "Product" - Sản phẩm)
- **Object Name (Plural)**: Tên số nhiều (VD: "Products")
- **API Name**: Tên kỹ thuật (tự động tạo, VD: "product")
- **Description**: Mô tả mục đích sử dụng đối tượng
- **Icon**: Chọn biểu tượng đại diện

**Bước 3:** Chọn các tùy chọn:
- **Allow API access**: Cho phép truy cập qua API
- **Allow reports**: Cho phép tạo báo cáo từ đối tượng này
- **Track field history**: Lưu lịch sử thay đổi dữ liệu
- **Enable search**: Cho phép tìm kiếm trong đối tượng

**Bước 4:** Nhấn "Create Object"

**Bước 5:** Hệ thống tự động tạo các trường mặc định:
- ID (định danh duy nhất)
- Created By (người tạo)
- Created Date (ngày tạo)
- Last Modified By (người sửa cuối)
- Last Modified Date (ngày sửa cuối)
- Owner (người sở hữu)

**Ví dụ các đối tượng tùy chỉnh thường tạo:**
- Products (Sản phẩm)
- Projects (Dự án)
- Invoices (Hóa đơn)
- Support Tickets (Ticket hỗ trợ)
- Events (Sự kiện)
- Contracts (Hợp đồng)

### 3. Thêm trường tùy chỉnh

**Bước 1:** Chọn đối tượng cần thêm trường (standard hoặc custom)

**Bước 2:** Nhấn "+ Add Field" hoặc "New Field"

**Bước 3:** Chọn loại trường (Field Type):

**Text (Văn bản):**
- **Single Line Text**: Văn bản một dòng (VD: Tên, Email)
- **Multi-line Text**: Văn bản nhiều dòng (VD: Mô tả, Ghi chú)
- **Rich Text**: Văn bản định dạng (có bold, italic, v.v.)

**Number (Số):**
- **Number**: Số nguyên hoặc thập phân
- **Currency**: Tiền tệ (tự động format theo đơn vị tiền)
- **Percent**: Phần trăm

**Date/Time:**
- **Date**: Ngày (VD: Ngày sinh, Ngày hết hạn)
- **Date Time**: Ngày và giờ
- **Time**: Chỉ giờ

**Selection (Lựa chọn):**
- **Dropdown/Picklist**: Chọn một từ danh sách
- **Multi-select**: Chọn nhiều từ danh sách
- **Radio buttons**: Chọn một (hiển thị dạng nút radio)
- **Checkbox**: Đánh dấu có/không

**Relationship (Quan hệ):**
- **Lookup**: Liên kết đến record khác
- **Master-Detail**: Liên kết phụ thuộc
- **Many-to-Many**: Quan hệ nhiều-nhiều

**Other:**
- **Email**: Địa chỉ email
- **Phone**: Số điện thoại
- **URL**: Link website
- **File**: Tải lên file
- **Rating**: Đánh giá (sao)
- **Formula**: Tính toán tự động
- **Auto-number**: Số tự động tăng

**Bước 4:** Điền thông tin trường:
- **Field Label**: Tên hiển thị (VD: "Số lượng sản phẩm")
- **Field Name/API Name**: Tên kỹ thuật (VD: "product_quantity")
- **Description**: Mô tả cách sử dụng trường
- **Help Text**: Gợi ý cho người nhập liệu

**Bước 5:** Cấu hình các tùy chọn:
- **Required**: Bắt buộc nhập
- **Unique**: Giá trị không được trùng
- **Default value**: Giá trị mặc định
- **Min/Max value**: Giá trị tối thiểu/tối đa (cho số)
- **Max length**: Độ dài tối đa (cho text)

**Bước 6:** Nhấn "Save" để tạo trường

### 4. Tạo trường Dropdown và Dependent Picklists

**Tạo Dropdown/Picklist cơ bản:**

**Bước 1:** Chọn Field Type = "Dropdown" hoặc "Picklist"

**Bước 2:** Nhập danh sách các tùy chọn (mỗi dòng một option)

**Ví dụ cho trường "Product Category":**
```
Electronics
Clothing
Food & Beverage
Health & Beauty
Home & Garden
```

**Bước 3:** Sắp xếp thứ tự hiển thị (drag & drop)

**Bước 4:** Chọn giá trị mặc định (nếu có)

**Bước 5:** Tùy chọn:
- **Allow adding new values**: Cho phép user thêm giá trị mới
- **Restrict to list**: Chỉ chọn từ danh sách có sẵn

**Tạo Dependent Picklists:**

**Bước 1:** Tạo Controlling Field (field điều khiển):
- VD: "Product Category" với giá trị: Electronics, Clothing, Food

**Bước 2:** Tạo Dependent Field (field phụ thuộc):
- VD: "Product Subcategory"

**Bước 3:** Trong settings của Dependent Field, chọn "Set field dependencies"

**Bước 4:** Chọn Controlling Field

**Bước 5:** Map các giá trị:
```
IF Category = "Electronics"
  THEN Subcategory options: Laptops, Phones, Tablets, TVs

IF Category = "Clothing"
  THEN Subcategory options: Shirts, Pants, Shoes, Accessories

IF Category = "Food"
  THEN Subcategory options: Snacks, Beverages, Fresh Food
```

**Bước 6:** Lưu dependency

### 5. Tạo trường quan hệ (Relationship)

**Lookup Relationship:**

**Bước 1:** Chọn Field Type = "Lookup"

**Bước 2:** Chọn đối tượng liên kết (VD: Product lookup to Company)

**Bước 3:** Đặt tên cho relationship (VD: "Supplier")

**Bước 4:** Chọn:
- **Allow multiple**: Cho phép liên kết nhiều record
- **Required**: Bắt buộc phải chọn

**Bước 5:** Thiết lập "What happens when the related record is deleted":
- **Clear the value**: Xóa liên kết nhưng giữ record
- **Don't allow deletion**: Không cho xóa nếu còn liên kết
- **Delete this record too**: Xóa cả record này (cascade delete)

**Ví dụ Lookup Relationships:**
- Product → Company (Nhà cung cấp)
- Task → Person (Người liên quan)
- Invoice → Opportunity (Cơ hội đã chốt)

**Master-Detail Relationship:**

**Bước 1:** Chọn Field Type = "Master-Detail"

**Bước 2:** Chọn Master object

**Bước 3:** Đặt tên relationship

**Lưu ý:**
- Record detail bị xóa khi master bị xóa
- Quyền truy cập detail phụ thuộc vào master
- Dùng cho quan hệ phụ thuộc chặt chẽ (VD: Order → Order Items)

### 6. Tạo trường công thức (Formula Field)

**Bước 1:** Chọn Field Type = "Formula"

**Bước 2:** Chọn Return Type (kiểu dữ liệu kết quả):
- Text, Number, Date, Boolean (True/False)

**Bước 3:** Viết công thức sử dụng:
- **Fields**: Các trường khác của object
- **Operators**: +, -, *, /, =, >, <, v.v.
- **Functions**: SUM, IF, TODAY, YEAR, v.v.

**Ví dụ công thức:**

**Tính giá sau giảm:**
```
Price - (Price * Discount / 100)
```

**Tính số ngày đến deadline:**
```
DueDate - TODAY()
```

**Hiển thị Full Name:**
```
FirstName + " " + LastName
```

**Tính Age từ Birthday:**
```
YEAR(TODAY()) - YEAR(Birthday)
```

**Logic IF:**
```
IF(OpportunityValue > 100000000, "High Value", "Standard")
```

**Bước 4:** Test công thức với dữ liệu mẫu

**Bước 5:** Lưu

**Lưu ý:** Formula field tính tự động, không thể edit thủ công

### 7. Quản lý Layout của đối tượng

**Chỉnh sửa Page Layout:**

**Bước 1:** Trong Object settings, chọn "Page Layouts"

**Bước 2:** Chọn layout cần sửa (hoặc tạo mới)

**Bước 3:** Sắp xếp các trường:
- Kéo thả các field để đổi vị trí
- Nhóm các field liên quan vào Section
- Đặt số cột hiển thị (1 cột hoặc 2 cột)

**Bước 4:** Tạo các Section (phần):
- Section "Basic Information"
- Section "Contact Details"
- Section "Additional Info"
- Section "System Info"

**Bước 5:** Đánh dấu trường:
- **Read-only**: Chỉ đọc, không sửa được
- **Required**: Bắt buộc
- **Hidden**: Ẩn trường

**Bước 6:** Lưu layout

**Gán layout cho profile:**

**Bước 1:** Chọn "Layout Assignments"

**Bước 2:** Gán layout cho:
- User profile (VD: Sales Manager, Sales Rep)
- Record type (nếu có nhiều loại record)

**Bước 3:** Lưu assignment

### 8. Tùy chỉnh List View và Validation Rules

**Tùy chỉnh List View:**

**Bước 1:** Vào trang danh sách của object

**Bước 2:** Nhấn Settings hoặc icon cột

**Bước 3:** Chọn các cột muốn hiển thị, sắp xếp thứ tự, đặt độ rộng

**Bước 4:** Tạo List View mới với filter và lưu

**Thiết lập Validation Rules:**

**Bước 1:** Trong Object settings, chọn "Validation Rules"

**Bước 2:** Nhấn "+ New Rule"

**Bước 3:** Đặt tên rule (VD: "End date must be after start date")

**Bước 4:** Viết công thức điều kiện lỗi:
```
EndDate < StartDate
```

**Bước 5:** Viết Error Message:
```
Ngày kết thúc phải sau ngày bắt đầu
```

**Bước 6:** Chọn vị trí hiển thị lỗi

**Bước 7:** Lưu rule

**Ví dụ validation rules:**
- Đảm bảo giá > 0
- Bắt buộc email khi là khách hàng
- Giới hạn giảm giá tối đa 50%

### 9. Import/Export cấu trúc và Record Types

**Export metadata:**

**Bước 1:** Vào Data Model

**Bước 2:** Chọn object cần export

**Bước 3:** Nhấn "Export Schema"

**Bước 4:** Chọn định dạng: JSON (cho API, backup) hoặc Excel (dễ đọc)

**Bước 5:** Tải file về

**Import metadata:**

**Bước 1:** Chuẩn bị file schema (JSON hoặc Excel theo đúng format)

**Bước 2:** Nhấn "Import Schema"

**Bước 3:** Upload file, map các field, preview changes

**Bước 4:** Confirm import

**Tạo Record Types:**

**Bước 1:** Trong Object settings, chọn "Record Types"

**Bước 2:** Nhấn "+ New Record Type"

**Bước 3:** Đặt tên (VD: "B2B Opportunity", "B2C Opportunity")

**Bước 4:** Chọn fields và picklist values áp dụng

**Bước 5:** Gán Page Layout riêng

**Bước 6:** Lưu

**Ví dụ Record Types:**
- Opportunity: "New Business" vs "Renewal" vs "Upsell"
- Support Ticket: "Bug Report" vs "Feature Request" vs "Question"

### 10. Best Practices cho Data Model

**1. Lập kế hoạch trước:**
- Phân tích nhu cầu nghiệp vụ kỹ
- Vẽ ERD (Entity Relationship Diagram)
- Review với stakeholders

**2. Đặt tên rõ ràng:**
- Tên object và field phải mô tả đúng nội dung
- Consistent naming convention
- Tránh viết tắt khó hiểu

**3. Thêm description:**
- Mỗi object và field đều có mô tả
- Giải thích mục đích sử dụng
- Ghi ví dụ cách điền

**4. Không tạo quá nhiều custom fields:**
- Chỉ tạo field thực sự cần thiết
- Quá nhiều field làm phức tạp giao diện

**5. Sử dụng standard objects trước:**
- Tận dụng tối đa object có sẵn
- Chỉ tạo custom object khi thực sự cần

**6. Test thay đổi:**
- Test trong sandbox trước
- Không thay đổi trực tiếp trên production
- Có kế hoạch rollback

**7. Document changes:**
- Ghi lại mọi thay đổi cấu trúc
- Version history

**8. Review định kỳ:**
- Rà soát các field không dùng nữa → xóa hoặc archive
- Tối ưu layout

**9. Backup trước khi thay đổi lớn:**
- Export permission settings
- Có thể rollback nếu sai

---

## PHẦN 2: QUẢN LÝ QUYỀN (PERMISSIONS)

### 11. Hiểu các cấp độ phân quyền

**Object-level permissions (Quyền cấp đối tượng):**
- Quyền truy cập toàn bộ đối tượng (VD: Opportunities, People)
- Create, Read, Edit, Delete (CRUD)
- View All, Modify All

**Field-level permissions (Quyền cấp trường):**
- Quyền xem/sửa từng trường cụ thể
- VD: Sales Rep không thấy field "Cost Price"

**Record-level permissions (Quyền cấp bản ghi):**
- Quyền truy cập từng record cụ thể
- Dựa trên ownership, hierarchy, sharing rules

### 12. Tạo Role và thiết lập Object Permissions

**Tạo Role mới:**

**Bước 1:** Vào Settings > Roles hoặc Permissions

**Bước 2:** Nhấn "+ New Role"

**Bước 3:** Điền thông tin role:
- **Role Name**: Tên vai trò (VD: "Sales Manager", "Sales Representative")
- **Description**: Mô tả trách nhiệm và quyền hạn
- **Parent Role**: Chọn role cấp trên (nếu có hierarchy)

**Bước 4:** Nhấn "Create Role"

**Các role thường dùng:**
- CEO / General Director
- Sales Director
- Sales Manager
- Sales Representative
- Marketing Manager
- Customer Support Manager
- Support Agent
- Finance Manager
- Data Analyst (Read-only)

**Thiết lập Object Permissions:**

**Bước 1:** Chọn role cần cấu hình

**Bước 2:** Vào tab "Object Permissions"

**Bước 3:** Chọn đối tượng (VD: Opportunities)

**Bước 4:** Thiết lập quyền CRUD:
- **Create**: Tạo mới record
- **Read**: Xem record
- **Edit**: Chỉnh sửa record
- **Delete**: Xóa record
- **View All**: Xem tất cả records
- **Modify All**: Sửa tất cả records
- **Export**: Cho phép xuất dữ liệu
- **Import**: Cho phép nhập dữ liệu

**Bước 5:** Lưu permissions

**Ví dụ phân quyền Opportunities:**

**Sales Representative:**
- Create: ✓
- Read: ✓ (own records only)
- Edit: ✓ (own records only)
- Delete: ✗
- View All: ✗
- Modify All: ✗

**Sales Manager:**
- Create: ✓
- Read: ✓
- Edit: ✓
- Delete: ✓ (own team)
- View All: ✓ (team)
- Modify All: ✓ (team)

**CEO:**
- Create: ✓
- Read: ✓
- Edit: ✓
- Delete: ✓
- View All: ✓ (all)
- Modify All: ✓ (all)

### 13. Thiết lập Field Permissions

**Bước 1:** Trong role settings, vào "Field Permissions"

**Bước 2:** Chọn object

**Bước 3:** Chọn field cần phân quyền

**Bước 4:** Thiết lập cho từng role:
- **Visible**: Có thể xem
- **Read-only**: Xem được nhưng không sửa
- **Hidden**: Hoàn toàn ẩn

**Ví dụ phân quyền field "Cost Price" trong Product:**
- **Sales Rep**: Hidden
- **Sales Manager**: Read-only
- **Finance Manager**: Visible (editable)
- **CEO**: Visible

**Ví dụ phân quyền field "Commission Rate":**
- **Sales Rep**: Visible (không sửa được)
- **Sales Manager**: Read-only
- **Finance/HR**: Visible (editable)

### 14. Thiết lập Record-level Permissions và Sharing Rules

**Ownership-based access:**

**Bước 1:** Vào Settings > Sharing Settings

**Bước 2:** Chọn đối tượng (VD: Opportunities)

**Bước 3:** Thiết lập Default Access:

**Private:**
- Chỉ owner mới xem và sửa được
- Phù hợp cho dữ liệu nhạy cảm

**Public Read-Only:**
- Ai cũng xem được
- Chỉ owner mới sửa được

**Public Read/Write:**
- Ai cũng xem và sửa được
- Phù hợp cho dữ liệu shared

**Controlled by Parent:**
- Access phụ thuộc vào record cha

**Bước 4:** Lưu setting

**Grant Access Using Hierarchies:**

**Bước 1:** Vào Sharing Settings

**Bước 2:** Bật "Grant Access Using Hierarchies"

**Bước 3:** Manager tự động có quyền xem/sửa records của subordinates

**Ví dụ hierarchy:**
```
CEO
 ├── Sales Director
 │    ├── Sales Manager A
 │    │    ├── Sales Rep 1
 │    │    └── Sales Rep 2
 │    └── Sales Manager B
 │         ├── Sales Rep 3
 │         └── Sales Rep 4
```
- Sales Manager A xem được opportunities của Rep 1, Rep 2
- Sales Director xem được tất cả opportunities của team sales
- CEO xem được mọi opportunities

**Criteria-based Sharing Rules:**

**Bước 1:** Nhấn "+ New Sharing Rule"

**Bước 2:** Đặt tên rule (VD: "Share VIP accounts with management")

**Bước 3:** Chọn records để share:
- **Owned by**: Chọn users hoặc roles
- **Matching criteria**: Đặt điều kiện (VD: Account Type = "VIP")

**Bước 4:** Chọn share với ai: Users, Roles, Groups

**Bước 5:** Chọn access level: Read-only hoặc Read/Write

**Bước 6:** Lưu rule

**Ví dụ Sharing Rules:**

**Rule 1: "Share high-value deals with Sales Director"**
- Share: Opportunities where Value > 500,000,000
- With: Sales Director role
- Access: Read-only

**Rule 2: "Share Enterprise accounts with Account Management team"**
- Share: Companies where Tier = "Enterprise"
- With: Account Management group
- Access: Read/Write

### 15. Tạo Teams/Groups và phân quyền Dashboard

**Tạo Teams và Groups:**

**Bước 1:** Vào Settings > Teams hoặc Groups

**Bước 2:** Nhấn "+ New Group"

**Bước 3:** Đặt tên group (VD: "Sales Team North", "Marketing Team")

**Bước 4:** Thêm members: Chọn users từ danh sách hoặc chọn by role

**Bước 5:** Lưu group

**Sử dụng group:**
- Gán quyền cho cả group cùng lúc
- Share records với group
- Gửi email/notification cho group

**Phân quyền Dashboard và Report:**

**Bước 1:** Mở dashboard/report cần phân quyền

**Bước 2:** Nhấn "Sharing Settings"

**Bước 3:** Chọn visibility:
- **Private**: Chỉ mình tạo ra mới xem được
- **Shared with specific users/roles**: Chọn users hoặc roles cụ thể
- **Public**: Ai cũng xem được

**Bước 4:** Chọn quyền:
- **View-only**: Xem nhưng không sửa
- **Can edit**: Có thể chỉnh sửa

**Bước 5:** Lưu settings

### 16. Quản lý quyền xuất dữ liệu và API

**Quản lý quyền export:**

**Bước 1:** Vào Settings > Security > Data Export

**Bước 2:** Thiết lập quyền export cho từng role:
- Allow export (cho phép)
- Restrict export (không cho phép)
- Audit export (log mọi lần export)

**Bước 3:** Đặt giới hạn:
- Max records per export: 10,000
- Frequency limit: 5 lần/ngày
- Require approval nếu > 1,000 records

**Bước 4:** Lưu settings

**Quản lý API Access:**

**Bước 1:** Vào Settings > API Permissions

**Bước 2:** Chọn role

**Bước 3:** Thiết lập quyền API:
- Allow API access (cho phép/không cho phép)
- API permissions: Read (GET), Create (POST), Update (PUT/PATCH), Delete (DELETE)
- Rate limiting: Requests per minute/day
- IP whitelist: Chỉ cho phép từ IPs cụ thể

**Bước 4:** Generate API keys cho từng user/role

**Bước 5:** Lưu settings

### 17. Thiết lập Two-Factor Authentication (2FA)

**Bắt buộc 2FA cho roles nhạy cảm:**

**Bước 1:** Vào Settings > Security

**Bước 2:** Chọn "Two-Factor Authentication"

**Bước 3:** Bật "Require 2FA" cho:
- Administrator role
- Finance role
- Các role có quyền View All/Modify All

**Bước 4:** Chọn phương thức 2FA:
- Authenticator App (Google Authenticator, Authy)
- SMS
- Email

**Bước 5:** Grace period: Cho users 7 ngày để setup 2FA

**Bước 6:** Lưu

### 18. Audit và Monitoring

**Enable Audit Trail:**

**Bước 1:** Vào Settings > Audit Trail

**Bước 2:** Bật "Track Field History" cho các objects nhạy cảm

**Bước 3:** Chọn fields cần track:
- Opportunity Value
- Status changes
- Owner changes
- Permission changes

**Xem Audit Logs:**

**Bước 1:** Vào Reports > Audit Logs

**Bước 2:** Filter theo:
- User
- Action (Created, Edited, Deleted, Viewed, Exported)
- Object
- Date range

**Bước 3:** Xem chi tiết:
- Ai thực hiện
- Khi nào
- Thay đổi gì (old value → new value)
- IP address
- Device

**Bước 4:** Export audit log để lưu trữ hoặc báo cáo

**Setup Alerts:**

**Bước 1:** Tạo alert rule:
- Nếu có > 100 records được xóa trong 1 giờ → Alert admin
- Nếu có login từ IP lạ → Alert
- Nếu có export > 5,000 records → Alert

**Bước 2:** Chọn notification channel (Email/Slack)

**Bước 3:** Lưu alert rule

### 19. Onboarding và Offboarding User

**Onboarding User mới:**

**Bước 1:** Vào Settings > Users

**Bước 2:** Nhấn "+ Add User"

**Bước 3:** Điền thông tin: Name, Email, Job Title, Department

**Bước 4:** Assign Role: Chọn role phù hợp hoặc clone từ user khác

**Bước 5:** Assign to Team/Group: Thêm vào team sales, marketing, v.v.

**Bước 6:** Set Manager (cho role hierarchy)

**Bước 7:** Gửi Welcome Email với:
- Login credentials
- Link đến training materials
- Hướng dẫn setup 2FA

**Bước 8:** Schedule review sau 30 ngày để điều chỉnh permissions

**Offboarding User:**

**Bước 1:** Khi nhân viên nghỉ việc, deactivate user:
- Vào User settings
- Toggle "Active" sang OFF

**Bước 2:** Transfer ownership:
- Reassign tất cả opportunities/accounts của user này
- Chọn người nhận (manager hoặc team member khác)

**Bước 3:** Revoke API keys và access tokens

**Bước 4:** Remove khỏi tất cả groups và teams

**Bước 5:** (Tùy chọn) Archive user data: Giữ lại history nhưng không chiếm license

**Bước 6:** Export audit log của user để lưu trữ

**Lưu ý:** Không xóa user để giữ data integrity và audit trail

### 20. Review Permissions định kỳ

**Quarterly Permission Review:**

**Bước 1:** Tạo report "Users by Role and Permissions"

**Bước 2:** Review:
- Có ai có quá nhiều quyền?
- Có role nào không còn dùng?
- Permissions có còn phù hợp với job function?

**Bước 3:** Điều chỉnh:
- Revoke permissions không cần thiết
- Merge roles trùng lặp
- Update sharing rules

**Bước 4:** Document changes

**User Access Review:**

**Bước 1:** Quarterly, gửi email cho managers

**Bước 2:** Yêu cầu confirm:
- Team members nào cần giữ access
- Ai cần thêm/bớt quyền

**Bước 3:** Manager approve/reject

**Bước 4:** Admin thực hiện changes

### 21. Compliance và Regulations

**GDPR Compliance:**

**Right to be forgotten:**
- Có workflow xóa dữ liệu khách hàng
- Admin có quyền xóa vĩnh viễn

**Data portability:**
- User có thể export data của họ
- Provide trong format dễ đọc

**Consent management:**
- Track consent cho data collection
- Field "Marketing Consent" = Yes/No

**Data access logs:**
- Log ai xem dữ liệu cá nhân
- Retention 2 năm

**SOC 2 Compliance:**

**Access controls:**
- Role-based permissions
- 2FA mandatory
- Regular access reviews

**Audit logs:**
- Track all data changes
- Tamper-proof logs
- Retention 7 năm

**Incident response:**
- Process khi có data breach
- Notification plan

**HIPAA (nếu xử lý health data):**

**Encrypt sensitive data:**
- At rest và in transit

**Access logs:**
- Who accessed what patient data

**Minimum necessary:**
- Chỉ access dữ liệu cần thiết

### 22. Best Practices phân quyền

**1. Principle of Least Privilege:**
- Chỉ cấp quyền tối thiểu cần thiết
- Dễ mở rộng quyền sau, khó thu hồi

**2. Role-based, không phải user-based:**
- Tạo roles cho vị trí, không cho cá nhân
- Dễ quản lý khi nhân sự thay đổi

**3. Sử dụng role hierarchy:**
- Manager tự động có quyền của subordinates
- Giảm công quản lý sharing rules

**4. Sensitive data → Field-level security:**
- Salary, commission, cost → ẩn với most users
- Chỉ HR, Finance thấy

**5. Document permission model:**
- Tạo permission matrix (table)
- Roles × Objects × Permissions
- Dễ onboard admin mới

**6. Regular audits:**
- Không chờ đến có incident
- Proactive review mỗi quý

**7. Training:**
- Train users về data security
- Không share passwords
- Không export data unnecessarily

**8. Separate production và sandbox:**
- Test permissions trong sandbox
- Không test trên production

**9. Backup trước khi thay đổi lớn:**
- Export permission settings
- Có thể rollback nếu sai

**10. Monitor for anomalies:**
- Unusual login times
- Unusual data access patterns
- Mass exports
- Failed login attempts

---

## PERMISSION MATRIX MẪU

**Ví dụ Permission Matrix:**

```
|                    | CEO | Sales Dir | Sales Mgr | Sales Rep | Marketing | Finance |
|--------------------|-----|-----------|-----------|-----------|-----------|---------|
| Opportunities      |     |           |           |           |           |         |
| - Create           | ✓   | ✓         | ✓         | ✓         | ✗         | ✗       |
| - Read             | All | All       | Team      | Own       | All       | All     |
| - Edit             | All | All       | Team      | Own       | ✗         | ✗       |
| - Delete           | All | All       | Team      | ✗         | ✗         | ✗       |
| - View All         | ✓   | ✓         | ✓         | ✗         | ✗         | ✓       |
| - Export           | ✓   | ✓         | ✓         | ✗         | ✗         | ✓       |
|                    |     |           |           |           |           |         |
| People/Companies   |     |           |           |           |           |         |
| - Create           | ✓   | ✓         | ✓         | ✓         | ✓         | ✗       |
| - Read             | All | All       | All       | All       | All       | All     |
| - Edit             | All | All       | Team      | Own       | Own       | ✗       |
| - Delete           | All | All       | Team      | ✗         | ✗         | ✗       |
|                    |     |           |           |           |           |         |
| Field: Cost Price  | ✓   | R/O       | Hidden    | Hidden    | Hidden    | ✓       |
| Field: Commission  | ✓   | ✓         | R/O       | R/O       | Hidden    | ✓       |
|                    |     |           |           |           |           |         |
| Reports/Dashboards | ✓   | ✓         | ✓         | Own       | Own       | ✓       |
| Settings           | ✓   | ✗         | ✗         | ✗         | ✗         | ✗       |
```

**Legend:**
- ✓ = Full access
- R/O = Read-only
- All = All records
- Team = Team records only
- Own = Own records only
- Hidden = Cannot see
- ✗ = No access

---

## TÍCH HỢP DATA MODEL VÀ PERMISSIONS

### 23. Workflow tích hợp

**Khi tạo Custom Object mới:**

**Bước 1:** Thiết kế object và fields (Data Model)

**Bước 2:** Ngay lập tức thiết lập permissions:
- Object-level: Role nào được CRUD?
- Field-level: Field nhạy cảm ẩn với role nào?
- Record-level: Default access là gì?

**Bước 3:** Tạo sharing rules nếu cần

**Bước 4:** Test với nhiều role khác nhau

**Khi thêm Field mới:**

**Bước 1:** Tạo field (Data Model)

**Bước 2:** Thiết lập field permissions:
- Visible cho role nào?
- Read-only cho role nào?
- Hidden cho role nào?

**Bước 3:** Update page layouts theo role

**Bước 4:** Training users về field mới

### 24. Tips tối ưu hóa

**1. Start simple:**
- Bắt đầu với data model đơn giản
- Permissions cơ bản
- Mở rộng dần theo nhu cầu

**2. Document everything:**
- ERD cho data model
- Permission matrix cho roles
- Change log cho mọi thay đổi

**3. Regular cleanup:**
- Xóa unused fields
- Merge duplicate roles
- Archive inactive users

**4. Performance:**
- Không tạo quá nhiều validation rules
- Optimize formula fields
- Index các field thường search

**5. Security first:**
- Mọi custom object/field đều phải review permissions
- Mặc định restrictive, mở rộng khi cần
- Audit logs cho sensitive objects

**6. User experience:**
- Layout rõ ràng, không quá nhiều fields
- Field names dễ hiểu
- Help text hướng dẫn cách điền

**7. Testing:**
- Test mọi thay đổi trong sandbox
- Test với nhiều roles khác nhau
- UAT trước khi deploy production

**8. Backup:**
- Weekly backup metadata
- Before/after mỗi major change
- Store safely với version control

Với module Quản Trị Hệ Thống này, bạn có toàn quyền kiểm soát cấu trúc dữ liệu và bảo mật của CRM, đảm bảo hệ thống vừa linh hoạt vừa an toàn cho tổ chức.

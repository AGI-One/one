# Module Tự Động Hóa Quy Trình (Workflows)

## Module dùng để làm gì

Module Tự Động Hóa Quy Trình giúp doanh nghiệp tự động hóa các công việc lặp đi lặp lại, tiết kiệm thời gian và giảm thiểu sai sót do thao tác thủ công. Bạn có thể thiết lập các quy trình tự động kích hoạt khi có sự kiện xảy ra hoặc theo lịch định sẵn.

Các chức năng chính bao gồm:
- Tạo workflow tự động với trigger (kích hoạt) và action (hành động)
- Tự động gửi email, tạo task, cập nhật dữ liệu
- Thiết lập điều kiện logic (if/else) cho workflow
- Tự động phân công công việc
- Gửi thông báo tự động
- Tích hợp với các công cụ bên ngoài
- Lên lịch chạy workflow định kỳ
- Theo dõi và báo cáo hiệu quả workflow

## Dành cho ai

**Đối tượng sử dụng chính:**
- **Quản lý vận hành (Operations Manager)**: Thiết kế và tối ưu quy trình làm việc tự động
- **Quản lý bán hàng**: Tự động hóa quy trình nurture lead, follow-up khách hàng
- **Quản trị hệ thống**: Cấu hình workflow cho toàn tổ chức
- **Nhân viên Marketing**: Tự động hóa chiến dịch marketing, nurture campaign
- **Team leader**: Tạo workflow tự động phân công và nhắc nhở công việc

## Làm như nào (Các bước thao tác)

### 1. Tạo workflow mới

**Bước 1:** Từ menu điều hướng, chọn "Workflows" hoặc "Automation"

**Bước 2:** Nhấn "+ New Workflow"

**Bước 3:** Đặt tên workflow (VD: "Auto follow-up sau demo", "Chào mừng khách hàng mới")

**Bước 4:** (Tùy chọn) Thêm mô tả để giải thích mục đích workflow

**Bước 5:** Chọn loại workflow:
- **Automated**: Tự động kích hoạt khi có sự kiện
- **Scheduled**: Chạy theo lịch định kỳ
- **Manual**: Kích hoạt thủ công

**Bước 6:** Nhấn "Create" để bắt đầu thiết kế

### 2. Thiết lập trigger (điều kiện kích hoạt)

**Trigger khi tạo mới:**

**Bước 1:** Trong workflow builder, chọn "Trigger"

**Bước 2:** Chọn "Record created" (Bản ghi được tạo)

**Bước 3:** Chọn đối tượng:
- Person (Khách hàng mới)
- Company (Công ty mới)
- Opportunity (Cơ hội mới)
- Task (Công việc mới)

**Bước 4:** (Tùy chọn) Thêm điều kiện lọc:
- VD: Chỉ kích hoạt khi "Lead Source = Website"
- VD: Chỉ kích hoạt khi "Deal Value > 100,000,000"

**Trigger khi cập nhật:**

**Bước 1:** Chọn trigger "Record updated"

**Bước 2:** Chọn đối tượng

**Bước 3:** Chọn trường cụ thể bị thay đổi:
- VD: Khi "Opportunity Stage" thay đổi thành "Won"
- VD: Khi "Person Email" được cập nhật

**Trigger theo thời gian:**

**Bước 1:** Chọn "Scheduled trigger"

**Bước 2:** Chọn tần suất:
- Daily at (Hàng ngày lúc X giờ)
- Weekly on (Hàng tuần vào thứ X)
- Monthly on (Hàng tháng vào ngày X)

**Bước 3:** Đặt thời gian cụ thể

**Trigger thủ công:**

**Bước 1:** Chọn "Manual trigger"

**Bước 2:** Workflow chỉ chạy khi bạn nhấn nút "Run" thủ công

### 3. Thêm điều kiện logic (Conditions)

**Bước 1:** Sau trigger, nhấn "+" để thêm bước

**Bước 2:** Chọn "Condition" hoặc "If/Else"

**Bước 3:** Thiết lập điều kiện:
- **Field**: Chọn trường cần kiểm tra (VD: Lead Source)
- **Operator**: Chọn toán tử (equals, contains, greater than, v.v.)
- **Value**: Nhập giá trị so sánh (VD: "Website")

**Bước 4:** Tạo nhánh:
- **If True**: Các action chạy khi điều kiện đúng
- **If False**: Các action chạy khi điều kiện sai

**Ví dụ:**
```
IF Opportunity Value > 100,000,000
  THEN: Gửi email thông báo cho giám đốc
  ELSE: Gửi email cho sales manager
```

**Kết hợp nhiều điều kiện:**

**Bước 1:** Nhấn "Add condition"

**Bước 2:** Chọn logic operator:
- **AND**: Tất cả điều kiện phải đúng
- **OR**: Ít nhất một điều kiện đúng

**Ví dụ:**
```
IF (Lead Source = "Website" AND Deal Value > 50,000,000)
  OR (Lead Source = "Referral")
  THEN: Ưu tiên cao
```

### 4. Thêm action - Gửi email tự động

**Bước 1:** Nhấn "+" sau trigger hoặc condition

**Bước 2:** Chọn "Send Email"

**Bước 3:** Thiết lập email:
- **To**: Chọn người nhận
  - Email cụ thể
  - Email từ record (VD: {{person.email}})
  - Owner của record
  - Team member cụ thể
- **Subject**: Tiêu đề email (có thể dùng biến: "Chào {{person.firstName}}")
- **Body**: Nội dung email
  - Sử dụng template có sẵn
  - Soạn mới với các biến động: {{person.name}}, {{company.name}}
  - Định dạng rich text

**Bước 4:** (Tùy chọn) Đính kèm file

**Bước 5:** Lưu action

**Ví dụ workflow:**
```
TRIGGER: Person created
CONDITION: Lead Source = "Website"
ACTION: Send welcome email to {{person.email}}
```

### 5. Thêm action - Tạo task tự động

**Bước 1:** Thêm action "Create Task"

**Bước 2:** Điền thông tin task:
- **Title**: Tiêu đề (VD: "Gọi điện cho {{person.name}}")
- **Description**: Mô tả chi tiết
- **Assign to**: Chọn người thực hiện
  - Owner của record
  - Specific team member
  - Round-robin (phân đều cho team)
- **Due date**: Deadline
  - Fixed date (ngày cố định)
  - Relative date (VD: +3 days từ hôm nay)
- **Priority**: Low/Medium/High
- **Link to**: Tự động liên kết với record kích hoạt workflow

**Bước 3:** Lưu action

**Ví dụ:**
```
TRIGGER: Opportunity stage = "Demo completed"
ACTION: Create task "Follow up call" assigned to opportunity owner, due in 2 days
```

### 6. Thêm action - Cập nhật record

**Bước 1:** Chọn action "Update Record"

**Bước 2:** Chọn record cần cập nhật:
- Record kích hoạt workflow
- Related record (VD: Company của Person)
- Specific record

**Bước 3:** Chọn trường cần cập nhật

**Bước 4:** Nhập giá trị mới:
- Fixed value (giá trị cố định)
- Dynamic value (từ record khác)
- Formula (công thức tính toán)

**Ví dụ:**
```
TRIGGER: Opportunity won
ACTION 1: Update Opportunity > Status = "Closed Won"
ACTION 2: Update Company > Last Purchase Date = Today
ACTION 3: Update Person > Customer Type = "Active Customer"
```

### 7. Thêm delay (chờ) giữa các action

**Bước 1:** Thêm step "Delay" hoặc "Wait"

**Bước 2:** Chọn thời gian chờ:
- X minutes (X phút)
- X hours (X giờ)
- X days (X ngày)
- Until specific date/time (Đến ngày/giờ cụ thể)
- Until condition is met (Đến khi điều kiện được thỏa)

**Bước 3:** Lưu

**Ví dụ workflow nurture:**
```
TRIGGER: New lead created
ACTION 1: Send welcome email immediately
DELAY: 2 days
ACTION 2: Send product information email
DELAY: 5 days
ACTION 3: Create task "Follow-up call"
```

### 8. Tạo workflow phức tạp với nhiều nhánh

**Bước 1:** Bắt đầu với trigger

**Bước 2:** Thêm condition để phân nhánh

**Bước 3:** Mỗi nhánh có các action riêng

**Ví dụ workflow chăm sóc khách hàng theo giá trị:**
```
TRIGGER: Opportunity created
CONDITION: Deal Value
  IF > 200,000,000 (VIP)
    ACTION: Assign to senior sales manager
    ACTION: Send personalized email from CEO
    ACTION: Create task "Schedule in-person meeting within 1 day"
  ELSE IF between 50,000,000 - 200,000,000 (High value)
    ACTION: Assign to experienced sales rep
    ACTION: Send email with case studies
    ACTION: Create task "Schedule demo within 3 days"
  ELSE (Regular)
    ACTION: Assign round-robin to sales team
    ACTION: Send standard email
    ACTION: Create task "Follow up within 5 days"
```

### 9. Sử dụng biến và dữ liệu động

**Biến record hiện tại:**
- `{{person.firstName}}` - Tên khách hàng
- `{{person.email}}` - Email
- `{{company.name}}` - Tên công ty
- `{{opportunity.value}}` - Giá trị cơ hội
- `{{opportunity.stage}}` - Giai đoạn

**Biến hệ thống:**
- `{{today}}` - Ngày hôm nay
- `{{now}}` - Thời gian hiện tại
- `{{currentUser.name}}` - Tên người dùng hiện tại
- `{{workspaceName}}` - Tên workspace

**Biến tùy chỉnh:**

**Bước 1:** Thêm step "Set variable"

**Bước 2:** Đặt tên biến (VD: "daysToDeadline")

**Bước 3:** Gán giá trị (có thể dùng công thức)

**Bước 4:** Sử dụng biến trong các action tiếp theo: `{{daysToDeadline}}`

### 10. Tích hợp với công cụ bên ngoài

**Gửi webhook:**

**Bước 1:** Thêm action "Send Webhook"

**Bước 2:** Nhập URL webhook của dịch vụ bên ngoài

**Bước 3:** Chọn method (POST/GET/PUT)

**Bước 4:** Thêm headers nếu cần

**Bước 5:** Tạo JSON payload với dữ liệu từ record

**Tích hợp Slack:**

**Bước 1:** Kết nối Slack trong Settings > Integrations

**Bước 2:** Thêm action "Send Slack Message"

**Bước 3:** Chọn channel

**Bước 4:** Soạn message (có thể dùng biến)

**Ví dụ:**
```
TRIGGER: Opportunity value > 500,000,000
ACTION: Send Slack message to #sales-team
  "🎉 Big deal alert! {{opportunity.name}} worth {{opportunity.value}} just created!"
```

**Tích hợp Zapier/Make:**

**Bước 1:** Sử dụng webhook để kết nối

**Bước 2:** Trigger Twenty workflow gửi data qua webhook

**Bước 3:** Zapier/Make nhận data và thực hiện action tiếp theo

### 11. Test và debug workflow

**Test workflow:**

**Bước 1:** Trong workflow builder, nhấn "Test"

**Bước 2:** Chọn record mẫu để test

**Bước 3:** Chạy test và xem kết quả từng bước

**Bước 4:** Kiểm tra:
- Trigger có kích hoạt đúng không
- Condition đánh giá đúng không
- Action thực hiện thành công không
- Email gửi đúng nội dung không
- Task tạo với thông tin chính xác không

**Xem execution log:**

**Bước 1:** Vào workflow details

**Bước 2:** Chọn tab "Execution History" hoặc "Runs"

**Bước 3:** Xem danh sách các lần workflow đã chạy:
- Thời gian chạy
- Trigger record
- Status (Success/Failed)
- Các action đã thực hiện

**Bước 4:** Nhấn vào một execution để xem chi tiết từng bước

**Debug khi có lỗi:**

**Bước 1:** Tìm execution bị lỗi trong history

**Bước 2:** Xem error message

**Bước 3:** Kiểm tra bước nào bị fail

**Bước 4:** Sửa lỗi trong workflow:
- Condition logic sai
- Biến không tồn tại
- Email template lỗi
- Permission không đủ

**Bước 5:** Test lại

### 12. Kích hoạt và quản lý workflow

**Kích hoạt workflow:**

**Bước 1:** Sau khi thiết kế xong, chuyển trạng thái sang "Active"

**Bước 2:** Toggle switch "Active" sang ON

**Bước 3:** Xác nhận kích hoạt

**Bước 4:** Workflow bắt đầu tự động chạy

**Tạm dừng workflow:**

**Bước 1:** Toggle "Active" sang OFF

**Bước 2:** Workflow dừng nhận trigger mới (các execution đang chạy vẫn tiếp tục)

**Sao chép workflow:**

**Bước 1:** Mở workflow cần sao chép

**Bước 2:** Nhấn "..." > "Duplicate"

**Bước 3:** Đặt tên mới

**Bước 4:** Chỉnh sửa nếu cần

**Bước 5:** Kích hoạt

**Xóa workflow:**

**Bước 1:** Tắt workflow trước (set Inactive)

**Bước 2:** Nhấn "..." > "Delete"

**Bước 3:** Xác nhận xóa

**Lưu ý:** Execution history vẫn được giữ lại

### 13. Tạo workflow templates

**Tạo template từ workflow:**

**Bước 1:** Tạo và test workflow hoàn chỉnh

**Bước 2:** Nhấn "Save as template"

**Bước 3:** Đặt tên template (VD: "Lead nurturing sequence")

**Bước 4:** Thêm mô tả và hướng dẫn sử dụng

**Bước 5:** Lưu template

**Sử dụng template:**

**Bước 1:** Khi tạo workflow mới, chọn "Create from template"

**Bước 2:** Chọn template muốn dùng

**Bước 3:** Workflow được tạo với cấu trúc sẵn

**Bước 4:** Tùy chỉnh cho phù hợp với nhu cầu

**Bước 5:** Kích hoạt

### 14. Các workflow template thường dùng

**1. Welcome new customer:**
```
TRIGGER: Person created with Lead Source = "Website"
ACTION 1: Send welcome email
DELAY: 1 day
ACTION 2: Send product overview email
DELAY: 3 days
ACTION 3: Create task "Check-in call" for sales rep
```

**2. Follow-up after demo:**
```
TRIGGER: Task "Demo" marked as Done
ACTION 1: Send thank you email
DELAY: 2 days
CONDITION: If no response
  ACTION: Create task "Follow-up call"
  DELAY: 3 days
  CONDITION: Still no response
    ACTION: Send last chance email
```

**3. Deal won celebration:**
```
TRIGGER: Opportunity stage = "Won"
ACTION 1: Send congratulations email to customer
ACTION 2: Send Slack notification to team
ACTION 3: Create onboarding tasks for customer success team
ACTION 4: Update company status to "Active Customer"
```

**4. Deal lost analysis:**
```
TRIGGER: Opportunity stage = "Lost"
ACTION 1: Create task "Post-mortem analysis" for sales manager
ACTION 2: Send survey email to prospect asking for feedback
ACTION 3: Update person status to "Nurture"
DELAY: 90 days
ACTION 4: Create task "Re-engage" for sales rep
```

**5. Task overdue reminder:**
```
TRIGGER: Scheduled daily at 9 AM
CONDITION: Find tasks where Due Date < Today AND Status != Done
ACTION: Send email reminder to task owner
ACTION: Send Slack message to manager if task is high priority
```

### 15. Giám sát và tối ưu workflow

**Xem analytics:**

**Bước 1:** Vào workflow details

**Bước 2:** Chọn tab "Analytics" hoặc "Performance"

**Bước 3:** Xem các chỉ số:
- **Total runs**: Tổng số lần chạy
- **Success rate**: Tỷ lệ thành công
- **Average execution time**: Thời gian chạy trung bình
- **Active workflows**: Số workflow đang chạy

**Bước 4:** Phân tích từng action:
- Action nào chạy lâu nhất
- Action nào hay bị lỗi
- Email nào có tỷ lệ mở cao

**Tối ưu hiệu suất:**

**Bước 1:** Xác định bottleneck (điểm nghẽn)

**Bước 2:** Tối ưu:
- Giảm số lượng action không cần thiết
- Kết hợp nhiều action thành một nếu có thể
- Tối ưu condition để giảm nhánh không cần thiết
- Sử dụng cache cho data thường dùng

**Bước 3:** Test lại sau khi tối ưu

**Bước 4:** So sánh performance trước và sau

### 16. Best practices

**1. Đặt tên rõ ràng:**
- Tên workflow mô tả mục đích: "Auto-assign leads from website"
- Tên action rõ ràng: "Send welcome email" thay vì "Email 1"

**2. Thêm mô tả:**
- Giải thích tại sao tạo workflow này
- Ghi chú các điều kiện đặc biệt
- Lưu ý khi chỉnh sửa

**3. Test kỹ trước khi activate:**
- Test với nhiều case khác nhau
- Test edge cases (trường hợp đặc biệt)
- Đảm bảo không làm spam email

**4. Theo dõi thường xuyên:**
- Kiểm tra execution history hàng tuần
- Xem có lỗi không
- Điều chỉnh nếu cần

**5. Backup workflow:**
- Export workflow quan trọng
- Lưu version khi thay đổi lớn

**6. Phân quyền:**
- Chỉ cho phép người hiểu biết tạo workflow
- Review workflow trước khi activate
- Document lại các workflow quan trọng

**7. Không lạm dụng:**
- Không tạo quá nhiều workflow chồng chéo
- Tránh vòng lặp vô hạn
- Giới hạn số lượng email tự động cho một người

**Lưu ý an toàn:**
- Workflow có thể tạo/sửa/xóa dữ liệu hàng loạt
- Luôn test trước khi activate
- Bắt đầu với phạm vi nhỏ, mở rộng dần
- Có kế hoạch rollback nếu có vấn đề

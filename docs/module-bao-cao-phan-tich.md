# Module Báo Cáo và Phân Tích (Reports & Dashboards)

## Module dùng để làm gì

Module Báo Cáo và Phân Tích giúp doanh nghiệp trực quan hóa dữ liệu kinh doanh, theo dõi các chỉ số quan trọng (KPI), phát hiện xu hướng và đưa ra quyết định dựa trên dữ liệu. Module này chuyển đổi dữ liệu thô từ CRM thành thông tin có giá trị thông qua biểu đồ, bảng số liệu và dashboard tương tác.

Các chức năng chính bao gồm:
- Tạo báo cáo tùy chỉnh từ bất kỳ đối tượng nào
- Xây dựng dashboard với nhiều widget và biểu đồ
- Theo dõi KPI realtime (doanh thu, conversion rate, v.v.)
- Lọc và phân nhóm dữ liệu theo nhiều chiều
- Tạo biểu đồ: cột, tròn, đường, funnel, v.v.
- Lên lịch gửi báo cáo tự động
- Chia sẻ dashboard với team
- Xuất báo cáo dưới nhiều định dạng

## Dành cho ai

**Đối tượng sử dụng chính:**
- **Giám đốc điều hành**: Xem tổng quan tình hình kinh doanh, theo dõi mục tiêu
- **Quản lý bán hàng**: Phân tích hiệu suất team, dự báo doanh thu, xác định xu hướng
- **Nhân viên bán hàng**: Theo dõi cá nhân performance, pipeline của mình
- **Marketing Manager**: Đo lường ROI chiến dịch, phân tích nguồn lead
- **Business Analyst**: Phân tích sâu dữ liệu, tìm insights
- **Finance**: Theo dõi doanh thu thực tế, so sánh với dự báo

## Làm như nào (Các bước thao tác)

### 1. Tạo báo cáo đơn giản

**Bước 1:** Từ menu, chọn "Reports" hoặc "Analytics"

**Bước 2:** Nhấn "+ New Report"

**Bước 3:** Chọn đối tượng dữ liệu làm nguồn:
- Opportunities (Cơ hội)
- People (Khách hàng)
- Companies (Công ty)
- Tasks (Công việc)
- Hoặc Custom Objects

**Bước 4:** Chọn loại báo cáo:
- **Tabular**: Bảng danh sách đơn giản
- **Summary**: Bảng có tổng kết theo nhóm
- **Matrix**: Bảng chéo hai chiều

**Bước 5:** Nhấn "Create"

**Bước 6:** Chọn các cột hiển thị (Fields):
- Kéo field từ sidebar vào báo cáo
- Hoặc tích chọn field muốn hiển thị

**Bước 7:** Nhấn "Run Report" để xem kết quả

**Bước 8:** Đặt tên và lưu báo cáo

### 2. Thêm bộ lọc vào báo cáo

**Bước 1:** Trong Report Builder, chọn "Filters"

**Bước 2:** Nhấn "+ Add Filter"

**Bước 3:** Chọn field cần lọc (VD: "Created Date")

**Bước 4:** Chọn operator:
- Equals (Bằng)
- Not equals (Không bằng)
- Greater than (Lớn hơn)
- Less than (Nhỏ hơn)
- Contains (Chứa)
- Between (Trong khoảng)

**Bước 5:** Nhập giá trị lọc:
- VD: Created Date = "This Month"
- VD: Opportunity Value > 100,000,000
- VD: Status = "Active"

**Bước 6:** Thêm nhiều filter và chọn logic:
- **AND**: Tất cả điều kiện phải đúng
- **OR**: Ít nhất một điều kiện đúng

**Bước 7:** Run lại báo cáo để xem kết quả đã lọc

**Các filter thời gian thường dùng:**
- Today (Hôm nay)
- Yesterday (Hôm qua)
- This Week (Tuần này)
- Last Week (Tuần trước)
- This Month (Tháng này)
- This Quarter (Quý này)
- This Year (Năm nay)
- Last 30 days (30 ngày qua)
- Custom range (Tùy chỉnh khoảng)

### 3. Nhóm và tổng kết dữ liệu

**Summary Report:**

**Bước 1:** Chọn Report Type = "Summary"

**Bước 2:** Chọn field để group by (nhóm theo):
- VD: Group by "Opportunity Owner" (Người phụ trách)
- VD: Group by "Lead Source" (Nguồn khách hàng)
- VD: Group by "Created Date" (theo tháng)

**Bước 3:** Chọn hàm tổng kết cho các cột số:
- **SUM**: Tổng cộng
- **AVERAGE**: Trung bình
- **COUNT**: Đếm số lượng
- **MAX**: Giá trị lớn nhất
- **MIN**: Giá trị nhỏ nhất

**Bước 4:** Run report

**Kết quả:** Dữ liệu được nhóm và hiển thị tổng kết ở cuối mỗi nhóm

**Ví dụ báo cáo:**
```
Opportunity by Owner (Tháng này)

Owner          | Count | Total Value      | Avg Value
---------------|-------|------------------|-------------
Nguyễn Văn A   | 15    | 500,000,000     | 33,333,333
Trần Thị B     | 12    | 380,000,000     | 31,666,667
Lê Văn C       | 10    | 420,000,000     | 42,000,000
---------------|-------|------------------|-------------
TOTAL          | 37    | 1,300,000,000   | 35,135,135
```

### 4. Tạo Matrix Report (báo cáo chéo)

**Bước 1:** Chọn Report Type = "Matrix"

**Bước 2:** Chọn Row Grouping (nhóm theo hàng):
- VD: "Lead Source"

**Bước 3:** Chọn Column Grouping (nhóm theo cột):
- VD: "Opportunity Stage"

**Bước 4:** Chọn metric hiển thị (giá trị trong ô):
- VD: SUM of "Opportunity Value"

**Bước 5:** Run report

**Kết quả:** Bảng chéo hiển thị dữ liệu theo hai chiều

**Ví dụ:**
```
                | Prospecting | Proposal | Negotiation | Won     | TOTAL
----------------|-------------|----------|-------------|---------|--------
Website         | 100M        | 200M     | 150M        | 300M    | 750M
Referral        | 80M         | 120M     | 100M        | 250M    | 550M
Event           | 50M         | 80M      | 60M         | 150M    | 340M
----------------|-------------|----------|-------------|---------|--------
TOTAL           | 230M        | 400M     | 310M        | 700M    | 1,640M
```

### 5. Tạo biểu đồ từ báo cáo

**Bước 1:** Sau khi tạo summary/matrix report, nhấn "Add Chart"

**Bước 2:** Chọn loại biểu đồ:

**Column Chart (Biểu đồ cột):**
- So sánh giá trị giữa các nhóm
- VD: Doanh thu theo tháng, theo nhân viên

**Bar Chart (Biểu đồ thanh ngang):**
- Tương tự column nhưng ngang
- Phù hợp khi có nhiều category

**Line Chart (Biểu đồ đường):**
- Hiển thị xu hướng theo thời gian
- VD: Số lead mới theo tuần

**Pie Chart (Biểu đồ tròn):**
- Hiển thị tỷ lệ phần trăm
- VD: Phân bổ cơ hội theo nguồn

**Donut Chart:**
- Tương tự pie chart nhưng có lỗ giữa

**Funnel Chart:**
- Hiển thị conversion qua các giai đoạn
- VD: Sales pipeline từ lead đến won

**Area Chart:**
- Biểu đồ vùng, hiển thị xu hướng tích lũy

**Scatter Plot:**
- Biểu đồ phân tán, tìm correlation

**Bước 3:** Cấu hình biểu đồ:
- **X-axis**: Trục hoành (thường là category hoặc thời gian)
- **Y-axis**: Trục tung (giá trị số)
- **Series**: Dữ liệu biểu diễn
- **Colors**: Chọn màu sắc

**Bước 4:** Tùy chỉnh tiêu đề, nhãn, legend

**Bước 5:** Lưu chart

### 6. Tạo Dashboard

**Bước 1:** Vào "Dashboards"

**Bước 2:** Nhấn "+ New Dashboard"

**Bước 3:** Đặt tên dashboard (VD: "Sales Performance", "Marketing Overview")

**Bước 4:** Chọn layout:
- 1 column
- 2 columns
- 3 columns
- Grid (lưới tự do)

**Bước 5:** Nhấn "Create"

### 7. Thêm widgets vào Dashboard

**Thêm Chart Widget:**

**Bước 1:** Nhấn "+ Add Component" hoặc kéo biểu tượng vào dashboard

**Bước 2:** Chọn "Chart"

**Bước 3:** Chọn báo cáo đã tạo trước hoặc tạo chart mới

**Bước 4:** Điều chỉnh kích thước widget (resize)

**Bước 5:** Đặt vị trí (drag & drop)

**Thêm Metric Widget (số liệu):**

**Bước 1:** Chọn component type "Metric" hoặc "Number"

**Bước 2:** Chọn dữ liệu nguồn

**Bước 3:** Chọn metric:
- Total Opportunities (Tổng số cơ hội)
- Total Revenue (Tổng doanh thu)
- Average Deal Size (Giá trị TB mỗi deal)
- Win Rate (Tỷ lệ thắng)

**Bước 4:** Tùy chỉnh:
- Font size
- Color (màu xanh nếu tốt, đỏ nếu xấu)
- Prefix/Suffix (VD: "$" hoặc "đ")
- Decimal places (số thập phân)

**Bước 5:** Thêm comparison (so sánh):
- So với tháng trước
- So với quý trước
- So với mục tiêu
- Hiển thị % tăng/giảm với mũi tên

**Thêm Table Widget:**

**Bước 1:** Chọn "Table"

**Bước 2:** Chọn báo cáo tabular

**Bước 3:** Widget hiển thị bảng dữ liệu với scroll

**Thêm Gauge Widget (đồng hồ):**

**Bước 1:** Chọn "Gauge"

**Bước 2:** Chọn metric (VD: Revenue achieved)

**Bước 3:** Đặt target (VD: Target = 1,000,000,000)

**Bước 4:** Gauge hiển thị % đạt được

**Bước 5:** Đặt color zones:
- 0-50%: Red
- 50-80%: Yellow
- 80-100%: Green

### 8. Tạo KPI Dashboard

**Ví dụ Sales KPI Dashboard:**

**Bước 1:** Tạo dashboard "Sales KPIs"

**Bước 2:** Thêm các Metric widgets:

**Row 1 - Core Metrics:**
- Total Revenue (This Month)
- New Opportunities (This Month)
- Win Rate (This Month)
- Average Deal Size

**Row 2 - Comparison:**
- Revenue vs Last Month (với % change)
- Revenue vs Target
- Pipeline Value
- Forecast

**Row 3 - Charts:**
- Column chart: Revenue by Month (6 tháng)
- Funnel chart: Pipeline by Stage
- Pie chart: Revenue by Product

**Row 4 - Team Performance:**
- Table: Top Performers (by revenue)
- Bar chart: Opportunities by Owner

**Bước 3:** Đặt auto-refresh (tự động làm mới)

**Bước 4:** Lưu và chia sẻ

### 9. Lọc Dashboard động

**Bước 1:** Trong Dashboard, nhấn "Add Filter"

**Bước 2:** Chọn field để filter:
- Date Range
- Owner
- Product
- Region

**Bước 3:** Đặt filter lên top của dashboard

**Bước 4:** Khi user chọn giá trị filter, tất cả widgets tự động cập nhật

**Ví dụ:**
- Filter "Time Period": User chọn "Last Quarter"
- Tất cả chart và metric hiển thị data của Last Quarter

**Cross-filtering:**
- Khi nhấn vào một phần của chart
- Các widget khác filter theo phần đó
- VD: Click vào "Website" trong pie chart → các chart khác chỉ hiển thị data từ Website

### 10. Lên lịch gửi báo cáo tự động

**Bước 1:** Mở báo cáo hoặc dashboard

**Bước 2:** Nhấn "Schedule" hoặc "Subscribe"

**Bước 3:** Thiết lập lịch:
- **Frequency**: Daily/Weekly/Monthly
- **Day**: Chọn thứ mấy (nếu weekly) hoặc ngày (nếu monthly)
- **Time**: Chọn giờ gửi
- **Time zone**: Chọn múi giờ

**Bước 4:** Chọn người nhận:
- Thêm email
- Chọn từ danh sách users
- Chọn team/group

**Bước 5:** Chọn định dạng gửi:
- **PDF**: File báo cáo PDF
- **Excel**: File dữ liệu
- **Link**: Link xem online
- **Embedded**: Nhúng chart vào email

**Bước 6:** Thêm message (tùy chọn)

**Bước 7:** Lưu schedule

**Kết quả:** Báo cáo tự động gửi theo lịch đã đặt

### 11. Chia sẻ Dashboard và Report

**Chia sẻ với cá nhân:**

**Bước 1:** Mở dashboard/report

**Bước 2:** Nhấn "Share"

**Bước 3:** Nhập email người muốn share

**Bước 4:** Chọn quyền:
- **View**: Chỉ xem
- **Edit**: Có thể chỉnh sửa

**Bước 5:** Gửi

**Chia sẻ với team/public:**

**Bước 1:** Nhấn "Share"

**Bước 2:** Chọn "Share with team" hoặc "Make public"

**Bước 3:** Tạo shareable link

**Bước 4:** (Tùy chọn) Đặt password protection

**Bước 5:** Copy link và gửi cho người cần

**Embed vào website:**

**Bước 1:** Tạo public dashboard

**Bước 2:** Nhấn "Embed"

**Bước 3:** Copy embed code (iframe)

**Bước 4:** Paste vào website

**Kết quả:** Dashboard hiển thị trực tiếp trên website

### 12. Xuất báo cáo

**Xuất PDF:**

**Bước 1:** Mở report/dashboard

**Bước 2:** Nhấn "Export" > "PDF"

**Bước 3:** Chọn tùy chọn:
- Page orientation (Portrait/Landscape)
- Page size (A4/Letter)
- Include charts (có/không)

**Bước 4:** Tải PDF về

**Xuất Excel/CSV:**

**Bước 1:** Mở report

**Bước 2:** Nhấn "Export" > "Excel" hoặc "CSV"

**Bước 3:** Chọn:
- Current view (chỉ dữ liệu đang hiển thị)
- All data (tất cả dữ liệu sau filter)

**Bước 4:** Tải file về

**Xuất PowerPoint:**

**Bước 1:** Mở dashboard

**Bước 2:** Nhấn "Export" > "PowerPoint"

**Bước 3:** Mỗi widget thành một slide

**Bước 4:** Tải PPTX về để trình bày

### 13. Tạo báo cáo so sánh

**Year-over-Year Comparison:**

**Bước 1:** Tạo báo cáo với group by "Month"

**Bước 2:** Thêm filter: Date in "This Year"

**Bước 3:** Thêm column "Last Year Same Period"

**Bước 4:** Thêm column "YoY Growth %"

**Bước 5:** Tạo chart line với 2 series: This Year vs Last Year

**Month-over-Month:**

**Bước 1:** Group by "Month"

**Bước 2:** Thêm calculated column:
```
MoM Change = (This Month - Last Month) / Last Month * 100
```

**Bước 3:** Tạo combo chart:
- Column: Revenue by month
- Line: MoM Change %

**Actual vs Target:**

**Bước 1:** Tạo custom field "Target" cho Opportunity/Sales

**Bước 2:** Tạo báo cáo so sánh:
- Column 1: Actual Revenue
- Column 2: Target
- Column 3: Gap (Target - Actual)
- Column 4: Achievement % (Actual/Target)

**Bước 3:** Tạo chart:
- Column chart: Actual vs Target
- Line: Achievement %

### 14. Tạo Funnel Report

**Bước 1:** Tạo report từ Opportunities

**Bước 2:** Group by "Stage"

**Bước 3:** Metric: Count của Opportunities

**Bước 4:** Sắp xếp stages theo thứ tự pipeline:
- Lead
- Qualified
- Proposal
- Negotiation
- Closed Won

**Bước 5:** Tạo Funnel Chart

**Bước 6:** Thêm conversion rate giữa các stage:
```
Conversion Rate = (Opportunities in next stage / Opportunities in current stage) * 100
```

**Ví dụ kết quả:**
```
Lead (1000)           → 100%
  ↓ Conv: 50%
Qualified (500)       → 50%
  ↓ Conv: 60%
Proposal (300)        → 30%
  ↓ Conv: 67%
Negotiation (200)     → 20%
  ↓ Conv: 50%
Won (100)             → 10%
```

### 15. Tạo Cohort Analysis

**Bước 1:** Tạo report group by "Sign-up Month" (tháng khách hàng đăng ký)

**Bước 2:** Tạo matrix:
- Rows: Cohort (tháng sign-up)
- Columns: Months since sign-up (0, 1, 2, 3...)
- Metric: Retention % hoặc Revenue

**Bước 3:** Visualize bằng heat map

**Kết quả:** Thấy được cohort nào có retention cao, revenue cao

### 16. Real-time Dashboard

**Bước 1:** Tạo dashboard với các metrics realtime:
- Opportunities created today
- Calls made today
- Emails sent today
- Tasks completed today

**Bước 2:** Đặt auto-refresh:
- Nhấn Settings
- Chọn "Auto-refresh every"
- Chọn interval (1 min, 5 min, 15 min)

**Bước 3:** Display dashboard trên TV/monitor trong văn phòng

**Bước 4:** Team theo dõi progress realtime

### 17. Best Practices

**1. Bắt đầu với mục tiêu rõ ràng:**
- Câu hỏi nào cần trả lời?
- KPI nào cần theo dõi?
- Ai sẽ dùng report/dashboard này?

**2. Keep it simple:**
- Không nhồi nhét quá nhiều widget
- 6-8 widgets tối đa trên một dashboard
- Focus vào metrics quan trọng nhất

**3. Sử dụng màu sắc hiệu quả:**
- Green cho positive (tăng, tốt)
- Red cho negative (giảm, xấu)
- Consistent color scheme

**4. Add context:**
- So sánh với baseline (last month, target)
- Thêm trend (tăng/giảm)
- Giải thích metric (add description)

**5. Optimize performance:**
- Giới hạn số lượng records
- Dùng filter để giảm data load
- Cache kết quả nếu có thể

**6. Document dashboards:**
- Ghi chú công thức tính metric
- Giải thích nguồn dữ liệu
- Hướng dẫn cách đọc dashboard

**7. Review và update:**
- Review metrics định kỳ (quarterly)
- Xóa reports/dashboards không dùng
- Update theo business changes

**8. Test before sharing:**
- Kiểm tra data accuracy
- Test trên nhiều browsers
- Đảm bảo permissions đúng

**9. Đặt tên có ý nghĩa:**
- "Sales Dashboard - APAC Region"
- "Monthly Revenue Report - 2024"
- Tránh "Dashboard 1", "Report Final v3"

**10. Security:**
- Chỉ share data với người có quyền
- Sensitive data cần restrict access
- Audit log để track ai xem gì

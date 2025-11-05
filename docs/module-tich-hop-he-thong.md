# Module Tích Hợp Hệ Thống (Integrations)

## Module dùng để làm gì

Module Tích Hợp giúp kết nối hệ thống CRM Twenty với các ứng dụng và dịch vụ bên ngoài, tạo ra một hệ sinh thái làm việc đồng bộ và tự động hóa. Thay vì làm việc trên nhiều nền tảng riêng lẻ, dữ liệu được đồng bộ tự động giữa các hệ thống, giúp tiết kiệm thời gian và giảm thiểu sai sót.

Các chức năng chính bao gồm:
- Kết nối với email (Gmail, Outlook)
- Đồng bộ calendar (Google Calendar, Outlook Calendar)
- Tích hợp communication tools (Slack, Teams)
- Kết nối marketing platforms (Mailchimp, HubSpot)
- Tích hợp accounting systems (QuickBooks, Xero)
- Kết nối video conferencing (Zoom, Google Meet)
- API và Webhooks cho custom integrations
- Zapier/Make.com cho no-code integrations

## Dành cho ai

**Đối tượng sử dụng chính:**
- **System Administrator**: Cấu hình và quản lý tất cả integrations
- **IT Manager**: Thiết kế kiến trúc tích hợp, đảm bảo data flow
- **Operations Manager**: Tự động hóa quy trình cross-platform
- **Marketing Manager**: Tích hợp marketing tools để sync campaigns
- **Sales Teams**: Sử dụng integrations đã setup để làm việc hiệu quả
- **Developers**: Tạo custom integrations qua API

## Làm như nào (Các bước thao tác)

### 1. Truy cập Integration Settings

**Bước 1:** Nhấn Settings (⚙️) ở menu

**Bước 2:** Chọn "Integrations" hoặc "Connected Apps"

**Bước 3:** Xem danh sách:
- **Connected**: Các integrations đã kết nối
- **Available**: Integrations có thể kết nối
- **Custom**: API và webhooks tự tạo

### 2. Kết nối Gmail/Google Workspace

**Bước 1:** Trong Integrations, tìm "Gmail" hoặc "Google Workspace"

**Bước 2:** Nhấn "Connect"

**Bước 3:** Chọn tài khoản Google muốn kết nối

**Bước 4:** Cho phép Twenty truy cập:
- Gmail (đọc, gửi, quản lý email)
- Google Calendar (đọc, tạo sự kiện)
- Google Contacts (đồng bộ danh bạ)

**Bước 5:** Nhấn "Allow" để cấp quyền

**Bước 6:** Cấu hình đồng bộ:
- **Email sync direction**: Two-way (hai chiều)
- **Calendar sync**: Enabled
- **Sync from date**: Last 30 days
- **Auto-link emails**: Tự động gắn email với contacts

**Bước 7:** Nhấn "Save" và chờ đồng bộ ban đầu

**Lưu ý:** Có thể kết nối nhiều Gmail accounts nếu cần

### 3. Kết nối Outlook/Microsoft 365

**Bước 1:** Tìm "Outlook" hoặc "Microsoft 365"

**Bước 2:** Nhấn "Connect"

**Bước 3:** Đăng nhập Microsoft

**Bước 4:** Cho phép truy cập:
- Outlook Mail
- Outlook Calendar
- Contacts

**Bước 5:** Cấu hình tương tự Gmail

**Bước 6:** Lưu và đồng bộ

### 4. Tích hợp Slack

**Bước 1:** Tìm "Slack" trong Integrations

**Bước 2:** Nhấn "Connect to Slack"

**Bước 3:** Chọn Slack workspace

**Bước 4:** Cho phép Twenty bot vào workspace

**Bước 5:** Cấu hình notifications:

**Notify when:**
- New lead created → Post to #sales channel
- Deal won → Post to #wins channel
- Deal lost → Post to #sales-manager channel
- Task overdue → DM to task owner
- New contact from website → #marketing

**Bước 6:** Thiết lập format message:
```
New Lead Alert! 🎯
Name: {{person.name}}
Company: {{company.name}}
Source: {{leadSource}}
Value: {{estimatedValue}}
Assigned to: @{{owner}}
```

**Bước 7:** Test integration bằng cách gửi test message

**Bước 8:** Lưu settings

**Sử dụng Slack commands:**
- `/twenty search [name]`: Tìm contact
- `/twenty create lead`: Tạo lead mới
- `/twenty my tasks`: Xem tasks của mình

### 5. Tích hợp Zoom

**Bước 1:** Tìm "Zoom" trong Integrations

**Bước 2:** Nhấn "Connect Zoom"

**Bước 3:** Authorize Twenty Zoom app

**Bước 4:** Cấu hình:
- **Auto-create Zoom links**: Khi tạo meeting trong CRM, tự động tạo Zoom link
- **Sync recordings**: Tự động lưu recordings vào CRM
- **Add participants to CRM**: Tự động tạo contacts từ Zoom participants

**Bước 5:** Lưu

**Sử dụng:**
- Khi lên lịch meeting, tích "Add Zoom meeting"
- Link Zoom tự động tạo và gửi cho attendees
- Sau meeting, recording tự động attach vào opportunity/contact

### 6. Tích hợp Mailchimp

**Bước 1:** Tìm "Mailchimp"

**Bước 2:** Nhấn "Connect"

**Bước 3:** Đăng nhập Mailchimp và authorize

**Bước 4:** Chọn Mailchimp audience cần sync

**Bước 5:** Map fields:

```
CRM Field          →  Mailchimp Field
-----------------------------------------
Email              →  Email
First Name         →  FNAME
Last Name          →  LNAME
Company            →  COMPANY
Phone              →  PHONE
```

**Bước 6:** Thiết lập sync rules:
- **Sync direction**: CRM → Mailchimp (one-way)
- **Sync frequency**: Every 1 hour
- **Filter**: Chỉ sync contacts có "Marketing Consent = Yes"

**Bước 7:** Thiết lập campaign tracking:
- Track email opens trong CRM
- Track link clicks
- Update contact status based on engagement

**Bước 8:** Lưu và bắt đầu sync

**Kết quả:**
- Contacts trong CRM tự động thêm vào Mailchimp
- Campaign stats hiển thị trong CRM
- Unsubscribes tự động cập nhật

### 7. Tích hợp QuickBooks (Kế toán)

**Bước 1:** Tìm "QuickBooks" trong Integrations

**Bước 2:** Connect và authorize

**Bước 3:** Cấu hình sync:

**Customers:**
- Sync Companies từ CRM → Customers trong QuickBooks
- Two-way sync

**Invoices:**
- Khi Opportunity won → Tự động tạo Invoice trong QuickBooks
- Link invoice về CRM

**Payments:**
- Khi payment received trong QuickBooks → Cập nhật status trong CRM

**Products:**
- Sync Products từ CRM ↔ QuickBooks

**Bước 4:** Map fields và save

**Workflow ví dụ:**
1. Sales rep win deal trong CRM
2. Tự động tạo Customer trong QuickBooks (nếu chưa có)
3. Tự động tạo Invoice với line items từ Opportunity
4. Gửi invoice cho customer
5. Khi customer pay → Status cập nhật trong CRM

### 8. Sử dụng Zapier cho integrations

**Bước 1:** Tạo tài khoản Zapier

**Bước 2:** Trong Twenty, vào Integrations > Zapier

**Bước 3:** Copy API Key

**Bước 4:** Trong Zapier, create new Zap:

**Trigger (Khi nào):**
- App: Twenty
- Event: New Person Created
- Connect account bằng API Key
- Test trigger

**Action (Làm gì):**
- App: Google Sheets
- Event: Create Spreadsheet Row
- Map fields từ Twenty → Google Sheets
- Test action

**Bước 5:** Turn on Zap

**Ví dụ Zaps thường dùng:**

**Zap 1: New lead → Add to Google Sheets**
- Trigger: Twenty - New Person
- Action: Google Sheets - Create Row

**Zap 2: Form submission → Create lead**
- Trigger: Google Forms - New Response
- Action: Twenty - Create Person

**Zap 3: Deal won → Post to Slack**
- Trigger: Twenty - Opportunity Stage Changed to Won
- Action: Slack - Send Channel Message

**Zap 4: New email → Create task**
- Trigger: Gmail - New Email Matching Search
- Action: Twenty - Create Task

### 9. Webhook Configuration

**Outgoing Webhooks (Từ Twenty ra ngoài):**

**Bước 1:** Vào Settings > Webhooks

**Bước 2:** Nhấn "+ New Webhook"

**Bước 3:** Cấu hình:
- **Name**: Đặt tên webhook
- **Endpoint URL**: URL nhận webhook
- **Events**: Chọn events trigger webhook
  - person.created
  - opportunity.updated
  - task.completed
  - v.v.
- **Headers**: Thêm authentication headers nếu cần
- **Secret**: Shared secret để verify webhook

**Bước 4:** Test webhook

**Bước 5:** Activate

**Webhook payload example:**
```json
{
  "event": "opportunity.won",
  "timestamp": "2024-11-05T10:30:00Z",
  "data": {
    "id": "opp_12345",
    "name": "Deal with ABC Corp",
    "value": 500000000,
    "stage": "Won",
    "owner": {
      "id": "user_123",
      "name": "Nguyễn Văn A"
    }
  }
}
```

**Incoming Webhooks (Từ ngoài vào Twenty):**

**Bước 1:** Tạo webhook receiver trong Twenty

**Bước 2:** Copy webhook URL

**Bước 3:** Paste vào service bên ngoài (VD: Typeform, Calendly)

**Bước 4:** Map fields

**Ví dụ:** Typeform submit → Create lead trong CRM

### 10. REST API Usage

**Get API Credentials:**

**Bước 1:** Settings > API Keys

**Bước 2:** Generate new API key

**Bước 3:** Copy và lưu an toàn

**API Examples:**

**List Opportunities:**
```bash
curl -X GET https://api.twenty.com/v1/opportunities \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

**Create Person:**
```bash
curl -X POST https://api.twenty.com/v1/people \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "company": "ABC Corp"
  }'
```

**Update Opportunity:**
```bash
curl -X PATCH https://api.twenty.com/v1/opportunities/opp_123 \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "stage": "Negotiation",
    "value": 600000000
  }'
```

**Lưu ý:**
- Rate limit: 100 requests/minute
- Sử dụng pagination cho large datasets
- Handle errors properly

### 11. Tích hợp ChatGPT/AI

**Bước 1:** Vào Integrations > AI Tools

**Bước 2:** Connect OpenAI

**Bước 3:** Nhập API Key

**Bước 4:** Cấu hình use cases:

**Auto-summarize emails:**
- Khi email dài > 500 words → AI tóm tắt
- Hiển thị summary trong CRM

**Draft email responses:**
- AI suggest email replies dựa trên context
- User review và edit trước khi gửi

**Lead scoring:**
- AI phân tích lead và cho điểm
- Recommend priority leads

**Sentiment analysis:**
- Phân tích email/note → Positive/Neutral/Negative
- Alert nếu customer sentiment negative

**Bước 5:** Test và activate

### 12. Quản lý Connected Accounts

**Xem tất cả connections:**

**Bước 1:** Vào Settings > Connected Accounts

**Bước 2:** Xem danh sách:
- Account name
- Service (Gmail, Slack, v.v.)
- Status (Active/Error)
- Last sync time
- Data synced

**Reconnect khi có lỗi:**

**Bước 1:** Nếu thấy "Error" status

**Bước 2:** Nhấn "Reconnect"

**Bước 3:** Re-authorize

**Bước 4:** Check lại status

**Disconnect account:**

**Bước 1:** Chọn account cần disconnect

**Bước 2:** Nhấn "Disconnect"

**Bước 3:** Chọn:
- **Keep synced data**: Giữ data đã sync
- **Delete synced data**: Xóa data (cẩn thận!)

**Bước 4:** Confirm

### 13. Monitoring Integration Health

**View Sync Logs:**

**Bước 1:** Vào Integration Settings

**Bước 2:** Chọn integration cần xem

**Bước 3:** Tab "Sync History"

**Bước 4:** Xem:
- Sync runs (thời gian chạy)
- Records processed
- Errors (nếu có)
- Duration

**Setup Alerts:**

**Bước 1:** Settings > Integrations > Alerts

**Bước 2:** Tạo alert rule:
- If sync fails 3 times → Email admin
- If no sync in 24 hours → Alert
- If error rate > 10% → Alert

**Bước 3:** Chọn notification channel

**Bước 4:** Save

### 14. Data Mapping Best Practices

**1. Consistent field mapping:**
```
CRM              External System
-------------------------------------
First Name    →  FirstName (not FNAME, first_name)
Email         →  Email
Phone         →  Phone (format consistent)
```

**2. Handle custom fields:**
- Map custom fields trong CRM đến custom fields bên ngoài
- Document mapping trong settings

**3. Default values:**
- Nếu field không có trong source, set default
- VD: Lead Source = "Integration" nếu không rõ nguồn

**4. Data transformation:**
- Phone: Format về chuẩn (VD: +84...)
- Date: Convert timezone
- Currency: Convert đơn vị

**5. Conflict resolution:**
- Nếu data khác nhau giữa 2 systems, chọn:
  - **Last write wins**: Cái nào update sau thắng
  - **CRM wins**: Ưu tiên CRM
  - **External wins**: Ưu tiên external
  - **Manual review**: Flag conflicts cho admin

### 15. Security Best Practices

**1. API Key Management:**
- Không share API keys
- Rotate keys định kỳ (mỗi 90 ngày)
- Revoke keys khi không dùng
- Một key cho mỗi integration (không dùng chung)

**2. OAuth Tokens:**
- Review permissions kỹ trước khi grant
- Revoke access khi nhân viên nghỉ việc
- Monitor token usage

**3. Webhook Security:**
- Verify webhook signatures
- Sử dụng HTTPS endpoints
- Whitelist IPs nếu có thể

**4. Data Encryption:**
- Sensitive data encrypt in transit (SSL/TLS)
- Encrypt at rest nếu có thể

**5. Audit Logging:**
- Log tất cả API calls
- Track who integrated what
- Alert on suspicious patterns

### 16. Troubleshooting Common Issues

**Issue: Email không sync**

**Fix:**
1. Check connected account status
2. Re-authorize if expired
3. Check sync filters (có filter quá chặt?)
4. Xem sync logs để tìm errors
5. Contact support nếu vẫn lỗi

**Issue: Duplicate records từ integration**

**Fix:**
1. Check duplicate detection rules
2. Review field mapping (có unique field để match?)
3. Enable "Update existing" thay vì "Create new"
4. Manual merge duplicates
5. Adjust sync settings

**Issue: Sync chậm**

**Fix:**
1. Giảm sync frequency (VD: 1 hour thay vì realtime)
2. Giảm số lượng fields sync
3. Filter để sync ít data hơn
4. Check network/API rate limits

**Issue: Integration keeps disconnecting**

**Fix:**
1. Token expired → Re-authorize
2. Password changed → Reconnect
3. Permissions revoked → Re-grant
4. API changes → Update integration

### 17. Integration Scenarios (Ví dụ thực tế)

**Scenario 1: E-commerce + CRM**

Setup:
- Shopify store tích hợp với Twenty CRM
- Khi có order mới → Tự động tạo/update customer trong CRM
- Order items → Create opportunity
- Fulfilled order → Mark opportunity as Won
- Customer purchase history sync để personalize marketing

**Scenario 2: Marketing Automation**

Setup:
- Website form (Typeform) → Create lead
- Lead vào Mailchimp drip campaign
- Email engagement sync về CRM (opens, clicks)
- Hot lead (high engagement) → Slack alert sales team
- Sales create opportunity và follow up

**Scenario 3: Support Ticket to Sales**

Setup:
- Support ticket (Zendesk) từ customer
- Ticket có mention "upgrade" hoặc "buy more"
- Auto-create opportunity trong CRM
- Assign to account owner
- Link ticket vào opportunity
- Close ticket → Update opportunity

**Scenario 4: Event Management**

Setup:
- Event registration (Eventbrite) → Create lead
- Attendee check-in → Update lead status
- Post-event survey (Google Forms) → Update lead notes
- High NPS score → Priority lead
- Assign to sales for follow-up

### 18. Custom Integration Development

**For Developers:**

**Bước 1:** Review API documentation

**Bước 2:** Setup development environment:
- Get sandbox API key
- Install SDK (nếu có)

**Bước 3:** Build integration:
- Authentication (OAuth or API key)
- CRUD operations
- Error handling
- Rate limit handling
- Webhooks (if needed)

**Bước 4:** Test thoroughly:
- Unit tests
- Integration tests
- Load tests

**Bước 5:** Deploy to production

**Bước 6:** Monitor và maintain

**Example Node.js Integration:**
```javascript
const TwentyAPI = require('twenty-sdk');

const client = new TwentyAPI({
  apiKey: process.env.TWENTY_API_KEY
});

// Create person from external source
async function syncPerson(externalData) {
  try {
    const person = await client.people.create({
      firstName: externalData.first_name,
      lastName: externalData.last_name,
      email: externalData.email,
      customFields: {
        externalId: externalData.id
      }
    });
    console.log('Person created:', person.id);
  } catch (error) {
    console.error('Error creating person:', error);
  }
}
```

**Lưu ý:**
- Tất cả integrations phải được admin approve trước khi activate
- Test kỹ trong sandbox trước khi deploy production
- Document integration setup cho users
- Monitor integration health và fix issues nhanh

# Tài Liệu Các Module Chức Năng Twenty CRM

## Tổng Quan Hệ Thống

Twenty là một hệ thống CRM (Customer Relationship Management) mã nguồn mở được xây dựng với kiến trúc hiện đại, bao gồm Backend (NestJS) và Frontend (React), được tổ chức theo mô hình monorepo với Nx workspace.

---

## 1. MODULE XÁC THỰC VÀ PHÂN QUYỀN (Authentication & Authorization)

### Dùng để làm gì:
- Quản lý đăng nhập/đăng ký người dùng
- Xác thực qua Google, Microsoft, SSO/SAML
- Quản lý token (Access, Refresh, Login tokens)
- Phân quyền và bảo mật API
- Two-factor authentication (2FA)
- Password reset và email verification

### Dành cho ai:
- **End Users**: Đăng nhập và quản lý tài khoản
- **System Administrators**: Cấu hình SSO và bảo mật
- **Developers**: Tích hợp authentication trong apps

### Làm như nào:

#### Thiết Lập Authentication:
```bash
# 1. Cấu hình environment variables
cd packages/twenty-server
cp .env.example .env

# Chỉnh sửa .env với:
# AUTH_GOOGLE_CLIENT_ID=your_google_client_id
# AUTH_GOOGLE_CLIENT_SECRET=your_google_secret
# JWT_SECRET=your_jwt_secret
```

#### Sử Dụng Authentication API:
```typescript
// Login với email/password
POST /auth/login
{
  "email": "user@example.com",
  "password": "password"
}

// Login với Google OAuth
GET /auth/google/redirect

// Refresh token
POST /auth/refresh
{
  "refreshToken": "your_refresh_token"
}
```

#### Frontend Authentication:
```tsx
import { useAuth } from '@/auth/hooks/useAuth';

const LoginComponent = () => {
  const { signIn, signOut, currentUser } = useAuth();

  const handleLogin = async () => {
    await signIn({
      email: 'user@example.com',
      password: 'password'
    });
  };
};
```

---

## 2. MODULE QUẢN LÝ NGƯỜI DÙNG (User Management)

### Dùng để làm gì:
- Quản lý thông tin profile người dùng
- Upload và quản lý avatar
- Quản lý workspace membership
- User settings và preferences
- Onboarding flow cho người dùng mới

### Dành cho ai:
- **End Users**: Quản lý profile cá nhân
- **Workspace Admins**: Quản lý thành viên workspace
- **System Administrators**: Quản lý toàn bộ users

### Làm như nào:

#### Quản Lý User Profile:
```typescript
// Update user profile
mutation UpdateUser($input: UserUpdateInput!) {
  updateUser(data: $input) {
    id
    firstName
    lastName
    avatarUrl
  }
}

// Get current user
query GetCurrentUser {
  currentUser {
    id
    firstName
    lastName
    email
    workspaces {
      id
      displayName
    }
  }
}
```

#### Frontend User Management:
```tsx
import { useCurrentUser } from '@/users/hooks/useCurrentUser';

const UserProfile = () => {
  const { currentUser, updateUser } = useCurrentUser();

  const handleUpdateProfile = (data) => {
    updateUser({
      firstName: data.firstName,
      lastName: data.lastName
    });
  };
};
```

---

## 3. MODULE QUẢN LÝ WORKSPACE (Workspace Management)

### Dùng để làm gì:
- Tạo và quản lý workspace (công ty/tổ chức)
- Invite và quản lý members
- Cấu hình workspace settings
- Domain management và branding
- Billing và subscription management

### Dành cho ai:
- **Workspace Owners**: Quản lý toàn bộ workspace
- **Workspace Admins**: Quản lý members và settings
- **Members**: Tham gia và làm việc trong workspace

### Làm như nào:

#### Tạo Workspace:
```typescript
// Create new workspace
mutation CreateWorkspace($input: WorkspaceCreateInput!) {
  createWorkspace(data: $input) {
    id
    displayName
    subdomain
  }
}

// Invite member to workspace
mutation InviteToWorkspace($input: WorkspaceInviteInput!) {
  inviteToWorkspace(data: $input) {
    id
    email
    status
  }
}
```

#### Frontend Workspace Management:
```tsx
import { useWorkspace } from '@/workspace/hooks/useWorkspace';

const WorkspaceSettings = () => {
  const { currentWorkspace, updateWorkspace, inviteMember } = useWorkspace();

  const handleInvite = (email: string) => {
    inviteMember({ email, role: 'MEMBER' });
  };
};
```

---

## 4. MODULE QUẢN LÝ CONTACTS/PEOPLE (Contact Management)

### Dùng để làm gì:
- Quản lý thông tin liên hệ cá nhân
- Import/Export contacts từ CSV, Google Contacts
- Tìm kiếm và filter contacts
- Custom fields cho contacts
- Timeline activities và interaction history

### Dành cho ai:
- **Sales Teams**: Quản lý prospect và khách hàng
- **Marketing Teams**: Quản lý lead database
- **Customer Success**: Theo dõi customer relationships

### Làm như nào:

#### CRUD Operations:
```typescript
// Create contact
mutation CreatePerson($input: PersonCreateInput!) {
  createPerson(data: $input) {
    id
    firstName
    lastName
    email
    phone
    company {
      id
      name
    }
  }
}

// Get contacts với filtering
query GetPeople($filter: PersonFilterInput) {
  people(filter: $filter) {
    edges {
      node {
        id
        firstName
        lastName
        email
      }
    }
  }
}
```

#### Frontend Contact Management:
```tsx
import { useCreateOneRecord } from '@/object-record/hooks/useCreateOneRecord';

const ContactForm = () => {
  const { createOneRecord } = useCreateOneRecord({
    objectNameSingular: 'person'
  });

  const handleSubmit = (data) => {
    createOneRecord({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email
    });
  };
};
```

---

## 5. MODULE QUẢN LÝ COMPANIES (Company Management)

### Dùng để làm gì:
- Quản lý thông tin công ty/doanh nghiệp
- Liên kết contacts với companies
- Company enrichment từ external data
- Tracking company activities và deals
- Company hierarchy và relationships

### Dành cho ai:
- **Sales Teams**: Quản lý target companies
- **Business Development**: Research và prospecting
- **Account Managers**: Quản lý key accounts

### Làm như nào:

#### Company Operations:
```typescript
// Create company
mutation CreateCompany($input: CompanyCreateInput!) {
  createCompany(data: $input) {
    id
    name
    domainName
    employees
    industry
    address {
      street
      city
      country
    }
  }
}

// Link person to company
mutation UpdatePerson($id: ID!, $input: PersonUpdateInput!) {
  updatePerson(id: $id, data: $input) {
    id
    company {
      id
      name
    }
  }
}
```

---

## 6. MODULE QUẢN LÝ OPPORTUNITIES (Opportunity/Deal Management)

### Dùng để làm gì:
- Tạo và theo dõi sales opportunities
- Pipeline management với các stages
- Forecast và revenue tracking
- Deal collaboration và notes
- Win/loss analysis

### Dành cho ai:
- **Sales Representatives**: Quản lý deals cá nhân
- **Sales Managers**: Theo dõi team performance
- **Revenue Operations**: Forecasting và reporting

### Làm như nào:

#### Deal Pipeline Management:
```typescript
// Create opportunity
mutation CreateOpportunity($input: OpportunityCreateInput!) {
  createOpportunity(data: $input) {
    id
    name
    amount
    stage
    closeDate
    person {
      id
      name
    }
    company {
      id
      name
    }
  }
}

// Update opportunity stage
mutation UpdateOpportunityStage($id: ID!, $stage: String!) {
  updateOpportunity(id: $id, data: { stage: $stage }) {
    id
    stage
    updatedAt
  }
}
```

---

## 7. MODULE ACTIVITIES VÀ TIMELINE (Activities & Timeline)

### Dùng để làm gì:
- Ghi lại tất cả activities (calls, meetings, emails)
- Timeline view của customer interactions
- Task management và follow-ups
- Note taking và collaboration
- Activity scheduling và reminders

### Dành cho ai:
- **Sales Teams**: Track customer interactions
- **Customer Success**: Monitor customer health
- **Support Teams**: Case management

### Làm như nào:

#### Activity Management:
```typescript
// Create activity
mutation CreateActivity($input: ActivityCreateInput!) {
  createActivity(data: $input) {
    id
    type
    title
    body
    dueAt
    assignee {
      id
      name
    }
  }
}

// Get timeline activities
query GetTimelineActivities($targetId: ID!) {
  timelineActivities(targetId: $targetId) {
    id
    type
    title
    createdAt
    author {
      id
      name
    }
  }
}
```

#### Frontend Activity Components:
```tsx
import { useCreateActivity } from '@/activities/hooks/useCreateActivity';

const ActivityForm = ({ targetId }) => {
  const { createActivity } = useCreateActivity();

  const handleCreateNote = (content) => {
    createActivity({
      type: 'NOTE',
      title: 'Meeting Notes',
      body: content,
      targetId: targetId
    });
  };
};
```

---

## 8. MODULE MESSAGING VÀ EMAIL (Messaging & Email Integration)

### Dùng để làm gì:
- Sync emails từ Gmail, Outlook
- Email thread management
- Auto-create contacts từ email interactions
- Email templates và campaigns
- Message filtering và rules

### Dành cho ai:
- **Sales Teams**: Email prospecting và follow-up
- **Customer Success**: Email-based support
- **Marketing**: Email campaign tracking

### Làm như nào:

#### Email Integration Setup:
```bash
# Setup Google email integration
1. Configure OAuth2 credentials in .env
2. Connect Gmail account through UI
3. Sync starts automatically

# Email operations via GraphQL:
```

```typescript
// Get email threads
query GetMessageThreads($filter: MessageThreadFilterInput) {
  messageThreads(filter: $filter) {
    id
    subject
    lastMessageReceivedAt
    messages {
      id
      body
      from
      to
    }
  }
}
```

---

## 9. MODULE CALENDAR INTEGRATION (Calendar Integration)

### Dùng để làm gì:
- Sync calendar events từ Google Calendar, Outlook
- Meeting scheduling và availability
- Calendar event creation từ CRM
- Meeting attendee management
- Calendar-based activity logging

### Dành cho ai:
- **Sales Teams**: Schedule meetings với prospects
- **Customer Success**: Regular check-ins
- **Account Managers**: Client meetings

### Làm như nào:

#### Calendar Setup:
```typescript
// Connect calendar account
POST /auth/google-apis/get-access-token
{
  "code": "google_oauth_code",
  "codeVerifier": "code_verifier",
  "calendarScoped": true
}

// Create calendar event
mutation CreateCalendarEvent($input: CalendarEventInput!) {
  createCalendarEvent(data: $input) {
    id
    title
    startsAt
    endsAt
    attendees
  }
}
```

---

## 10. MODULE WORKFLOW VÀ AUTOMATION (Workflow & Automation)

### Dùng để làm gì:
- Tạo automated workflows với triggers và actions
- Data transformation và processing
- Integration với external systems
- Custom business logic execution
- AI-powered automation

### Dành cho ai:
- **Operations Teams**: Process automation
- **Developers**: Custom business logic
- **Power Users**: Advanced workflow creation

### Làm như nào:

#### Workflow Creation:
```typescript
// Create workflow
mutation CreateWorkflow($input: WorkflowCreateInput!) {
  createWorkflow(data: $input) {
    id
    name
    trigger {
      type
      settings
    }
    actions {
      type
      settings
    }
  }
}

// Workflow với AI action
const aiWorkflow = {
  name: "Lead Qualification",
  trigger: {
    type: "RECORD_CREATED",
    objectType: "person"
  },
  actions: [{
    type: "AI_AGENT",
    settings: {
      prompt: "Qualify this lead based on company size and industry",
      model: "gpt-4"
    }
  }]
};
```

---

## 11. MODULE CUSTOM OBJECTS VÀ METADATA (Custom Objects & Metadata)

### Dùng để làm gì:
- Tạo custom objects và fields
- Dynamic schema generation
- Object relationships và indexes
- Custom views và filters
- Data model management

### Dành cho ai:
- **System Administrators**: Custom data modeling
- **Business Analysts**: Custom reporting needs
- **Developers**: Extend CRM functionality

### Làm như nào:

#### Custom Object Creation:
```typescript
// Create custom object metadata
mutation CreateObjectMetadata($input: CreateObjectInput!) {
  createOneObject(data: $input) {
    id
    nameSingular
    namePlural
    labelSingular
    labelPlural
  }
}

// Add custom field
mutation CreateFieldMetadata($input: CreateFieldInput!) {
  createOneField(data: $input) {
    id
    name
    label
    type
    defaultValue
  }
}
```

#### Frontend Object Management:
```tsx
import { useObjectMetadataItems } from '@/object-metadata/hooks/useObjectMetadataItems';

const CustomObjectManager = () => {
  const { objectMetadataItems, createObjectMetadata } = useObjectMetadataItems();

  const handleCreateObject = (objectData) => {
    createObjectMetadata({
      nameSingular: 'customEntity',
      namePlural: 'customEntities',
      labelSingular: 'Custom Entity',
      labelPlural: 'Custom Entities'
    });
  };
};
```

---

## 12. MODULE VIEWS VÀ FILTERS (Views & Filtering)

### Dùng để làm gì:
- Tạo custom views với filters, sorting
- Kanban, Table, Calendar views
- Saved searches và bookmarks
- Bulk operations trên records
- Advanced filtering và grouping

### Dành cho ai:
- **All Users**: Organize và view data
- **Sales Managers**: Team performance views
- **Analysts**: Custom reporting views

### Làm như nào:

#### View Management:
```typescript
// Create custom view
mutation CreateView($input: ViewCreateInput!) {
  createView(data: $input) {
    id
    name
    type
    filters {
      field
      operator
      value
    }
    sorts {
      field
      direction
    }
  }
}

// Apply view filters
const viewConfig = {
  filters: [
    { field: 'stage', operator: 'eq', value: 'QUALIFIED' },
    { field: 'amount', operator: 'gte', value: 10000 }
  ],
  sorts: [
    { field: 'closeDate', direction: 'ASC' }
  ]
};
```

---

## 13. MODULE FILE VÀ ATTACHMENTS (File & Attachments)

### Dùng để làm gì:
- Upload và quản lý files
- Attach files tới records
- Image processing và thumbnails
- File storage với S3/local storage
- File sharing và permissions

### Dành cho ai:
- **All Users**: Attach files tới records
- **Sales Teams**: Proposals và contracts
- **Support Teams**: Screenshots và documents

### Làm như nào:

#### File Operations:
```typescript
// Upload file
mutation UploadFile($file: Upload!) {
  uploadFile(file: $file) {
    id
    name
    url
    mimeType
    size
  }
}

// Attach file to record
mutation CreateAttachment($input: AttachmentCreateInput!) {
  createAttachment(data: $input) {
    id
    name
    file {
      id
      url
    }
    attachedTo {
      id
    }
  }
}
```

---

## 14. MODULE SEARCH VÀ ANALYTICS (Search & Analytics)

### Dùng để làm gì:
- Full-text search across all records
- Advanced search với multiple criteria
- Analytics dashboard và metrics
- Custom reports và charts
- Data export capabilities

### Dành cho ai:
- **All Users**: Quick data discovery
- **Managers**: Performance analytics
- **Analysts**: Custom reporting

### Làm như nào:

#### Search Implementation:
```typescript
// Global search
query SearchRecords($searchInput: String!) {
  search(input: $searchInput) {
    results {
      id
      type
      record {
        ... on Person {
          firstName
          lastName
        }
        ... on Company {
          name
        }
      }
    }
  }
}

// Analytics query
query GetDashboardMetrics($timeRange: DateRange!) {
  metrics(timeRange: $timeRange) {
    totalRevenue
    dealsWon
    conversionRate
    averageDealSize
  }
}
```

---

## 15. MODULE SETTINGS VÀ CONFIGURATION (Settings & Configuration)

### Dùng để làm gì:
- System configuration và preferences
- User permission management
- API key và webhook configuration
- Integration settings
- Appearance và localization

### Dành cho ai:
- **System Administrators**: System configuration
- **Workspace Owners**: Workspace settings
- **Developers**: API và integration setup

### Làm như nào:

#### Configuration Management:
```typescript
// Update workspace settings
mutation UpdateWorkspaceSettings($input: WorkspaceUpdateInput!) {
  updateWorkspace(data: $input) {
    id
    displayName
    logo
    allowImpersonation
  }
}

// Manage API keys
mutation CreateApiKey($input: ApiKeyCreateInput!) {
  createApiKey(data: $input) {
    id
    name
    token
    expiresAt
  }
}
```

---

## Quy Trình Development Tổng Quát

### 1. Setup Development Environment:
```bash
# Clone và setup
git clone https://github.com/twentyhq/twenty.git
cd twenty
yarn install

# Setup database
cd packages/twenty-docker
docker-compose up -d postgres redis

# Run database migrations
cd ../twenty-server
yarn database:init:prod
```

### 2. Start Development:
```bash
# Terminal 1: Backend
cd packages/twenty-server
yarn start:dev

# Terminal 2: Frontend
cd packages/twenty-front
yarn dev
```

### 3. Testing:
```bash
# Unit tests
yarn test

# E2E tests
npx nx test twenty-e2e-testing

# Specific module test
yarn test --testPathPattern=auth
```

### 4. Build Production:
```bash
# Build all packages
yarn build

# Build specific package
npx nx build twenty-server
npx nx build twenty-front
```

## Kết Luận

Twenty CRM cung cấp một hệ sinh thái module hoàn chỉnh cho việc quản lý customer relationship. Mỗi module được thiết kế độc lập nhưng tích hợp chặt chẽ, cho phép customize và extend theo nhu cầu cụ thể của doanh nghiệp. Architecture modular này giúp developers dễ dàng maintain, test và scale hệ thống.

# SharePoint as Primary Database - Quick Reference

## 🎯 Core Concept

**SharePoint = Primary Database** cho workspace data
**PostgreSQL = Runtime Cache** (có thể xóa và tạo lại bất cứ lúc nào)

---

## 📋 Key Principles

1. **SharePoint là Source of Truth**:
   - Tất cả workspace data lưu trong SharePoint Lists
   - Data sống sót qua mọi sự cố PostgreSQL

2. **PostgreSQL là Disposable Cache**:
   - Core DB (users, auth, workspace metadata) → auto-gen từ migrations
   - Workspace DB (company, person, opportunity) → reload từ SharePoint
   - Có thể DROP và recreate bất cứ lúc nào

3. **Auto-Bootstrap on Startup**:
   - Check SharePoint structure
   - Tạo lists/columns nếu thiếu
   - Tự động tạo column "TwentyId" (indexed, unique) cho ID mapping
   - Không cần manual setup

4. **Lazy Loading**:
   - Load data từ SharePoint khi lần đầu access workspace
   - Cache trong PostgreSQL để query nhanh
   - Cache có TTL, reload khi cần

5. **Async Write-back**:
   - User write → PostgreSQL (fast response)
   - Background job → SharePoint (reliable persistence)

6. **ID Independence**:
   - Sync hoạt động độc lập khỏi nghiệp vụ Twenty
   - Sử dụng custom column "TwentyId" để map UUID ↔ SharePoint numeric ID

---

## 🔑 ID Mapping Strategy

### **The Problem**
- Twenty uses **UUID** (e.g., `550e8400-e29b-41d4-a716-446655440000`)
- SharePoint uses **auto-increment numeric ID** (e.g., `1`, `2`, `3`)

### **The Solution**
- Thêm custom column **"TwentyId"** trong mỗi SharePoint List
- Column này indexed + unique để lookup nhanh
- Twenty UUID được lưu trong column này

### **SharePoint List Structure**
```
ID (auto)  | TwentyId (UUID)                          | Title          | Employees
-----------|------------------------------------------|----------------|----------
1          | 550e8400-e29b-41d4-a716-446655440000     | Acme Corp      | 500
2          | 6ba7b810-9dad-11d1-80b4-00c04fd430c8     | Tech Inc       | 200
```

### **ID Flow**

**Create:**
```
Twenty: Generate UUID → Save to PostgreSQL
  ↓
SharePoint: Store UUID in TwentyId column (SharePoint auto-gen ID: 1)
```

**Load:**
```
SharePoint: Get items with TwentyId
  ↓
PostgreSQL: Use TwentyId as primary key (ignore SharePoint numeric ID)
```

**Update:**
```
Twenty: Update by UUID
  ↓
SharePoint: Filter by TwentyId → Get SharePoint ID → Update item
```

**Delete:**
```
Twenty: Delete by UUID
  ↓
SharePoint: Filter by TwentyId → Get SharePoint ID → Delete item
```

### **Visual Example**

```
┌─────────────────────────────────────────────────────────────────┐
│                         PostgreSQL                               │
│                                                                  │
│  company table:                                                  │
│  ┌────────────────────────────────────────┬──────────────────┐ │
│  │ id (UUID - Primary Key)                │ name             │ │
│  ├────────────────────────────────────────┼──────────────────┤ │
│  │ 550e8400-e29b-41d4-a716-446655440000   │ Acme Corp        │ │
│  │ 6ba7b810-9dad-11d1-80b4-00c04fd430c8   │ Tech Inc         │ │
│  └────────────────────────────────────────┴──────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              ↕
                    TwentyId Column Maps
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                      SharePoint List                             │
│                                                                  │
│  Company list:                                                   │
│  ┌────┬──────────────────────────────────────┬──────────────┐  │
│  │ ID │ TwentyId (Indexed, Unique)           │ Title        │  │
│  ├────┼──────────────────────────────────────┼──────────────┤  │
│  │ 1  │ 550e8400-e29b-41d4-a716-446655440000 │ Acme Corp    │  │
│  │ 2  │ 6ba7b810-9dad-11d1-80b4-00c04fd430c8 │ Tech Inc     │  │
│  └────┴──────────────────────────────────────┴──────────────┘  │
│   ↑                                                              │
│   SharePoint auto-increment (not used by Twenty)                │
└─────────────────────────────────────────────────────────────────┘
```

**Key Points:**
- ✅ Twenty only uses UUID, không biết về SharePoint numeric ID
- ✅ SharePoint TwentyId column = PostgreSQL id column
- ✅ Sync code filter by TwentyId để tìm record
- ✅ Hoàn toàn độc lập với nghiệp vụ Twenty

---

## 🔄 Data Flow

### **Startup Flow**
```
App Start
  → Bootstrap Service
    → Check SharePoint site exists
    → For each object:
      - Check list exists → Create if missing
      - Check columns exist → Create if missing
  → Ready to serve
```

### **Read Flow (First Access)**
```
User query workspace
  → Check PostgreSQL cache
  → If empty:
    - Load từ SharePoint
    - Insert vào PostgreSQL
    - Cache "loaded" state
  → Return từ PostgreSQL (fast)
```

### **Write Flow**
```
User creates Company
  → Save to PostgreSQL (immediate)
  → Return success to user (fast)
  → Queue background job
    → Write to SharePoint (async)
  → Done
```

---

## 🏗️ Architecture

```
SharePoint Lists (PRIMARY)
    ↓ Bootstrap (on startup)
    ↓ Load (on first access)
PostgreSQL (CACHE)
    ↓ Query (fast reads)
User
    ↓ Mutation (fast writes)
PostgreSQL (CACHE)
    ↓ Event (async)
SharePoint Lists (PRIMARY)
```

---

## 📁 What's Stored Where?

### **SharePoint Lists** (Primary, Permanent)
- ✅ Company, Person, Opportunity
- ✅ Tasks, Notes, Activities
- ✅ Custom objects
- ✅ File attachments
- ✅ Custom field definitions

### **PostgreSQL Core DB** (Auto-generated, Disposable)
- ✅ User accounts
- ✅ Authentication tokens
- ✅ Workspace metadata
- ✅ System configuration

### **PostgreSQL Workspace DBs** (Cache, Disposable)
- ✅ Runtime cache của SharePoint data
- ✅ Có thể DROP và recreate từ SharePoint

---

## 🔧 Environment Variables

```bash
# Enable SharePoint as primary
WORKSPACE_DATASOURCE=sharepoint
WORKSPACE_STORAGE_TYPE=sharepoint
WORKSPACE_TENANT_ID=<tenant-id>

# SharePoint Configuration
SHAREPOINT_SITE_HOSTNAME=<tenant>.sharepoint.com
SHAREPOINT_SITE_PATH=/sites/Twenty-<workspace-name>

# Bootstrap Settings
SHAREPOINT_BOOTSTRAP_ON_STARTUP=true
SHAREPOINT_AUTO_CREATE_LISTS=true
SHAREPOINT_AUTO_CREATE_COLUMNS=true

# ID Mapping
SHAREPOINT_TWENTYID_COLUMN_INDEXED=true   # Index TwentyId for fast lookups
SHAREPOINT_TWENTYID_COLUMN_UNIQUE=true    # Enforce uniqueness

# Data Loading
SHAREPOINT_LAZY_LOAD_DATA=true
SHAREPOINT_CACHE_TTL_SECONDS=3600

# Write-back Settings
SHAREPOINT_WRITEBACK_ENABLED=true
SHAREPOINT_WRITEBACK_BATCH_SIZE=20
SHAREPOINT_WRITEBACK_RETRY_ATTEMPTS=3
```

---

## ⚡ Performance Notes

### **ID Lookup Performance**

**✅ GOOD - Filter on SharePoint (fast):**
```typescript
// SharePoint filters indexed TwentyId column
GET /sites/{id}/lists/{id}/items?$filter=fields/TwentyId eq '{uuid}'&$top=1
// Response time: ~50-100ms
```

**❌ BAD - Load all then filter in code (slow):**
```typescript
// Load all items into memory then filter
GET /sites/{id}/lists/{id}/items
// Filter in JS: items.find(i => i.fields.TwentyId === uuid)
// Response time: 5-10 seconds for 10k items
```

### **Batch Operations**

```typescript
// ✅ Batch write 100 items at once
await sharePointService.batchCreateItems(items); // 1 API call

// ❌ Individual writes
for (const item of items) {
  await sharePointService.createItem(item); // 100 API calls
}
```

### **Why TwentyId Must Be Indexed**

- Without index: O(n) scan through all items
- With index: O(log n) binary search
- For 10,000 records: 10,000 ops vs 14 ops

---

## 🔗 Relation Columns (Foreign Keys)

### **Problem: How to store relations?**

Twenty uses UUID for foreign keys (e.g., `companyId`, `authorId`). SharePoint có 2 options:

1. ❌ **SharePoint Lookup Columns** - Links to SharePoint numeric ID (BAD)
2. ✅ **Text Columns storing UUID** - Links to TwentyId (GOOD)

### **Why NOT SharePoint Lookups?**

| Feature | SharePoint Lookup | Text Column (UUID) |
|---------|------------------|-------------------|
| References | SharePoint numeric ID | TwentyId (UUID) |
| Portable | ❌ Breaks if item deleted | ✅ Stable across sites |
| Query performance | ✅ Native joins | ✅ Indexed filter |
| Twenty compatible | ❌ Different ID system | ✅ Same UUID |
| **Recommendation** | **DON'T USE** | **USE THIS** |

### **Structure Example: Person → Company**

```
📊 Companies (SharePoint List)
┌────┬──────────────────┬────────────┐
│ Id │ TwentyId         │ Name       │
├────┼──────────────────┼────────────┤
│ 1  │ uuid-company-1   │ Acme Corp  │
│ 2  │ uuid-company-2   │ Tech Inc   │
└────┴──────────────────┴────────────┘

📊 People (SharePoint List)
┌────┬──────────────────┬────────────┬──────────────────┐
│ Id │ TwentyId         │ Name       │ companyId        │ ⬅️ Stores Company's TwentyId
├────┼──────────────────┼────────────┼──────────────────┤
│ 10 │ uuid-person-1    │ John Doe   │ uuid-company-1   │
│ 11 │ uuid-person-2    │ Jane Smith │ uuid-company-2   │
└────┴──────────────────┴────────────┴──────────────────┘
```

### **Code: Create Relation Column**

```typescript
// Bootstrap Service creates relation columns as TEXT with index
await sharePointService.createColumn(siteId, 'People', {
  name: 'companyId',
  type: 'text',           // NOT 'lookup'
  indexed: true,          // Fast filtering
  required: false,        // Allow null
  description: 'References Companies.TwentyId',
});
```

### **Code: Query Relations**

```typescript
// Find all people in a company
const companyTwentyId = 'uuid-company-1';

const response = await graphClient
  .api(`/sites/${siteId}/lists/People/items`)
  .filter(`fields/companyId eq '${companyTwentyId}'`)  // Query by TwentyId
  .select('fields')
  .get();

// Then load company details
const companyResponse = await graphClient
  .api(`/sites/${siteId}/lists/Companies/items`)
  .filter(`fields/TwentyId eq '${companyTwentyId}'`)
  .get();
```

### **Code: Batch Load Relations (Avoid N+1)**

```typescript
// ❌ BAD: N+1 queries
for (const person of people) {
  const company = await loadCompany(person.companyId);  // 1 query per person
}

// ✅ GOOD: 2 queries total
const people = await loadPeople();  // 1 query
const companyIds = [...new Set(people.map(p => p.companyId))];
const companies = await batchLoadCompanies(companyIds);  // 1 query
const companyMap = new Map(companies.map(c => [c.id, c]));

people.forEach(person => {
  person.company = companyMap.get(person.companyId);
});
```

### **Key Rules:**

1. ✅ Relation columns = **text type** (store UUID)
2. ✅ **Index relation columns** for fast filtering
3. ✅ Use **TwentyId** for lookups, NOT SharePoint numeric ID
4. ✅ **Batch load** to avoid N+1 queries
5. ❌ **NEVER use SharePoint lookup columns**

---

## 🐛 Troubleshooting ID Mapping

### **Problem: "SharePoint item not found for update"**

**Cause:** TwentyId column missing hoặc không có data

**Solution:**
```bash
# 1. Check if TwentyId column exists
GET /sites/{id}/lists/{id}/columns
# Look for: name: "TwentyId"

# 2. Check if items have TwentyId
GET /sites/{id}/lists/{id}/items?$select=fields/TwentyId
# All items should have TwentyId value

# 3. Re-bootstrap workspace
yarn workspace twenty-server bootstrap-sharepoint --workspace-id=<id>
```

### **Problem: "Duplicate TwentyId" error**

**Cause:** Unique constraint violated (shouldn't happen if code is correct)

**Solution:**
```typescript
// Find duplicate TwentyIds in SharePoint
const items = await sharePointService.getListItems(siteId, listId);
const twentyIds = items.map(i => i.fields.TwentyId);
const duplicates = twentyIds.filter((id, index) => twentyIds.indexOf(id) !== index);
console.log('Duplicates:', duplicates);

// Fix: Remove duplicates manually in SharePoint
```

### **Problem: "Slow lookups by TwentyId"**

**Cause:** TwentyId column not indexed

**Solution:**
```typescript
// Check if indexed
const column = await sharePointService.getColumn(siteId, listId, 'TwentyId');
console.log('Indexed:', column.indexed); // Should be true

// Re-create column with index
await sharePointService.deleteColumn(siteId, listId, 'TwentyId');
await sharePointService.createColumn(siteId, listId, {
  name: 'TwentyId',
  type: 'text',
  indexed: true,
  unique: true,
});
```

---

# Data Loading
SHAREPOINT_LAZY_LOAD_DATA=true
SHAREPOINT_CACHE_TTL_SECONDS=3600

# Write-back Settings
SHAREPOINT_WRITEBACK_ENABLED=true
SHAREPOINT_WRITEBACK_BATCH_SIZE=20
SHAREPOINT_WRITEBACK_RETRY_ATTEMPTS=3
```

---

## 🚀 Implementation Phases

### **Phase 1: Bootstrap Service (Week 1-2)**
- SharePointBootstrapService
- Auto-create sites, lists, columns
- Run on app startup

### **Phase 2: Data Loading (Week 2-3)**
- SharePointDataLoaderService
- Lazy load từ SharePoint → PostgreSQL
- Cache loaded state

### **Phase 3: Write-back (Week 3-4)**
- Event listeners (created, updated, deleted)
- Background jobs write to SharePoint
- Retry logic

### **Phase 4: Testing & Production (Week 4-6)**
- Unit tests
- Integration tests
- Performance testing
- Monitoring & logging

---

## ✅ Benefits vs Old Approach

| Old (Bidirectional Sync) | New (SharePoint Primary) |
|---------------------------|--------------------------|
| ❌ Complex conflict resolution | ✅ No conflicts |
| ❌ Bidirectional webhooks | ✅ One-way write-back |
| ❌ PostgreSQL failure = data loss | ✅ Data safe in SharePoint |
| ❌ Need PostgreSQL backups | ✅ SharePoint IS the backup |
| ❌ Manual sync setup | ✅ Auto-bootstrap |

---

## 🎯 Key Code Files

```
packages/twenty-server/src/modules/sharepoint/
├── services/
│   ├── sharepoint-bootstrap.service.ts      # Bootstrap on startup
│   ├── sharepoint-data-loader.service.ts    # Load from SharePoint
│   └── sharepoint.service.ts                 # SharePoint API wrapper
├── listeners/
│   └── sharepoint-writeback.listener.ts     # Listen to DB events
├── jobs/
│   └── sharepoint-writeback.job.ts          # Background write-back
└── sharepoint.module.ts                     # Module registration
```

---

## 🧪 Testing Recovery

Test PostgreSQL thực sự disposable:

```bash
# 1. Drop workspace database
psql -c "DROP DATABASE workspace_abc123;"

# 2. Restart app or trigger workspace access
curl http://localhost:3000/api/workspaces/abc123/companies

# 3. Data tự động reload từ SharePoint
# 4. Everything works! 🎉
```

---

## 📚 Full Documentation

Xem chi tiết trong [SHAREPOINT_SYNC_STRATEGY.md](./SHAREPOINT_SYNC_STRATEGY.md)

---

**Status**: ✅ Design Complete, Ready for Implementation
**Estimated Time**: 4-6 weeks
**Complexity**: Medium
**Risk**: Low-Medium

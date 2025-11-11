# Hướng Dẫn: Thêm Standard Object Mới Vào Twenty

## Tổng Quan

Standard Object là các đối tượng dữ liệu cốt lõi được định nghĩa sẵn trong hệ thống Twenty (như Company, Person, Opportunity, Task, Department, Employee, Team...). Khác với Custom Object (do người dùng tự tạo), Standard Object được hard-code vào source code và có sẵn cho tất cả workspace.

**Thời gian ước tính:**
- Object đơn giản (không có relations): 1-2 giờ
- Object phức tạp (có nhiều relations): 3-4 giờ

---

## 📋 Quick Start (TL;DR)

**Nếu bạn đã quen với quy trình**, đây là checklist nhanh:

### Quy Trình 7 Bước
1. ✅ **UUIDs & Constants** (15 phút) → 4 files
2. ✅ **Tạo Entity** (30-45 phút) → workspace-entity.ts
3. ✅ **Relations** (30-60 phút - nếu có) → Many-to-One & One-to-Many
4. ✅ **Timeline** (15-20 phút - nếu cần) → Activity integration
5. ✅ **Register Backend** (5 phút) → standard-objects/index.ts
6. ✅ **Frontend** (15-20 phút - nếu cần) → 3-4 files
7. ✅ **Migration** (20-30 phút) → Build & sync

### Constants Cần Update (4 Files)

```typescript
// 1. standard-object-ids.ts
export const STANDARD_OBJECT_IDS = { product: 'uuid-1' }

// 2. standard-field-ids.ts
export const PRODUCT_STANDARD_FIELD_IDS = { name: 'uuid-2', ... }

// 3. standard-object-icons.ts
export const STANDARD_OBJECT_ICONS = { product: 'IconBox' }

// 4. standard-objects-by-priority-rank.ts
export const STANDARD_OBJECTS_BY_PRIORITY_RANK = { product: 3 }
```

### Entity Template (Tối Thiểu)

```typescript
@WorkspaceEntity({ standardId, namePlural, labelSingular, labelPlural, icon })
@WorkspaceIsSearchable()
export class ProductWorkspaceEntity extends BaseWorkspaceEntity {
  @WorkspaceField({ standardId, type: TEXT, label, icon })
  name: string;

  // System fields - BẮT BUỘC
  @WorkspaceField({ type: POSITION, ... })
  @WorkspaceIsSystem()
  position: number;

  @WorkspaceField({ type: ACTOR, ... })
  @WorkspaceIsFieldUIReadOnly()
  createdBy: ActorMetadata;

  @WorkspaceField({ type: TS_VECTOR, ... })
  @WorkspaceIsSystem()
  @WorkspaceFieldIndex({ indexType: GIN })
  searchVector: string;
}
```

### Register & Migration

```typescript
// standard-objects/index.ts
import { ProductWorkspaceEntity } from '...';
export const standardObjectMetadataDefinitions = [
  ...,
  ProductWorkspaceEntity,
];
```

```bash
# Build & Sync
cd packages/twenty-server
yarn build
yarn command:prod workspace:sync-metadata
```

**→ Xem chi tiết từng bước bên dưới**

---

## Mục Lục Chi Tiết

1. [Cấu Trúc Thư Mục](#cấu-trúc-thư-mục)
2. [Các Bước Thực Hiện Chi Tiết](#các-bước-thực-hiện-chi-tiết)
3. [Lưu Ý Quan Trọng](#lưu-ý-quan-trọng)
4. [Checklist Hoàn Chỉnh](#checklist-hoàn-chỉnh)
5. [Field Types Reference](#field-types-reference)
6. [Decorators Reference](#decorators-reference)
7. [Ví Dụ Hoàn Chỉnh](#ví-dụ-hoàn-chỉnh)
8. [Troubleshooting](#troubleshooting)
9. [Best Practices](#best-practices)
10. [FAQ](#faq)

---

## Cấu Trúc Thư Mục

Mỗi Standard Object thường được tổ chức trong một module riêng biệt:

```
packages/twenty-server/src/modules/
└── [tên-module]/                          # e.g., product, employee
    ├── standard-objects/                   # Workspace entity
    │   └── [tên-module].workspace-entity.ts
    ├── constants/                          # (Optional) Module constants
    │   └── [tên-constant].ts
    ├── services/                           # (Optional) Business logic
    └── resolvers/                          # (Optional) GraphQL resolvers
```

---

## Tổng Quan Các Bước

### Quy Trình 7 Bước

1. ✅ **Chuẩn bị UUIDs và Constants** (15-20 phút)
   - Tạo UUID cho object và fields
   - Cập nhật 4 files constants

2. ✅ **Tạo Workspace Entity** (30-45 phút)
   - Tạo thư mục module
   - Định nghĩa entity với decorators
   - Khai báo fields (business + system)

3. ✅ **Thêm Relations** (30-60 phút - nếu có)
   - Many-to-One relations
   - One-to-Many relations
   - Cập nhật cả 2 phía

4. ✅ **Timeline Activity Integration** (15-20 phút - nếu cần)
   - Relation vào TimelineActivity
   - Inverse relation

5. ✅ **Đăng ký Backend** (5 phút)
   - Import entity
   - Thêm vào array

6. ✅ **Cập nhật Frontend** (15-20 phút - nếu cần)
   - CoreObjectNameSingular
   - Navigation order
   - Icon color
   - Default view

7. ✅ **Migration & Testing** (20-30 phút)
   - Build server
   - Sync metadata
   - Test CRUD, relations, search

**Tham khảo:**
- Simple: `company`, `person`, `opportunity`
- Complex: `employee`, `department`, `team`

---

## Các Bước Thực Hiện Chi Tiết

### Bước 1: Chuẩn Bị UUIDs và Constants

#### 1.1. Tạo UUIDs

Tạo UUID duy nhất cho:
- 1 object standardId
- Nhiều field standardIds

```bash
# macOS/Linux - tạo lowercase UUID
uuidgen | tr '[:upper:]' '[:lower:]'

# Hoặc dùng online: https://www.uuidgenerator.net/
```

💡 **Lưu lại tất cả UUIDs** - bạn sẽ dùng nhiều lần!

#### 1.2. File 1: `standard-object-ids.ts`

**Path:** `packages/twenty-server/src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids.ts`

```typescript
export const STANDARD_OBJECT_IDS = {
  // ... existing objects
  product: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', // ← Thêm UUID của bạn
} as const;
```

#### 1.3. File 2: `standard-field-ids.ts`

**Path:** `packages/twenty-server/src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids.ts`

```typescript
export const PRODUCT_STANDARD_FIELD_IDS = {
  name: 'uuid-1',
  description: 'uuid-2',
  price: 'uuid-3',
  sku: 'uuid-4',
  position: 'uuid-5',
  createdBy: 'uuid-6',
  searchVector: 'uuid-7',
  // ... thêm fields khác nếu cần
} as const;
```

#### 1.4. File 3: `standard-object-icons.ts`

**Path:** `packages/twenty-server/src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-icons.ts`

```typescript
export const STANDARD_OBJECT_ICONS = {
  // ... existing
  product: 'IconBox', // Chọn từ tabler.io/icons
} as const;
```

**Lưu ý:** Icon phải có prefix `Icon` (e.g., `IconBox`, `IconUser`)

#### 1.5. File 4: `standard-objects-by-priority-rank.ts`

**Path:** `packages/twenty-server/src/engine/core-modules/search/constants/standard-objects-by-priority-rank.ts`

```typescript
export const STANDARD_OBJECTS_BY_PRIORITY_RANK = {
  person: 5,      // Core entities
  company: 4,     // Major entities
  opportunity: 3, // Business objects
  product: 3,     // ← Thêm vào đây
  employee: 2,    // Secondary
  task: 1,        // Organizational
  // ... existing
} as const;
```

**Priority guide:**
- **5**: Core entities (Person)
- **4**: Major entities (Company)
- **3**: Business objects (Opportunity, Product)
- **2**: Secondary (Employee, Note)
- **1**: Organizational (Task, Department)
- **0**: Configuration/lookup

---

### Bước 2: Tạo Workspace Entity

#### 2.1. Tạo Thư Mục

```bash
mkdir -p packages/twenty-server/src/modules/product/standard-objects
```

#### 2.2. Tạo Entity File

**Path:** `packages/twenty-server/src/modules/product/standard-objects/product.workspace-entity.ts`

**Template đầy đủ:**

```typescript
import { msg } from '@lingui/core/macro';
import { FieldMetadataType } from 'twenty-shared/types';

import { SEARCH_VECTOR_FIELD } from 'src/engine/metadata-modules/constants/search-vector-field.constants';
import { ActorMetadata } from 'twenty-shared/types';
import { IndexType } from 'src/engine/metadata-modules/index-metadata/types/indexType.types';
import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { WorkspaceEntity } from 'src/engine/twenty-orm/decorators/workspace-entity.decorator';
import { WorkspaceField } from 'src/engine/twenty-orm/decorators/workspace-field.decorator';
import { WorkspaceFieldIndex } from 'src/engine/twenty-orm/decorators/workspace-field-index.decorator';
import { WorkspaceIsFieldUIReadOnly } from 'src/engine/twenty-orm/decorators/workspace-is-field-ui-readonly.decorator';
import { WorkspaceIsNullable } from 'src/engine/twenty-orm/decorators/workspace-is-nullable.decorator';
import { WorkspaceIsSearchable } from 'src/engine/twenty-orm/decorators/workspace-is-searchable.decorator';
import { WorkspaceIsSystem } from 'src/engine/twenty-orm/decorators/workspace-is-system.decorator';
import { PRODUCT_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_ICONS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-icons';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';
import {
  type FieldTypeAndNameMetadata,
  getTsVectorColumnExpressionFromFields,
} from 'src/engine/workspace-manager/workspace-sync-metadata/utils/get-ts-vector-column-expression.util';

// Search fields definition
const NAME_FIELD_NAME = 'name';

export const SEARCH_FIELDS_FOR_PRODUCT: FieldTypeAndNameMetadata[] = [
  { name: NAME_FIELD_NAME, type: FieldMetadataType.TEXT },
];

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.product,
  namePlural: 'products',
  labelSingular: msg`Product`,
  labelPlural: msg`Products`,
  description: msg`A product in the catalog`,
  icon: STANDARD_OBJECT_ICONS.product,
  shortcut: 'P',
  labelIdentifierStandardId: PRODUCT_STANDARD_FIELD_IDS.name,
})
@WorkspaceIsSearchable()
export class ProductWorkspaceEntity extends BaseWorkspaceEntity {
  // Business Fields
  @WorkspaceField({
    standardId: PRODUCT_STANDARD_FIELD_IDS.name,
    type: FieldMetadataType.TEXT,
    label: msg`Name`,
    description: msg`Product name`,
    icon: 'IconBox',
  })
  name: string;

  @WorkspaceField({
    standardId: PRODUCT_STANDARD_FIELD_IDS.description,
    type: FieldMetadataType.TEXT,
    label: msg`Description`,
    description: msg`Product description`,
    icon: 'IconFileText',
  })
  @WorkspaceIsNullable()
  description: string | null;

  @WorkspaceField({
    standardId: PRODUCT_STANDARD_FIELD_IDS.price,
    type: FieldMetadataType.NUMBER,
    label: msg`Price`,
    description: msg`Product price`,
    icon: 'IconCurrencyDollar',
  })
  @WorkspaceIsNullable()
  price: number | null;

  // System Fields - BẮT BUỘC
  @WorkspaceField({
    standardId: PRODUCT_STANDARD_FIELD_IDS.position,
    type: FieldMetadataType.POSITION,
    label: msg`Position`,
    description: msg`Product record position`,
    icon: 'IconHierarchy2',
    defaultValue: 0,
  })
  @WorkspaceIsSystem()
  position: number;

  @WorkspaceField({
    standardId: PRODUCT_STANDARD_FIELD_IDS.createdBy,
    type: FieldMetadataType.ACTOR,
    label: msg`Created by`,
    icon: 'IconCreativeCommonsSa',
    description: msg`The creator of the record`,
  })
  @WorkspaceIsFieldUIReadOnly()
  createdBy: ActorMetadata;

  // Search Vector - BẮT BUỘC nếu @WorkspaceIsSearchable
  @WorkspaceField({
    standardId: PRODUCT_STANDARD_FIELD_IDS.searchVector,
    type: FieldMetadataType.TS_VECTOR,
    label: SEARCH_VECTOR_FIELD.label,
    description: SEARCH_VECTOR_FIELD.description,
    icon: 'IconSearch',
    generatedType: 'STORED',
    asExpression: getTsVectorColumnExpressionFromFields(
      SEARCH_FIELDS_FOR_PRODUCT,
    ),
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  @WorkspaceFieldIndex({ indexType: IndexType.GIN })
  searchVector: string;
}
```

**Giải thích các tham số @WorkspaceEntity:**

- `standardId`: UUID từ `STANDARD_OBJECT_IDS`
- `namePlural`: lowercase, số nhiều (e.g., `products`)
- `labelSingular`/`labelPlural`: Dùng `msg` macro (i18n)
- `description`: Mô tả object
- `icon`: Icon name từ Tabler Icons
- `shortcut`: Phím tắt 1 ký tự (optional)
- `labelIdentifierStandardId`: Field ID làm title chính
- `imageIdentifierStandardId`: Field ID cho avatar (optional)

---

### Bước 3: Thêm Relations (Nếu Cần)

#### 3.1. Import Relations Dependencies

```typescript
import { RelationType } from 'src/engine/metadata-modules/field-metadata/interfaces/relation-type.interface';
import { Relation } from 'src/engine/workspace-manager/workspace-sync-metadata/interfaces/relation.interface';
import { WorkspaceJoinColumn } from 'src/engine/twenty-orm/decorators/workspace-join-column.decorator';
import { WorkspaceRelation } from 'src/engine/twenty-orm/decorators/workspace-relation.decorator';
import { RelationOnDeleteAction } from 'twenty-shared/types';
```

#### 3.2. Many-to-One Relation

**Ví dụ:** Product → Category

```typescript
// Import entity
import { CategoryWorkspaceEntity } from 'src/modules/category/standard-objects/category.workspace-entity';

// Trong ProductWorkspaceEntity class:
@WorkspaceRelation({
  standardId: PRODUCT_STANDARD_FIELD_IDS.category, // Thêm UUID mới
  type: RelationType.MANY_TO_ONE,
  label: msg`Category`,
  description: msg`Product category`,
  icon: 'IconTag',
  inverseSideTarget: () => CategoryWorkspaceEntity,
  inverseSideFieldKey: 'products', // Tên field ở CategoryWorkspaceEntity
  onDelete: RelationOnDeleteAction.SET_NULL,
})
@WorkspaceIsNullable()
category: Relation<CategoryWorkspaceEntity> | null;

@WorkspaceJoinColumn('category')
categoryId: string | null;
```

#### 3.3. One-to-Many Relation

**Ví dụ:** Category → Products

```typescript
// Trong CategoryWorkspaceEntity:
import { ProductWorkspaceEntity } from 'src/modules/product/standard-objects/product.workspace-entity';

@WorkspaceRelation({
  standardId: CATEGORY_STANDARD_FIELD_IDS.products, // Thêm UUID mới
  type: RelationType.ONE_TO_MANY,
  label: msg`Products`,
  description: msg`Products in this category`,
  icon: 'IconBox',
  inverseSideTarget: () => ProductWorkspaceEntity,
  inverseSideFieldKey: 'category', // Tên field ở ProductWorkspaceEntity
})
products: Relation<ProductWorkspaceEntity[]>;
```

**Lưu ý quan trọng:**
- `inverseSideTarget`: Entity liên kết
- `inverseSideFieldKey`: Tên field ở phía bên kia
- `onDelete`: SET_NULL, CASCADE, hoặc RESTRICT
- Many-to-One cần `@WorkspaceJoinColumn` và `[name]Id` field
- Phải định nghĩa ở cả 2 phía (bidirectional)

---

### Bước 4: Timeline Activity Integration (Tùy Chọn)

**Khi nào cần Timeline?**
- ✅ Object nghiệp vụ quan trọng (Product, Employee, Customer...)
- ✅ Cần audit trail/history
- ❌ Lookup/config objects (ProductType, Status...)

#### 4.1. Thêm Field ID

**File:** `standard-field-ids.ts`

```typescript
export const TIMELINE_ACTIVITY_STANDARD_FIELD_IDS = {
  // ... existing
  product: 'uuid-mới', // Tạo UUID mới
} as const;
```

#### 4.2. Thêm Relation vào TimelineActivity

**File:** `timeline-activity.workspace-entity.ts`

```typescript
// Import entity cần kết nối
import { ProductWorkspaceEntity } from 'src/modules/product/standard-objects/product.workspace-entity';

// Thêm vào TimelineActivityWorkspaceEntity class:
@WorkspaceRelation({
  standardId: TIMELINE_ACTIVITY_STANDARD_FIELD_IDS.product,
  type: RelationType.MANY_TO_ONE,
  label: msg`Product`,
  description: msg`Event product`,
  icon: 'IconBox',
  inverseSideTarget: () => ProductWorkspaceEntity,
  inverseSideFieldKey: 'timelineActivities',
  onDelete: RelationOnDeleteAction.SET_NULL, // 🔥 QUAN TRỌNG: Dùng SET_NULL, không phải CASCADE
})
@WorkspaceIsNullable()
product: Relation<ProductWorkspaceEntity> | null;

@WorkspaceJoinColumn('product')
productId: string | null;
```

⚠️ **LƯU Ý QUAN TRỌNG:**
- `onDelete: RelationOnDeleteAction.SET_NULL` - Khi xóa entity, timeline activity vẫn tồn tại nhưng relation = null
- `inverseSideFieldKey: 'timelineActivities'` - PHẢI KHỚP với tên field ở entity kia
- Timeline activity sử dụng pattern khác với business relations

#### 4.3. Thêm Inverse Relation vào Product

**File:** `product.workspace-entity.ts`

```typescript
// Import TimelineActivity entity
import { TimelineActivityWorkspaceEntity } from 'src/modules/timeline/standard-objects/timeline-activity.workspace-entity';

// Thêm vào ProductWorkspaceEntity class (trước searchVector):
@WorkspaceRelation({
  standardId: PRODUCT_STANDARD_FIELD_IDS.timelineActivities, // Dùng field ID riêng
  type: RelationType.ONE_TO_MANY,
  label: msg`Timeline Activities`,
  description: msg`Timeline Activities linked to the product`,
  icon: 'IconTimelineEvent',
  inverseSideTarget: () => TimelineActivityWorkspaceEntity,
  inverseSideFieldKey: 'product', // PHẢI KHỚP với field name ở TimelineActivity
  // 🔥 KHÔNG CÓ onDelete cho ONE_TO_MANY
})
@WorkspaceIsNullable()
@WorkspaceIsSystem()
timelineActivities: Relation<TimelineActivityWorkspaceEntity[]>;
```

⚠️ **CHÚ Ý PATTERN TIMELINE:**
- `@WorkspaceIsSystem()` - Timeline là system field
- `icon: 'IconTimelineEvent'` - Icon chuẩn cho timeline
- Không có `onDelete` ở ONE_TO_MANY side
- Đặt trước `searchVector` field

---

### Bước 5: Đăng Ký Backend

**File:** `packages/twenty-server/src/engine/workspace-manager/workspace-sync-metadata/standard-objects/index.ts`

```typescript
// 1. Import (theo alphabet)
import { ProductWorkspaceEntity } from 'src/modules/product/standard-objects/product.workspace-entity';

// 2. Thêm vào array (theo alphabet)
export const standardObjectMetadataDefinitions = [
  AttachmentWorkspaceEntity,
  BlocklistWorkspaceEntity,
  // ... existing entities
  ProductWorkspaceEntity, // ← Thêm vào đây
  // ... other entities
];
```

---

### Bước 6: Cập Nhật Frontend (Tùy Chọn)

#### 6.1. CoreObjectNameSingular

**File:** `packages/twenty-front/src/modules/object-metadata/types/CoreObjectNameSingular.ts`

```typescript
export enum CoreObjectNameSingular {
  // ... existing
  Product = 'product',
}
```

**⚠️ Lưu ý:** Tên enum value phải khớp với `nameSingular` trong entity (lowercase)

#### 6.2. Navigation Order

**File:** `packages/twenty-front/src/modules/object-metadata/components/NavigationDrawerSectionForObjectMetadataItems.tsx`

```typescript
const ORDERED_STANDARD_OBJECTS: string[] = [
  CoreObjectNameSingular.Person,
  CoreObjectNameSingular.Company,
  CoreObjectNameSingular.Opportunity,
  CoreObjectNameSingular.Product, // ← Thêm vào vị trí mong muốn
  CoreObjectNameSingular.Task,
  // ...
];
```

**Tips:**
- Thứ tự này quyết định vị trí hiển thị trong navigation menu
- Các object không có trong list này sẽ được sắp xếp theo `createdAt`
- Thường đặt objects quan trọng ở trên cùng

#### 6.3. Icon Color

**File:** `packages/twenty-front/src/modules/object-metadata/utils/getIconColorForObjectType.ts`

```typescript
export const getIconColorForObjectType = ({ objectType, theme }) => {
  switch (objectType) {
    case 'product':
      return theme.color.purple; // blue, purple, green, orange, red, yellow, turquoise
    // ... other cases
  }
};
```

**Available colors:**
- `theme.color.blue` - Xanh dương (Task, Employee)
- `theme.color.purple` - Tím (Department, Warehouse)
- `theme.color.green` - Xanh lá (Team)
- `theme.color.orange` - Cam (Position, Inventory)
- `theme.color.red` - Đỏ (Employee Level)
- `theme.color.yellow` - Vàng (Note, Award)
- `theme.color.turquoise` - Xanh ngọc (Employment Type)

#### 6.4. Default View (Khuyến Nghị)

**File:** `packages/twenty-server/src/engine/workspace-manager/standard-objects-prefill-data/views/products-all.view.ts`

```typescript
import { msg } from '@lingui/core/macro';
import { IconList } from 'twenty-shared/core';
import { PRODUCT_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';

export const productsAllView = {
  name: msg`All Products`,
  objectSingularName: 'product',
  type: 'table',
  key: 'INDEX',
  position: 0,
  icon: IconList,
  kanbanFieldMetadataId: '',
  filters: [],
  fields: [
    {
      fieldMetadataId: PRODUCT_STANDARD_FIELD_IDS.name,
      position: 0,
      isVisible: true,
      size: 150,
    },
    {
      fieldMetadataId: PRODUCT_STANDARD_FIELD_IDS.description,
      position: 1,
      isVisible: true,
      size: 200,
    },
  ],
};
```

**Đăng ký view:**

**File:** `packages/twenty-server/src/engine/workspace-manager/standard-objects-prefill-data/prefill-core-views.ts`

```typescript
import { productsAllView } from './views/products-all.view';

const views = [
  // ... existing views
  productsAllView,
];
```

---

### Bước 7: Migration & Testing

#### 7.1. Build Server

```bash
cd packages/twenty-server
yarn build
```

**Nếu có lỗi:**
- Kiểm tra imports
- Kiểm tra decorators
- Kiểm tra constants đã định nghĩa đúng
- 🔥 **Timeline Activity Error:** `Field metadata for field "supplierId" is missing` → Chưa thêm field vào `TIMELINE_ACTIVITY_STANDARD_FIELD_IDS`

#### 7.2. Sync Metadata

```bash
# Sync một workspace
yarn command:prod workspace:sync-metadata -w [workspace-id]

# Hoặc sync tất cả
yarn command:prod workspace:sync-metadata
```

**Migration sẽ tạo:**
- Table: `[workspaceId]_products`
- Columns cho tất cả fields
- Indexes (GIN cho search, BTREE cho foreign keys)
- Foreign keys cho relations
- Metadata entries

#### 7.3. Verify Database

```bash
psql -h localhost -U twenty -d twenty
```

```sql
-- Xem table
\dt *_products

-- Xem cấu trúc
\d [workspaceId]_products

-- Xem metadata
SELECT * FROM metadata."objectMetadata" WHERE "namePlural" = 'products';
```

#### 7.4. Test GraphQL

```graphql
# http://localhost:3000/graphql

query {
  products {
    edges {
      node {
        id
        name
        description
      }
    }
  }
}

mutation {
  createProduct(data: { name: "Test Product" }) {
    id
    name
  }
}
```

---

## Lưu Ý Quan Trọng

### 1. UUID Management
- ✅ Luôn dùng constants
- ✅ UUID phải lowercase
- ❌ Không hard-code
- ❌ Không trùng lặp

### 2. System Fields Bắt Buộc
- `position` (POSITION) - Sắp xếp records
- `createdBy` (ACTOR) - Người tạo record

### 3. Search Vector
- Bắt buộc nếu có `@WorkspaceIsSearchable()`
- Phải định nghĩa `SEARCH_FIELDS_FOR_[OBJECT]`
- Phải có `@WorkspaceFieldIndex({ indexType: IndexType.GIN })`

### 4. Label Identifier
- Field `labelIdentifierStandardId` là title chính
- Thường là field `name` hoặc `title`
- `imageIdentifierStandardId` (optional) cho avatar/image

### 5. Relations
- Many-to-One: Cần `@WorkspaceJoinColumn` và `[name]Id`
- Phải cập nhật cả 2 phía
- `inverseSideFieldKey` phải match tên field bên kia
- **Timeline relations:** Dùng `SET_NULL`, không dùng `CASCADE`

### 6. Constants
- LUÔN dùng `STANDARD_OBJECT_IDS.[objectName]`
- LUÔN dùng `[OBJECT]_STANDARD_FIELD_IDS.[fieldName]`
- LUÔN dùng `STANDARD_OBJECT_ICONS.[objectName]`

---

## Checklist Hoàn Chỉnh

### Backend

**Bước 1: Constants** ⏱️ 15-20 phút
- [ ] Tạo UUIDs (object + fields)
- [ ] `standard-object-ids.ts`
- [ ] `standard-field-ids.ts` (constant `[OBJECT]_STANDARD_FIELD_IDS`)
- [ ] `standard-object-icons.ts`
- [ ] `standard-objects-by-priority-rank.ts`

**Bước 2: Entity** ⏱️ 30-45 phút
- [ ] Tạo module folder
- [ ] Tạo workspace entity file
- [ ] Định nghĩa `@WorkspaceEntity` với đầy đủ options
- [ ] Thêm business fields
- [ ] Thêm system fields: `position`, `createdBy`
- [ ] Thêm `searchVector` (nếu searchable)
- [ ] Sử dụng constants cho tất cả standardId

**Bước 3: Relations** ⏱️ 30-60 phút (nếu có)
- [ ] Import dependencies
- [ ] Thêm Many-to-One với `@WorkspaceJoinColumn`
- [ ] Thêm One-to-Many ở phía ngược
- [ ] Kiểm tra `inverseSideFieldKey`
- [ ] Cập nhật constants

**Bước 4: Timeline** ⏱️ 15-20 phút (nếu cần)
- [ ] Thêm field ID vào `TIMELINE_ACTIVITY_STANDARD_FIELD_IDS`
- [ ] Thêm relation vào `timeline-activity.workspace-entity.ts` (dùng `SET_NULL`)
- [ ] Thêm inverse relation vào entity (với `@WorkspaceIsSystem`)
- [ ] ⚠️ **Tránh lỗi:** `inverseSideFieldKey` phải khớp chính xác

**Bước 5: Register** ⏱️ 5 phút
- [ ] Import vào `standard-objects/index.ts`
- [ ] Thêm vào array (theo alphabet)

### Frontend (Tùy chọn) ⏱️ 15-20 phút

- [ ] `CoreObjectNameSingular.ts`
- [ ] `NavigationDrawerSectionForObjectMetadataItems.tsx`
- [ ] `getIconColorForObjectType.ts`
- [ ] Tạo view file (optional)

### Migration & Testing ⏱️ 20-30 phút

- [ ] Build server
- [ ] Sync metadata
- [ ] Verify database
- [ ] Test GraphQL CRUD
- [ ] Test relations (nếu có)
- [ ] Test search (nếu searchable)
- [ ] Test UI (nếu có frontend)

---

## Field Types Reference

### Primitive Types

```typescript
FieldMetadataType.TEXT           // String
FieldMetadataType.NUMBER         // Number
FieldMetadataType.BOOLEAN        // Boolean
FieldMetadataType.DATE_TIME      // Date & Time
FieldMetadataType.SELECT         // Single select
FieldMetadataType.MULTI_SELECT   // Multiple select
FieldMetadataType.RAW_JSON       // JSON object
FieldMetadataType.RATING         // 1-5 stars
```

### Composite Types

```typescript
FieldMetadataType.FULL_NAME      // firstName + lastName
FieldMetadataType.EMAILS         // Array of emails
FieldMetadataType.PHONES         // Array of phones
FieldMetadataType.LINKS          // Array of URLs
FieldMetadataType.ADDRESS        // Full address
FieldMetadataType.CURRENCY       // amount + currencyCode
FieldMetadataType.ACTOR          // name + source
```

### System Types

```typescript
FieldMetadataType.UUID           // Unique ID
FieldMetadataType.POSITION       // Ordering
FieldMetadataType.TS_VECTOR      // Full-text search
```

**Ví dụ Composite Type:**

```typescript
import { FullNameMetadata } from 'src/engine/metadata-modules/field-metadata/composite-types/full-name.composite-type';

@WorkspaceField({
  standardId: EMPLOYEE_STANDARD_FIELD_IDS.name,
  type: FieldMetadataType.FULL_NAME,
  label: msg`Full Name`,
  description: msg`Employee's full name`,
  icon: 'IconUser',
})
@WorkspaceIsNullable()
name: FullNameMetadata | null;
```

---

## Decorators Reference

### Entity Decorators

```typescript
@WorkspaceEntity({...})           // Đánh dấu workspace entity
@WorkspaceIsSearchable()          // Enable full-text search
@WorkspaceDuplicateCriteria([...]) // Define duplicate criteria
@WorkspaceIsNotAuditLogged()      // Disable audit logging
@WorkspaceGate({...})             // Feature flag gating
```

### Field Decorators

```typescript
@WorkspaceField({...})            // Define field
@WorkspaceIsNullable()            // Nullable field
@WorkspaceIsSystem()              // System field (no edit/delete)
@WorkspaceIsFieldUIReadOnly()     // Read-only in UI
@WorkspaceIsUnique()              // Unique constraint
@WorkspaceIsDeprecated()          // Mark as deprecated
@WorkspaceFieldIndex({...})       // Create index
```

### Relation Decorators

```typescript
@WorkspaceRelation({...})         // Define relation
@WorkspaceJoinColumn('name')      // Join column (many-to-one)
```

**Thứ tự decorators chuẩn:**

```typescript
@WorkspaceField({...})            // 1. Field definition
@WorkspaceIsNullable()            // 2. Nullable
@WorkspaceIsUnique()              // 3. Unique
@WorkspaceIsSystem()              // 4. System
@WorkspaceIsFieldUIReadOnly()     // 5. ReadOnly
@WorkspaceFieldIndex({...})       // 6. Index
fieldName: Type;
```

---

## Ví Dụ Hoàn Chỉnh

### Example 1: Simple Object (Product)

Xem code đầy đủ ở **Bước 2** phía trên.

### Example 2: Object With Relations (Employee)

**File:** `employee.workspace-entity.ts`

```typescript
import { msg } from '@lingui/core/macro';
import { FieldMetadataType } from 'twenty-shared/types';
import { RelationType } from 'src/engine/metadata-modules/field-metadata/interfaces/relation-type.interface';
import { Relation } from 'src/engine/workspace-manager/workspace-sync-metadata/interfaces/relation.interface';
import { WorkspaceRelation } from 'src/engine/twenty-orm/decorators/workspace-relation.decorator';
import { WorkspaceJoinColumn } from 'src/engine/twenty-orm/decorators/workspace-join-column.decorator';
import { DepartmentWorkspaceEntity } from 'src/modules/department/standard-objects/department.workspace-entity';
// ... other imports

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.employee,
  namePlural: 'employees',
  labelSingular: msg`Employee`,
  labelPlural: msg`Employees`,
  description: msg`An employee in the organization`,
  icon: STANDARD_OBJECT_ICONS.employee,
  labelIdentifierStandardId: EMPLOYEE_STANDARD_FIELD_IDS.name,
})
@WorkspaceIsSearchable()
export class EmployeeWorkspaceEntity extends BaseWorkspaceEntity {
  // ... fields

  // Many-to-One: Employee → Department
  @WorkspaceRelation({
    standardId: EMPLOYEE_STANDARD_FIELD_IDS.department,
    type: RelationType.MANY_TO_ONE,
    label: msg`Department`,
    description: msg`Employee department`,
    icon: 'IconBuilding',
    inverseSideTarget: () => DepartmentWorkspaceEntity,
    inverseSideFieldKey: 'employees',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  department: Relation<DepartmentWorkspaceEntity> | null;

  @WorkspaceJoinColumn('department')
  departmentId: string | null;

  // ... other fields
}
```

---

## Troubleshooting

### Build Errors

#### "Duplicate standardId"
→ Tạo UUID mới, không được trùng

#### "Cannot find module"
→ Kiểm tra import path, đảm bảo file tồn tại

#### "Property 'XXX' does not exist"
→ Kiểm tra imports, rebuild: `yarn build`

### 🔥 Timeline Activity Errors (Kinh nghiệm thực tế)

#### "Field metadata for field '[entityName]Id' is missing in object metadata timelineActivity"

**Nguyên nhân:** Chưa thêm field vào `TIMELINE_ACTIVITY_STANDARD_FIELD_IDS`

**Giải pháp:**

1. **Thêm field ID vào constants:**
```typescript
// standard-field-ids.ts
export const TIMELINE_ACTIVITY_STANDARD_FIELD_IDS = {
  // ... existing fields
  material: 'uuid-1',
  supplier: 'uuid-2',
  manufacturer: 'uuid-3',
  materialGroup: 'uuid-4',
} as const;
```

2. **Thêm relation vào TimelineActivity:**
```typescript
// timeline-activity.workspace-entity.ts
@WorkspaceRelation({
  standardId: TIMELINE_ACTIVITY_STANDARD_FIELD_IDS.supplier,
  type: RelationType.MANY_TO_ONE,
  label: msg`Supplier`,
  description: msg`Event supplier`,
  icon: 'IconTruck',
  inverseSideTarget: () => SupplierWorkspaceEntity,
  inverseSideFieldKey: 'timelineActivities',
  onDelete: RelationOnDeleteAction.SET_NULL, // 🔥 SET_NULL không phải CASCADE
})
@WorkspaceIsNullable()
supplier: Relation<SupplierWorkspaceEntity> | null;

@WorkspaceJoinColumn('supplier')
supplierId: string | null;
```

3. **Pattern đúng cho Timeline relations:**
- ✅ `onDelete: RelationOnDeleteAction.SET_NULL`
- ✅ `inverseSideFieldKey: 'timelineActivities'`
- ✅ `@WorkspaceIsNullable()` và `@WorkspaceIsSystem()`
- ❌ KHÔNG dùng `RelationOnDeleteAction.CASCADE`

### Migration Errors

#### "Missing required field"
→ Thiếu `position` hoặc `createdBy`

```typescript
// BẮT BUỘC
@WorkspaceField({
  standardId: [...],
  type: FieldMetadataType.POSITION,
  label: msg`Position`,
  description: msg`Record position`,
  icon: 'IconHierarchy2',
  defaultValue: 0,
})
@WorkspaceIsSystem()
position: number;

@WorkspaceField({
  standardId: [...],
  type: FieldMetadataType.ACTOR,
  label: msg`Created by`,
  icon: 'IconCreativeCommonsSa',
  description: msg`The creator of the record`,
})
@WorkspaceIsFieldUIReadOnly()
createdBy: ActorMetadata;
```

#### "Sync metadata failed"
→ Chạy `yarn build` và xem error log chi tiết

#### "Relation not working"
→ Kiểm tra:
- `inverseSideTarget` đúng entity
- `inverseSideFieldKey` match tên field
- Many-to-One có `@WorkspaceJoinColumn` và `[name]Id`
- Cả 2 phía đã defined

### Runtime Errors

#### "Field not found in GraphQL schema"
→ Restart server và clear frontend cache

```bash
cd packages/twenty-server && yarn start
cd packages/twenty-front && rm -rf node_modules/.cache && yarn start
```

#### "Search not working"
→ Đảm bảo:
- `@WorkspaceIsSearchable()` ở entity
- Định nghĩa `SEARCH_FIELDS_FOR_[OBJECT]`
- `searchVector` có `@WorkspaceFieldIndex({ indexType: IndexType.GIN })`

### UI Errors

#### "Object not showing in navigation"
→ Thêm vào `CoreObjectNameSingular.ts` và `ORDERED_STANDARD_OBJECTS`

#### "Icon not displaying"
→ Icon name phải:
- Có prefix `Icon` (e.g., `IconBox`)
- Tồn tại trong Tabler Icons
- Viết đúng case-sensitive

### Debug Tips

**Check metadata trong database:**

```sql
-- Object metadata
SELECT * FROM metadata."objectMetadata"
WHERE "namePlural" = 'products';

-- Field metadata
SELECT fm.*
FROM metadata."fieldMetadata" fm
JOIN metadata."objectMetadata" om ON fm."objectMetadataId" = om.id
WHERE om."namePlural" = 'products';

-- Relations
SELECT * FROM metadata."relationMetadata"
WHERE "fromObjectMetadataId" IN (
  SELECT id FROM metadata."objectMetadata"
  WHERE "namePlural" = 'products'
);
```

---

## Best Practices

### 1. Tham Khảo Existing Objects

**Simple:** `company`, `person`, `opportunity`
**Complex:** `employee`, `department`, `team`
**Special:** `message` (no audit), `workspaceMember` (avatar), `task` (timeline)

### 2. UUID Management

✅ **DO:**
```typescript
standardId: PRODUCT_STANDARD_FIELD_IDS.name
uuidgen | tr '[:upper:]' '[:lower:]'
```

❌ **DON'T:**
```typescript
standardId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' // Hard-coded
standardId: 'A1B2C3D4-...' // Uppercase
```

### 3. Naming Conventions

```typescript
// Entity class: PascalCase + "WorkspaceEntity"
export class ProductWorkspaceEntity extends BaseWorkspaceEntity

// File: kebab-case + ".workspace-entity.ts"
product.workspace-entity.ts

// Module folder: kebab-case
src/modules/product/

// namePlural: lowercase plural
namePlural: 'products'

// Field name: camelCase
name: string
categoryId: string

// Constants: SCREAMING_SNAKE_CASE
PRODUCT_STANDARD_FIELD_IDS
```

### 4. i18n

✅ **DO:**
```typescript
import { msg } from '@lingui/core/macro';
labelSingular: msg`Product`
label: msg`Product Name`
```

❌ **DON'T:**
```typescript
labelSingular: 'Product' // String literal
```

### 5. Relations

**Many-to-One (đầy đủ):**
```typescript
@WorkspaceRelation({
  type: RelationType.MANY_TO_ONE,
  inverseSideTarget: () => CategoryWorkspaceEntity,
  inverseSideFieldKey: 'products',
  onDelete: RelationOnDeleteAction.SET_NULL,
})
@WorkspaceIsNullable()
category: Relation<CategoryWorkspaceEntity> | null;

@WorkspaceJoinColumn('category')
categoryId: string | null;
```

**One-to-Many:**
```typescript
@WorkspaceRelation({
  type: RelationType.ONE_TO_MANY,
  inverseSideTarget: () => ProductWorkspaceEntity,
  inverseSideFieldKey: 'category',
})
products: Relation<ProductWorkspaceEntity[]>;
```

**onDelete actions:**
- `SET_NULL` - Safe, set foreign key = null
- `CASCADE` - Delete children when parent deleted
- `RESTRICT` - Prevent deletion if children exist

### 6. Testing Strategy

1. **Build** - TypeScript compile
2. **Migration** - Database schema
3. **GraphQL** - Queries/mutations
4. **Relations** - Joins and cascades
5. **Search** - Full-text search
6. **UI** - Frontend integration

### 7. Code Organization

```typescript
// 1. External imports
import { msg } from '@lingui/core/macro';

// 2. Engine imports
import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';

// 3. Module imports
import { CategoryWorkspaceEntity } from 'src/modules/category/standard-objects/category.workspace-entity';

// 4. Constants
import { PRODUCT_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
```

### 8. Commit Strategy

```bash
# 1. Constants
git commit -m "feat: add Product standard object constants"

# 2. Entity
git commit -m "feat: add Product workspace entity"

# 3. Register
git commit -m "feat: register Product in standard objects"

# 4. Frontend
git commit -m "feat: add Product to frontend navigation"
```

**Tips:**
- ✅ Commit từng bước nhỏ
- ✅ Descriptive messages
- ✅ Follow conventional commits

---

## FAQ

### Q: Khi nào tạo Standard Object vs Custom Object?
A: Standard Object cho features cần có sẵn cho tất cả workspaces. Custom Object cho user-specific needs.

### Q: Có thể sửa Standard Object sau khi deploy?
A: Có, nhưng cần migration. Tránh xóa fields đã deploy (mất data).

### Q: Timeline Activity có bắt buộc không?
A: Không. Chỉ thêm nếu object cần audit trail/activity history.

### Q: Có giới hạn số lượng fields?
A: Không hard limit, nhưng nên < 30 fields cho performance.

### Q: Có thể có nhiều Label Identifier?
A: Không. Chỉ 1 `labelIdentifierStandardId` làm title chính.

### Q: Search vector tốn bao nhiêu storage?
A: ~10-20% size của text fields được index.

### Q: Khi nào dùng CASCADE vs SET_NULL?
A: CASCADE khi xóa parent phải xóa children. SET_NULL khi children có thể tồn tại độc lập. **Timeline relations LUÔN dùng SET_NULL.**

### Q: Có thể thêm custom validators?
A: Chưa support trong decorators. Validate ở service layer.

### Q: Migration có rollback tự động?
A: Không. Cần rollback thủ công bằng SQL.

### Q: Test migration trên dev database?
A: Có, nên test local/dev trước production.

---

## 🎯 Case Study: Material Management System

### Background
Thực hiện 4 standard objects cho hệ thống quản lý vật tư PCU-Server:
- **Material** - Quản lý vật tư
- **Supplier** - Nhà cung cấp
- **Manufacturer** - Nhà sản xuất
- **MaterialGroup** - Nhóm vật tư

### Key Lessons Learned

#### 1. Timeline Activity Integration Challenge

**Problem:** Server crash với lỗi:
```
Error: Field metadata for field "supplierId" is missing in object metadata timelineActivity
```

**Root Cause:**
- Thêm UUID vào `TIMELINE_ACTIVITY_STANDARD_FIELD_IDS` ✅
- Nhưng chưa implement relations đúng cách ❌

**Solution Pattern:**
```typescript
// 1. Trong timeline-activity.workspace-entity.ts
@WorkspaceRelation({
  standardId: TIMELINE_ACTIVITY_STANDARD_FIELD_IDS.supplier,
  type: RelationType.MANY_TO_ONE,
  label: msg`Supplier`,
  description: msg`Event supplier`,
  icon: 'IconTruck',
  inverseSideTarget: () => SupplierWorkspaceEntity,
  inverseSideFieldKey: 'timelineActivities', // 🔥 Key point
  onDelete: RelationOnDeleteAction.SET_NULL, // 🔥 Not CASCADE
})
@WorkspaceIsNullable()
supplier: Relation<SupplierWorkspaceEntity> | null;

@WorkspaceJoinColumn('supplier')
supplierId: string | null;

// 2. Trong supplier.workspace-entity.ts
@WorkspaceRelation({
  standardId: SUPPLIER_STANDARD_FIELD_IDS.timelineActivities,
  type: RelationType.ONE_TO_MANY,
  label: msg`Timeline Activities`,
  description: msg`Timeline Activities linked to the supplier`,
  icon: 'IconTimelineEvent',
  inverseSideTarget: () => TimelineActivityWorkspaceEntity,
  inverseSideFieldKey: 'supplier', // 🔥 Match field name
  // 🔥 NO onDelete for ONE_TO_MANY
})
@WorkspaceIsNullable()
@WorkspaceIsSystem() // 🔥 Timeline is system field
timelineActivities: Relation<TimelineActivityWorkspaceEntity[]>;
```

#### 2. Entity Relationship Patterns

**Complex Relations Implemented:**

```
MaterialGroup (1) ←→ (N) Material
MaterialGroup (1) ←→ (N) Supplier
MaterialGroup (1) ←→ (N) Manufacturer
Material (1) ←→ (N) Inventory
```

**Key Pattern:**
```typescript
// Many-to-One side (Material → MaterialGroup)
@WorkspaceRelation({
  type: RelationType.MANY_TO_ONE,
  inverseSideTarget: () => MaterialGroupWorkspaceEntity,
  inverseSideFieldKey: 'materials', // Field name in MaterialGroup
  onDelete: RelationOnDeleteAction.SET_NULL,
})
materialGroup: Relation<MaterialGroupWorkspaceEntity> | null;

@WorkspaceJoinColumn('materialGroup')
materialGroupId: string | null;

// One-to-Many side (MaterialGroup → Materials)
@WorkspaceRelation({
  type: RelationType.ONE_TO_MANY,
  inverseSideTarget: () => MaterialWorkspaceEntity,
  inverseSideFieldKey: 'materialGroup', // Field name in Material
  // No onDelete for ONE_TO_MANY
})
materials: Relation<MaterialWorkspaceEntity[]>;
```

#### 3. Field Type Best Practices

**SELECT Fields with Enums:**
```typescript
enum MaterialStatus {
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PENDING = 'pending',
}

@WorkspaceField({
  type: FieldMetadataType.SELECT,
  options: [
    { value: MaterialStatus.APPROVED, label: 'Approved', position: 0, color: 'green' },
    { value: MaterialStatus.REJECTED, label: 'Rejected', position: 1, color: 'red' },
    { value: MaterialStatus.PENDING, label: 'Pending', position: 2, color: 'yellow' },
  ],
  defaultValue: `'${MaterialStatus.PENDING}'`, // Template string format
})
status: string;
```

#### 4. Search Vector Implementation

**Pattern cho Multi-field Search:**
```typescript
const MATERIAL_CODE_FIELD_NAME = 'materialCode';
const MATERIAL_NAME_FIELD_NAME = 'materialName';

export const SEARCH_FIELDS_FOR_MATERIAL: FieldTypeAndNameMetadata[] = [
  { name: MATERIAL_CODE_FIELD_NAME, type: FieldMetadataType.TEXT },
  { name: MATERIAL_NAME_FIELD_NAME, type: FieldMetadataType.TEXT },
];

@WorkspaceField({
  type: FieldMetadataType.TS_VECTOR,
  generatedType: 'STORED',
  asExpression: getTsVectorColumnExpressionFromFields(SEARCH_FIELDS_FOR_MATERIAL),
})
@WorkspaceFieldIndex({ indexType: IndexType.GIN })
searchVector: string;
```

#### 5. Localization Experience

**Vietnamese → English Conversion:**
- Phát hiện cần convert tất cả labels sang tiếng Anh
- Dùng `sed` commands hàng loạt:

```bash
sed -i '' -e 's/label: msg`Mã vật liệu`/label: msg`Material Code`/g' *.ts
sed -i '' -e 's/description: msg`Mã định danh vật liệu`/description: msg`Material identification code`/g' *.ts
```

### Performance & Migration Notes

#### Constants File Organization
- **4 Files Updated:** `standard-object-ids.ts`, `standard-field-ids.ts`, `standard-object-icons.ts`, `standard-objects-by-priority-rank.ts`
- **UUIDs Generated:** 100+ unique UUIDs for 4 entities + timeline
- **Pattern:** Lowercase UUIDs, consistent naming

#### Migration Process
1. **Build Time:** ~30 seconds (TypeScript compilation)
2. **Sync Metadata:** ~10 seconds (database schema generation)
3. **Index Creation:** GIN indexes for search vectors
4. **Relation Constraints:** Foreign keys with proper cascade rules

### Final Architecture

```
TimelineActivity ←→ Material ←→ MaterialGroup ←→ Supplier
                ↓              ↓              ↓
               Inventory    Manufacturer   (Materials)
```

**Key Metrics:**
- **4 New Standard Objects**
- **50+ Business Fields**
- **12+ Relations** (bidirectional)
- **4 Timeline Integrations**
- **Full-text Search** on all entities
- **Complete English Localization**

### Recommendations

1. ⚠️ **Timeline relations cần đặc biệt cẩn thận** - Pattern khác business relations
2. 🔄 **Test relations từng bước** - Dễ debug hơn khi làm hàng loạt
3. 📝 **Constants organization** - Tạo UUIDs trước, organize theo alphabet
4. 🌐 **Plan localization early** - Tránh phải convert sau
5. 🔍 **Search vector setup** - Define search fields trước khi implement entity

---

## Xóa Standard Object

Nếu cần xóa một standard object khỏi hệ thống, làm theo quy trình ngược lại:

### Quy Trình Xóa (Reverse Process)

**⚠️ CẢNH BÁO:** Xóa standard object sẽ mất dữ liệu! Luôn backup database trước.

#### 1. Xóa Timeline Relations (nếu có)

**File:** `timeline-activity.workspace-entity.ts`

Xóa relation và joinColumn:
```typescript
// XÓA các dòng này:
@WorkspaceRelation({...})
department: Relation<DepartmentWorkspaceEntity> | null;

@WorkspaceJoinColumn('department')
departmentId: string | null;
```

#### 2. Xóa Backend Registration

**File:** `standard-objects/index.ts`

```typescript
// XÓA import
import { ProductWorkspaceEntity } from '...';

// XÓA khỏi array
export const standardObjectMetadataDefinitions = [
  // ... ProductWorkspaceEntity, // ← Xóa dòng này
];
```

#### 3. Xóa Entity Files

```bash
# Xóa toàn bộ module folder
rm -rf packages/twenty-server/src/modules/product/
```

#### 4. Xóa Constants

**4 files cần update:**
- `standard-object-ids.ts` - Xóa entry trong `STANDARD_OBJECT_IDS`
- `standard-field-ids.ts` - Xóa constant `PRODUCT_STANDARD_FIELD_IDS`
- `standard-object-icons.ts` - Xóa entry trong `STANDARD_OBJECT_ICONS`
- `standard-objects-by-priority-rank.ts` - Xóa entry

#### 5. Xóa Timeline Field IDs (nếu có)

**File:** `standard-field-ids.ts`

```typescript
export const TIMELINE_ACTIVITY_STANDARD_FIELD_IDS = {
  // ... product: 'uuid', // ← Xóa dòng này
} as const;
```

#### 6. Xóa Frontend References (nếu có)

**3 files cần update:**
- `CoreObjectNameSingular.ts` - Xóa enum entry
- `NavigationDrawerSectionForObjectMetadataItems.tsx` - Xóa khỏi `ORDERED_STANDARD_OBJECTS`
- `getIconColorForObjectType.ts` - Xóa case

#### 7. Xóa Views (nếu có)

**Files:**
- Xóa view file: `views/products-all.view.ts`
- Xóa import và entry trong `prefill-core-views.ts`

```typescript
// prefill-core-views.ts
// XÓA import
import { productsAllView } from './views/products-all.view';

// XÓA khỏi array
const views = [
  // productsAllView, // ← Xóa dòng này
];
```

#### 8. Build và Sync Metadata

```bash
cd packages/twenty-server
yarn build
yarn command:prod workspace:sync-metadata
```

**Database changes:**
- Table `[workspaceId]_products` sẽ bị xóa
- Metadata entries sẽ bị xóa
- Relations sẽ bị xóa
- **⚠️ DỮ LIỆU SẼ MẤT VĨNH VIỄN**

### Checklist Xóa Object

Backend:
- [ ] Xóa timeline relations trong `timeline-activity.workspace-entity.ts`
- [ ] Xóa imports và entries trong `standard-objects/index.ts`
- [ ] Xóa module folder
- [ ] Xóa constants (4 files)
- [ ] Xóa timeline field IDs
- [ ] Xóa view files và registrations

Frontend:
- [ ] Xóa `CoreObjectNameSingular` entry
- [ ] Xóa khỏi `ORDERED_STANDARD_OBJECTS`
- [ ] Xóa icon color case

Migration:
- [ ] Backup database
- [ ] Build server
- [ ] Sync metadata
- [ ] Verify trong database

### Ví Dụ Thực Tế

Xem commit history của việc xóa 7 objects: employee, department, team, employeeAward, employeeLevel, employmentType, organizationPosition.

**Files changed:**
- 7 entity files deleted
- 7 view files deleted
- 4 constant files modified
- 3 frontend files modified
- 1 timeline file modified
- 1 registration file modified

---



**Code Examples:**
- Simple: `company`, `person`, `opportunity`
- Complex: `employee`, `department`, `team`

**Key Paths:**
- Constants: `packages/twenty-server/src/engine/workspace-manager/workspace-sync-metadata/constants/`
- Decorators: `packages/twenty-server/src/engine/twenty-orm/decorators/`
- Composite Types: `packages/twenty-server/src/engine/metadata-modules/field-metadata/composite-types/`

**External:**
- [Tabler Icons](https://tabler.io/icons)

---

## Kết Luận

Standard Object là nền tảng của Twenty. Quy trình 7 bước:

1. **Chuẩn bị** - UUIDs & constants (4 files)
2. **Định nghĩa** - Workspace entity
3. **Relations** - Liên kết objects (nếu cần)
4. **Timeline** - Activity integration (nếu cần)
5. **Đăng ký** - Import vào array
6. **Frontend** - UI updates (nếu cần)
7. **Migration** - Build & sync metadata

**Yêu cầu bắt buộc:**
- ✅ UUID duy nhất
- ✅ System fields: `position`, `createdBy`
- ✅ Search vector (nếu searchable)
- ✅ Constants (không hard-code)
- ✅ i18n với `msg` macro
- ✅ Relations 2 chiều (nếu có)

**Nếu gặp vấn đề:**
1. Xem Troubleshooting section
2. Check error logs
3. So sánh với existing objects
4. Test từng bước
5. Rollback và thử lại

**Chúc bạn coding vui vẻ! 🚀**

---

_Phiên bản quick reference: Xem `ADDING_STANDARD_OBJECT_QUICKSTART.md`_

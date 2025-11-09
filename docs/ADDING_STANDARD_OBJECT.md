# Hướng Dẫn Thêm Standard Object Mới Vào Twenty

## Tổng Quan

Standard Object là các đối tượng dữ liệu cốt lõi được định nghĩa sẵn trong hệ thống Twenty (như Company, Person, Opportunity, Task, Department, Employee, Team...). Khác với Custom Object (do người dùng tự tạo), Standard Object được hard-code vào source code và có sẵn cho tất cả workspace.

Hướng dẫn này sẽ chỉ ra cách thêm một Standard Object mới vào hệ thống, bao gồm tất cả các file cần tạo và cập nhật.

## Cấu Trúc Thư Mục

Mỗi Standard Object thường được tổ chức trong một module riêng biệt với cấu trúc như sau:

```
packages/twenty-server/src/modules/
└── [tên-module]/                          # Tên module (ví dụ: product, employee)
    ├── standard-objects/                   # Thư mục chứa workspace entity
    │   └── [tên-module].workspace-entity.ts
    ├── constants/                          # (Tùy chọn) Constants cho module
    │   └── [tên-constant].ts
    └── ...                                 # Các thư mục khác (services, resolvers...)
```

## Tổng Quan Các Bước

1. ✅ **Chuẩn bị UUIDs và Constants**
2. ✅ **Tạo module và workspace entity**
3. ✅ **Thêm relations (nếu cần)**
4. ✅ **Thêm decorators đặc biệt (nếu cần)**
5. ✅ **Đăng ký object vào index**
6. ✅ **Cập nhật frontend (nếu cần)**
7. ✅ **Chạy migration**

---

## Các Bước Thực Hiện Chi Tiết

### Bước 1: Chuẩn Bị IDs và Constants

#### 1.1. Tạo UUID cho Object và Fields

Trước tiên, bạn cần tạo các UUID duy nhất cho:
- Object standardId (1 cái)
- Mỗi field standardId (nhiều cái)

**Cách tạo UUID:**

```bash
# Trên macOS/Linux (tạo lowercase UUID)
uuidgen | tr '[:upper:]' '[:lower:]'

# Hoặc dùng online tool
https://www.uuidgenerator.net/
```

**Lưu ý:** Lưu lại các UUID này, bạn sẽ cần sử dụng chúng ở nhiều nơi.

#### 1.2. Thêm Object ID vào `standard-object-ids.ts`

**File:** `packages/twenty-server/src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids.ts`

Thêm ID của object mới vào constant:

```typescript
export const STANDARD_OBJECT_IDS = {
  // ... existing objects
  product: '[UUID-MỚI]', // UUID bạn vừa tạo
} as const;
```

**Ví dụ thực tế:**
```typescript
export const STANDARD_OBJECT_IDS = {
  company: '20202020-b374-4779-a561-80086cb2e17f',
  person: '20202020-e674-48e5-a542-72570eee7213',
  product: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', // ← Thêm dòng này
} as const;
```

#### 1.3. Thêm Field IDs vào `standard-field-ids.ts`

**File:** `packages/twenty-server/src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids.ts`

Tạo một constant chứa tất cả field IDs của object:

```typescript
export const PRODUCT_STANDARD_FIELD_IDS = {
  name: '[UUID-MỚI]',
  description: '[UUID-MỚI]',
  price: '[UUID-MỚI]',
  position: '[UUID-MỚI]',
  createdBy: '[UUID-MỚI]',
  searchVector: '[UUID-MỚI]',
  // ... các field khác
} as const;
```

**Ví dụ thực tế:**
```typescript
export const PRODUCT_STANDARD_FIELD_IDS = {
  name: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  description: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
  price: 'd4e5f6a7-b8c9-0123-def1-234567890123',
  position: 'e5f6a7b8-c9d0-1234-ef12-345678901234',
  createdBy: 'f6a7b8c9-d0e1-2345-f123-456789012345',
  searchVector: 'a7b8c9d0-e1f2-3456-0123-456789abcdef',
} as const;
```

#### 1.4. Thêm Icon vào `standard-object-icons.ts`

**File:** `packages/twenty-server/src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-icons.ts`

Thêm icon cho object:

```typescript
export const STANDARD_OBJECT_ICONS = {
  // ... existing icons
  product: 'IconBox', // Icon từ Tabler Icons
} as const;
```

**Lưu ý:** Icon phải là tên icon hợp lệ từ [Tabler Icons](https://tabler.io/icons) với prefix `Icon`.

---

### Bước 2: Tạo Module và Workspace Entity

#### 2.1. Tạo Thư Mục Module

```bash
mkdir -p packages/twenty-server/src/modules/product/standard-objects
```

#### 2.2. Tạo File Workspace Entity

**Đường dẫn:** `packages/twenty-server/src/modules/product/standard-objects/product.workspace-entity.ts`

**Đường dẫn:** `packages/twenty-server/src/modules/product/standard-objects/product.workspace-entity.ts`

**Template cơ bản cho Workspace Entity:**

```typescript
import { msg } from '@lingui/core/macro';
import { FieldMetadataType, RelationOnDeleteAction } from 'twenty-shared/types';

import { SEARCH_VECTOR_FIELD } from 'src/engine/metadata-modules/constants/search-vector-field.constants';
import { ActorMetadata } from 'src/engine/metadata-modules/field-metadata/composite-types/actor.composite-type';
import { IndexType } from 'src/engine/metadata-modules/index-metadata/types/indexType.types';
import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { WorkspaceEntity } from 'src/engine/twenty-orm/decorators/workspace-entity.decorator';
import { WorkspaceFieldIndex } from 'src/engine/twenty-orm/decorators/workspace-field-index.decorator';
import { WorkspaceField } from 'src/engine/twenty-orm/decorators/workspace-field.decorator';
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

// Định nghĩa các field sẽ được search
const NAME_FIELD_NAME = 'name';

export const SEARCH_FIELDS_FOR_PRODUCT: FieldTypeAndNameMetadata[] = [
  { name: NAME_FIELD_NAME, type: FieldMetadataType.TEXT },
];

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.product,        // Dùng constant đã tạo
  namePlural: 'products',                         // Tên số nhiều (dùng trong API)
  labelSingular: msg`Product`,                    // Label số ít (hiển thị UI)
  labelPlural: msg`Products`,                     // Label số nhiều (hiển thị UI)
  description: msg`A product in the system`,      // Mô tả
  icon: STANDARD_OBJECT_ICONS.product,           // Dùng constant đã tạo
  shortcut: 'P',                                  // Phím tắt (tùy chọn)
  labelIdentifierStandardId: PRODUCT_STANDARD_FIELD_IDS.name,  // Field identifier chính
  imageIdentifierStandardId: PRODUCT_STANDARD_FIELD_IDS.imageUrl, // (Tùy chọn) Field cho avatar/image
})
@WorkspaceIsSearchable()  // Cho phép search full-text
export class ProductWorkspaceEntity extends BaseWorkspaceEntity {
  // Field chính (Label Identifier)
  @WorkspaceField({
    standardId: PRODUCT_STANDARD_FIELD_IDS.name,  // Dùng constant đã tạo
    type: FieldMetadataType.TEXT,
    label: msg`Name`,
    description: msg`Product name`,
    icon: 'IconBox',
  })
  name: string;

  // Các field khác (nullable)
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

  // System fields (BẮT BUỘC)
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

  // Search vector (BẮT BUỘC nếu @WorkspaceIsSearchable())
  @WorkspaceField({
    standardId: PRODUCT_STANDARD_FIELD_IDS.searchVector,
    type: FieldMetadataType.TS_VECTOR,
    label: SEARCH_VECTOR_FIELD.label,
    description: SEARCH_VECTOR_FIELD.description,
    icon: 'IconBox',
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

---

### Bước 3: Thêm Relations (Nếu Cần)

---

### Bước 3: Thêm Relations (Nếu Cần)

Nếu object của bạn cần liên kết với các object khác, hãy thêm relations. Nhớ import thêm:

```typescript
import { RelationType } from 'src/engine/metadata-modules/field-metadata/interfaces/relation-type.interface';
import { Relation } from 'src/engine/workspace-manager/workspace-sync-metadata/interfaces/relation.interface';
import { WorkspaceJoinColumn } from 'src/engine/twenty-orm/decorators/workspace-join-column.decorator';
import { WorkspaceRelation } from 'src/engine/twenty-orm/decorators/workspace-relation.decorator';
```

#### 3.1. Many-to-One Relation

Ví dụ: Product thuộc về một Category

```typescript
// Thêm vào ProductWorkspaceEntity class:
import { CategoryWorkspaceEntity } from 'src/modules/category/standard-objects/category.workspace-entity';

@WorkspaceRelation({
  standardId: PRODUCT_STANDARD_FIELD_IDS.category,  // Thêm vào constant
  type: RelationType.MANY_TO_ONE,
  label: msg`Category`,
  description: msg`Product category`,
  icon: 'IconTag',
  inverseSideTarget: () => CategoryWorkspaceEntity,
  inverseSideFieldKey: 'products',
  onDelete: RelationOnDeleteAction.SET_NULL,
})
@WorkspaceIsNullable()
category: Relation<CategoryWorkspaceEntity> | null;

@WorkspaceJoinColumn('category')
categoryId: string | null;
```

#### 3.2. One-to-Many Relation

Ví dụ: Category có nhiều Products

```typescript
// Trong CategoryWorkspaceEntity class:
import { ProductWorkspaceEntity } from 'src/modules/product/standard-objects/product.workspace-entity';

@WorkspaceRelation({
  standardId: CATEGORY_STANDARD_FIELD_IDS.products,  // Thêm vào constant
  type: RelationType.ONE_TO_MANY,
  label: msg`Products`,
  description: msg`Products in this category`,
  icon: 'IconBox',
  inverseSideTarget: () => ProductWorkspaceEntity,
  inverseSideFieldKey: 'category',
  onDelete: RelationOnDeleteAction.SET_NULL,
})
@WorkspaceIsNullable()
products: Relation<ProductWorkspaceEntity[]>;
```

**Lưu ý quan trọng về Relations:**
- `inverseSideTarget`: Trỏ đến entity liên kết
- `inverseSideFieldKey`: Tên field ở phía bên kia của relation
- `onDelete`: Hành động khi xóa (SET_NULL, CASCADE, RESTRICT)
- Many-to-One cần thêm `@WorkspaceJoinColumn` và field `[name]Id`
- Relation 2 chiều: Phải định nghĩa ở cả 2 entity

---

### Bước 4: Thêm Decorators Đặc Biệt (Nếu Cần)

#### 4.1. Duplicate Criteria

Nếu object cần chức năng merge duplicates, định nghĩa duplicate criteria:

```typescript
@WorkspaceDuplicateCriteria([
  ['name'],                           // Tìm duplicate theo name
  ['emailsPrimaryEmail'],            // HOẶC theo email
  ['linkedinLinkPrimaryLinkUrl'],   // HOẶC theo LinkedIn URL
])
export class PersonWorkspaceEntity extends BaseWorkspaceEntity {
  // ...
}
```

**Lưu ý:** Mỗi array con là một criteria, sử dụng OR logic giữa các arrays.

#### 4.2. Audit Logging

Mặc định tất cả objects đều có audit logging. Để tắt:

```typescript
@WorkspaceIsNotAuditLogged()
export class MessageWorkspaceEntity extends BaseWorkspaceEntity {
  // Message không cần audit log vì có quá nhiều
}
```

**Khi nào tắt audit logging:**
- Objects có volume cao (Message, MessageThread...)
- Objects system internal
- Objects không quan trọng cho business logic

#### 4.3. Feature Gating

Để ẩn object đằng sau feature flag:

```typescript
@WorkspaceGate({
  featureFlag: 'IS_PRODUCT_FEATURE_ENABLED',
  excludeFromDatabase: true,       // Không tạo table nếu flag tắt
  excludeFromWorkspaceApi: true,   // Không expose API nếu flag tắt
})
export class ProductWorkspaceEntity extends BaseWorkspaceEntity {
  // Object này chỉ xuất hiện khi feature flag được bật
}
```

**Lưu ý:**
- Feature flag phải là **internal flag** (không public)
- Hữu ích cho features đang development hoặc beta testing
- Không dùng cho objects production stable

#### 4.4. Image Identifier

Nếu object cần hiển thị avatar/image trong UI:

```typescript
@WorkspaceEntity({
  // ... other options
  labelIdentifierStandardId: PERSON_STANDARD_FIELD_IDS.name,
  imageIdentifierStandardId: PERSON_STANDARD_FIELD_IDS.avatarUrl, // ← Thêm này
})
export class PersonWorkspaceEntity extends BaseWorkspaceEntity {
  // ... fields

  @WorkspaceField({
    standardId: PERSON_STANDARD_FIELD_IDS.avatarUrl,
    type: FieldMetadataType.TEXT,
    label: msg`Avatar`,
    description: msg`Contact's avatar`,
    icon: 'IconFileUpload',
  })
  @WorkspaceIsNullable()
  avatarUrl: string | null;
}
```

**Ví dụ:** Person, Company, WorkspaceMember có avatarUrl/logoUrl.

---

### Bước 5: Thêm Module Constants (Nếu Cần)

Constants được dùng để lưu các giá trị cấu hình, batch size, timeout, và các hằng số khác liên quan đến module.

#### 4.1. Tạo File Constants

**Ví dụ:** Tạo batch size cho việc import products

**File:** `packages/twenty-server/src/modules/product/constants/product-import-batch-size.ts`

```typescript
export const PRODUCT_IMPORT_BATCH_SIZE = 100;
```

**Các loại constants phổ biến:**
- Batch size cho import/export
- Timeout values
- Throttle limits
- Default values
- Max attempts
- API limits

---

### Bước 5: Đăng Ký Standard Object

---

### Bước 6: Đăng Ký Standard Object

#### 6.1. Import và Thêm vào Array

**File:** `packages/twenty-server/src/engine/workspace-manager/workspace-sync-metadata/standard-objects/index.ts`

**Bước 1:** Thêm import ở đầu file (theo thứ tự alphabet):

```typescript
// ... existing imports
import { ProductWorkspaceEntity } from 'src/modules/product/standard-objects/product.workspace-entity';
// ... other imports
```

**Bước 2:** Thêm vào array `standardObjectMetadataDefinitions` (theo thứ tự alphabet):

```typescript
export const standardObjectMetadataDefinitions = [
  AttachmentWorkspaceEntity,
  BlocklistWorkspaceEntity,
  // ... existing entities
  ProductWorkspaceEntity,        // ← Thêm vào đây
  // ... other entities
];
```

**Lưu ý:** Danh sách thường được sắp xếp theo alphabet để dễ quản lý.

---

### Bước 7: Cập Nhật Frontend (Nếu Cần)

Nếu object cần hiển thị trong navigation hoặc UI, cập nhật frontend.

#### 7.1. Thêm Vào CoreObjectNameSingular

**File:** `packages/twenty-front/src/modules/object-metadata/types/CoreObjectNameSingular.ts`

```typescript
export enum CoreObjectNameSingular {
  // ... existing objects
  Product = 'product',
}
```

#### 7.2. Thêm Vào Navigation (Tùy chọn)

**File:** `packages/twenty-front/src/modules/object-metadata/components/NavigationDrawerSectionForObjectMetadataItems.tsx`

Nếu muốn object xuất hiện trong navigation với thứ tự cụ thể:

```typescript
const ORDERED_STANDARD_OBJECTS: string[] = [
  CoreObjectNameSingular.Person,
  CoreObjectNameSingular.Company,
  CoreObjectNameSingular.Opportunity,
  CoreObjectNameSingular.Product,    // ← Thêm vào đây
  CoreObjectNameSingular.Task,
  // ... other objects
];
```

---

### Bước 8: Chạy Migration

Sau khi hoàn tất tất cả các bước trên, cần sync metadata để cập nhật database schema.

#### 8.1. Build Server

```bash
cd packages/twenty-server
yarn build
```

#### 8.2. Sync Metadata

**Sync cho một workspace cụ thể:**

#### 8.2. Sync Metadata

**Sync cho một workspace cụ thể:**
```bash
yarn command:prod workspace:sync-metadata -w [workspace-id]
```

**Sync cho tất cả workspaces:**
```bash
yarn command:prod workspace:sync-metadata
```

**Lưu ý:** Migration này sẽ:
- Tạo bảng mới trong database
- Tạo các column cho tất cả fields
- Tạo indexes
- Tạo relations/foreign keys

---

## Tham Số Chi Tiết của @WorkspaceEntity

```typescript
@WorkspaceEntity({
  standardId: string,                    // BẮT BUỘC - UUID duy nhất
  namePlural: string,                    // BẮT BUỘC - Tên số nhiều cho API
  labelSingular: MessageDescriptor,      // BẮT BUỘC - Label UI số ít (dùng msg`...`)
  labelPlural: MessageDescriptor,        // BẮT BUỘC - Label UI số nhiều (dùng msg`...`)
  description?: MessageDescriptor,       // Tùy chọn - Mô tả object
  icon?: string,                         // Tùy chọn - Icon (từ Tabler Icons)
  shortcut?: string,                     // Tùy chọn - Phím tắt (1 ký tự)
  labelIdentifierStandardId?: string,    // Tùy chọn - Field ID làm label chính (mặc định: id)
  imageIdentifierStandardId?: string,    // Tùy chọn - Field ID cho avatar/image
})
```

**Chi tiết:**
- **standardId**: UUID từ `STANDARD_OBJECT_IDS`
- **namePlural**: lowercase, số nhiều (ví dụ: `products`, `people`)
- **labelSingular/labelPlural**: Dùng `msg` macro cho i18n
- **icon**: `Icon` + tên icon từ Tabler (ví dụ: `IconBox`)
- **shortcut**: Chữ cái viết hoa (ví dụ: `P` cho Product)
- **labelIdentifierStandardId**: Field ID của field sẽ hiển thị làm title (thường là `name`)
- **imageIdentifierStandardId**: Field ID của field chứa URL hình ảnh (ví dụ: `avatarUrl`)

---

## Các Loại Field Metadata Type Phổ Biến

---

## Các Loại Field Metadata Type Phổ Biến

### Primitive Types

```typescript
// Text - Chuỗi văn bản
type: FieldMetadataType.TEXT

// Number - Số
type: FieldMetadataType.NUMBER

// Boolean - True/False
type: FieldMetadataType.BOOLEAN

// Date Time - Ngày giờ
type: FieldMetadataType.DATE_TIME

// Raw JSON - JSON object
type: FieldMetadataType.RAW_JSON

// Rating - Đánh giá (1-5 sao)
type: FieldMetadataType.RATING

// Select - Lựa chọn đơn
type: FieldMetadataType.SELECT

// Multi-Select - Lựa chọn nhiều
type: FieldMetadataType.MULTI_SELECT
```

### Composite Types (Kiểu phức hợp)

```typescript
// Full Name - Tên đầy đủ (firstName, lastName)
type: FieldMetadataType.FULL_NAME

// Emails - Danh sách email
type: FieldMetadataType.EMAILS

// Phones - Danh sách điện thoại
type: FieldMetadataType.PHONES

// Links - Danh sách URL
type: FieldMetadataType.LINKS

// Address - Địa chỉ đầy đủ
type: FieldMetadataType.ADDRESS

// Currency - Tiền tệ (amount, currency code)
type: FieldMetadataType.CURRENCY

// Actor - Người thực hiện (name, source)
type: FieldMetadataType.ACTOR
```

### System Types

```typescript
// UUID - ID duy nhất
type: FieldMetadataType.UUID

// Position - Vị trí sắp xếp
type: FieldMetadataType.POSITION

// TS_VECTOR - Full-text search vector
type: FieldMetadataType.TS_VECTOR
```

**Ví dụ sử dụng Composite Type:**

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

## Decorators Phổ Biến
### Entity Decorators

```typescript
// Đánh dấu class là workspace entity
@WorkspaceEntity({...})

// Cho phép search full-text
@WorkspaceIsSearchable()

// Định nghĩa duplicate criteria (để merge records)
@WorkspaceDuplicateCriteria([['name'], ['email']])

// Tắt audit logging cho object này (không lưu lịch sử thay đổi)
@WorkspaceIsNotAuditLogged()

// Gating object với feature flag (chỉ hiển thị khi flag bật)
@WorkspaceGate({
  featureFlag: 'IS_PRODUCT_ENABLED',
  excludeFromDatabase: true,      // Không tạo table nếu flag tắt
  excludeFromWorkspaceApi: true,  // Không expose API nếu flag tắt
})
```rkspaceDuplicateCriteria([['name'], ['email']])
```

### Field Decorators

```typescript
// Đánh dấu field là nullable
@WorkspaceIsNullable()

// Đánh dấu field là system field (không thể xóa/edit)
@WorkspaceIsSystem()

// Đánh dấu field là read-only trong UI
@WorkspaceIsFieldUIReadOnly()

// Đánh dấu field là unique
@WorkspaceIsUnique()

// Đánh dấu field là deprecated (sắp bị xóa)
@WorkspaceIsDeprecated()

// Tạo index cho field
@WorkspaceFieldIndex({ indexType: IndexType.GIN })
@WorkspaceFieldIndex({ indexType: IndexType.BTREE })
```

### Relation Decorators

```typescript
// Định nghĩa relation
@WorkspaceRelation({...})

// Định nghĩa join column (cho many-to-one)
@WorkspaceJoinColumn('fieldName')
```

---

## Checklist Hoàn Chỉnh

### Ví Dụ 1: Object Đơn Giản (Product)

### Ví Dụ 1: Simple Object (Product - Không có relations)

#### Bước 1: Thêm vào constants

**File: `standard-object-ids.ts`**
```typescript
export const STANDARD_OBJECT_IDS = {
  // ... existing
  product: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
} as const;
```

**File: `standard-field-ids.ts`**
```typescript
export const PRODUCT_STANDARD_FIELD_IDS = {
  name: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  description: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
  price: 'd4e5f6a7-b8c9-0123-def1-234567890123',
  sku: 'e5f6a7b8-c9d0-1234-ef12-345678901234',
  position: 'f6a7b8c9-d0e1-2345-f123-456789012345',
  createdBy: 'a7b8c9d0-e1f2-3456-0123-456789abcdef',
  searchVector: 'b8c9d0e1-f2a3-4567-1234-56789abcdef0',
} as const;
```

**File: `standard-object-icons.ts`**
```typescript
export const STANDARD_OBJECT_ICONS = {
  // ... existing
  product: 'IconBox',
} as const;
```

#### Bước 2: Tạo workspace entity

**File: `packages/twenty-server/src/modules/product/standard-objects/product.workspace-entity.ts`**

```typescript
import { msg } from '@lingui/core/macro';
import { FieldMetadataType } from 'twenty-shared/types';

import { SEARCH_VECTOR_FIELD } from 'src/engine/metadata-modules/constants/search-vector-field.constants';
import { ActorMetadata } from 'src/engine/metadata-modules/field-metadata/composite-types/actor.composite-type';
import { IndexType } from 'src/engine/metadata-modules/index-metadata/types/indexType.types';
import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { WorkspaceEntity } from 'src/engine/twenty-orm/decorators/workspace-entity.decorator';
import { WorkspaceFieldIndex } from 'src/engine/twenty-orm/decorators/workspace-field-index.decorator';
import { WorkspaceField } from 'src/engine/twenty-orm/decorators/workspace-field.decorator';
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

const NAME_FIELD_NAME = 'name';
const SKU_FIELD_NAME = 'sku';

export const SEARCH_FIELDS_FOR_PRODUCT: FieldTypeAndNameMetadata[] = [
  { name: NAME_FIELD_NAME, type: FieldMetadataType.TEXT },
  { name: SKU_FIELD_NAME, type: FieldMetadataType.TEXT },
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

  @WorkspaceField({
    standardId: PRODUCT_STANDARD_FIELD_IDS.sku,
    type: FieldMetadataType.TEXT,
    label: msg`SKU`,
    description: msg`Stock Keeping Unit`,
    icon: 'IconHash',
  })
  @WorkspaceIsNullable()
  sku: string | null;

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

  @WorkspaceField({
    standardId: PRODUCT_STANDARD_FIELD_IDS.searchVector,
    type: FieldMetadataType.TS_VECTOR,
    label: SEARCH_VECTOR_FIELD.label,
    description: SEARCH_VECTOR_FIELD.description,
    icon: 'IconBox',
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

#### Bước 3: Đăng ký vào index

**File: `standard-objects/index.ts`**
```typescript
import { ProductWorkspaceEntity } from 'src/modules/product/standard-objects/product.workspace-entity';

export const standardObjectMetadataDefinitions = [
  // ... existing entities (alphabetically)
  ProductWorkspaceEntity,
  // ... other entities
];
```

---

### Ví Dụ 2: Object Với Relations (Employee có relations với Department, Team...)

---

## Checklist Hoàn Chỉnh

Khi thêm Standard Object mới, đảm bảo bạn đã:

### Backend (Server)

**Bước 1: Chuẩn bị Constants**
- [ ] **Tạo UUID** cho object và tất cả fields
- [ ] **Thêm object ID** vào `standard-object-ids.ts`
- [ ] **Thêm field IDs** vào `standard-field-ids.ts` (tạo constant `[OBJECT]_STANDARD_FIELD_IDS`)
- [ ] **Thêm icon** vào `standard-object-icons.ts`

**Bước 2: Tạo Entity**
- [ ] **Tạo module folder** `packages/twenty-server/src/modules/[tên-module]/standard-objects/`
- [ ] **Tạo workspace entity file** `[tên-module].workspace-entity.ts`
- [ ] **Định nghĩa @WorkspaceEntity** decorator với đầy đủ options
- [ ] **Định nghĩa tất cả fields** cần thiết
- [ ] **Thêm system fields** bắt buộc: `position`, `createdBy`
- [ ] **Thêm search vector** (nếu object là searchable - `@WorkspaceIsSearchable()`)
- [ ] **Sử dụng constants** cho tất cả standardId

### Frontend (Nếu cần)

- [ ] **Thêm vào CoreObjectNameSingular.ts** (nếu cần hiển thị trong UI)
- [ ] **Thêm vào ORDERED_STANDARD_OBJECTS** (nếu cần thứ tự cụ thể trong navigation)

### Migration

- [ ] **Build server** (`yarn build`)
- [ ] **Chạy workspace:sync-metadata** để cập nhật database
- [ ] **Kiểm tra migration log** không có lỗi

### Testing

- [ ] **Kiểm tra object** xuất hiện trong metadata
- [ ] **Test tạo record** mới qua API
- [ ] **Test relations** hoạt động đúng (nếu có)
- [ ] **Test search** (nếu có @WorkspaceIsSearchable)
- [ ] **Test UI** (nếu có frontend changes)

- [ ] **Thêm vào CoreObjectNameSingular.ts** (nếu cần hiển thị trong UI)
- [ ] **Thêm vào ORDERED_STANDARD_OBJECTS** (nếu cần trong navigation)

### Migration

- [ ] **Build server** (`yarn build`)
- [ ] **Chạy workspace:sync-metadata** để cập nhật database

### Testing

- [ ] **Kiểm tra object** xuất hiện trong metadata
- [ ] **Test tạo record** mới
- [ ] **Test relations** hoạt động đúng
- [ ] **Test search** (nếu searchable)

---

## Ví Dụ Hoàn Chỉnh

### Ví Dụ 1: Simple Object (Product - Không có relations)

Xem phần trên để biết code đầy đủ.

### Ví Dụ 2: Object Với Relations (Employee)

Xem file thực tế: `packages/twenty-server/src/modules/employee/standard-objects/employee.workspace-entity.ts`

**Employee có các relations:**
- Many-to-One với Department
- Many-to-One với Team
### 2. Label Identifier & Image Identifier
- `labelIdentifierStandardId`: Field làm tiêu đề chính của record (thường là `name` hoặc `title`)
- `imageIdentifierStandardId` (Tùy chọn): Field cho avatar/image (ví dụ: `avatarUrl`, `imageUrl`)
  - Chỉ dùng khi object cần hiển thị hình ảnh (Person, Company, WorkspaceMember...)

### 3. System Fields (Bắt Buộc)

### 1. UUID phải duy nhất
- Sử dụng constants để tránh typo
- Không được trùng lặp

### 2. Label Identifier
- Field `labelIdentifierStandardId` là tiêu đề chính
- Thường là field `name` hoặc `title`

### 3. System Fields (Bắt Buộc)
- `position` - Sắp xếp records
- `createdBy` - Người tạo record

### 4. Search Vector
- Bắt buộc nếu có `@WorkspaceIsSearchable()`
- Định nghĩa `SEARCH_FIELDS_FOR_[OBJECT]`

### 5. Relations
- Many-to-One: Cần `@WorkspaceJoinColumn` và `[name]Id`
- Cập nhật cả 2 phía (inverse side)

### 6. Audit Logging
- Mặc định tất cả objects đều có audit logging (lưu lịch sử thay đổi)
- Dùng `@WorkspaceIsNotAuditLogged()` để tắt (ví dụ: Message, MessageThread...)

### 7. Feature Gating (Tùy chọn)
- Dùng `@WorkspaceGate()` để ẩn object đằng sau feature flag
- Object chỉ xuất hiện khi feature flag được bật
- Hữu ích cho features đang development hoặc beta

### 8. Duplicate Criteria (Tùy chọn)
- Dùng `@WorkspaceDuplicateCriteria()` để định nghĩa cách tìm duplicate records
- Hỗ trợ merge duplicates trong UI
- Ví dụ: Person có thể duplicate theo name, email, hoặc LinkedIn

### 9. Constants
- LUÔN dùng `STANDARD_OBJECT_IDS.[objectName]`
- LUÔN dùng `[OBJECT]_STANDARD_FIELD_IDS.[fieldName]`
- LUÔN dùng `STANDARD_OBJECT_ICONS.[objectName]`

---

## Troubleshooting

### Lỗi: "Duplicate standardId"
Tạo UUID mới và thay thế

### Lỗi: "Cannot find module"
Kiểm tra import path

### Lỗi: "Missing required field"
Thêm system fields: position, createdBy

### Lỗi: "Relation not working"
Kiểm tra inverseSideFieldKey và inverseSideTarget

### Lỗi: "Sync metadata failed"
Chạy `yarn build` và xem error log

---

## Tài Liệu Tham Khảo

**Code Examples:**
- Simple: `company`, `person`, `opportunity`
- Complex: `employee`, `department`, `team`

**Key Files:**
- Constants: `packages/twenty-server/src/engine/workspace-manager/workspace-sync-metadata/constants/`
- Decorators: `packages/twenty-server/src/engine/twenty-orm/decorators/`
- Composite Types: `packages/twenty-server/src/engine/metadata-modules/field-metadata/composite-types/`

**Documentation:**
- [Tabler Icons](https://tabler.io/icons)
- Standard Objects: `packages/twenty-server/src/modules/`

---

## Best Practices

1. ✅ Tham khảo existing objects trước
2. ✅ Sử dụng constants (không hard-code UUID)
3. ✅ Test relations kỹ
4. ✅ Document fields rõ ràng
5. ✅ Follow naming conventions
6. ✅ Sắp xếp theo alphabet
7. ✅ Commit từng bước
8. ✅ Test migration trên local
9. ✅ Dùng i18n (`msg` macro)
10. ✅ Keep it simple

---

## Kết Luận

Thêm Standard Object vào Twenty đòi hỏi:
- Cẩn thận trong việc định nghĩa schema
- Tuân thủ conventions
- Sử dụng constants
- Test kỹ lưỡng

Tham khảo `employee`, `department`, `team`, `company` để hiểu rõ patterns.

**Happy coding! 🚀**


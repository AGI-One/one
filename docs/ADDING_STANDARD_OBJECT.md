# Hướng Dẫn Thêm Standard Object Mới Vào Twenty# Hướng Dẫn Thêm Standard Object Mới Vào Twenty



## Tổng Quan## Tổng Quan



Standard Object là các đối tượng dữ liệu cốt lõi được định nghĩa sẵn trong hệ thống Twenty (như Company, Person, Opportunity, Task, Department, Employee, Team...). Khác với Custom Object (do người dùng tự tạo), Standard Object được hard-code vào source code và có sẵn cho tất cả workspace.Standard Object là các đối tượng dữ liệu cốt lõi được định nghĩa sẵn trong hệ thống Twenty (như Company, Person, Opportunity, Task, Department, Employee, Team...). Khác với Custom Object (do người dùng tự tạo), Standard Object được hard-code vào source code và có sẵn cho tất cả workspace.



## Cấu Trúc Thư MụcHướng dẫn này sẽ chỉ ra cách thêm một Standard Object mới vào hệ thống, bao gồm tất cả các file cần tạo và cập nhật.



```## Cấu Trúc Thư Mục

packages/twenty-server/src/modules/

└── [tên-module]/                          # Ví dụ: product, employeeMỗi Standard Object thường được tổ chức trong một module riêng biệt với cấu trúc như sau:

    ├── standard-objects/                   # Thư mục chứa workspace entity

    │   └── [tên-module].workspace-entity.ts```

    └── ...                                 # Các thư mục khác (services, resolvers...)packages/twenty-server/src/modules/

```└── [tên-module]/                          # Tên module (ví dụ: product, employee)

    ├── standard-objects/                   # Thư mục chứa workspace entity

## Tổng Quan Các Bước    │   └── [tên-module].workspace-entity.ts

    ├── constants/                          # (Tùy chọn) Constants cho module

1. ✅ **Chuẩn bị UUIDs và Constants** (5 files)    │   └── [tên-constant].ts

2. ✅ **Tạo workspace entity**     └── ...                                 # Các thư mục khác (services, resolvers...)

3. ✅ **Thêm relations** (nếu có)```

4. ✅ **Đăng ký backend** (1 file)

5. ✅ **Cập nhật frontend** (3 files)## Tổng Quan Các Bước

6. ✅ **Tạo views** (khuyến nghị)

7. ✅ **Chạy migration**1. ✅ **Chuẩn bị UUIDs và Constants**

2. ✅ **Tạo module và workspace entity**

---3. ✅ **Thêm relations (nếu có)**

4. ✅ **Đăng ký object vào backend**

## Bước 1: Chuẩn Bị Constants (5 Files)5. ✅ **Cập nhật frontend**

6. ✅ **Chạy migration**

### 1.1. Tạo UUIDs

---

```bash

# macOS/Linux## Các Bước Thực Hiện Chi Tiết

uuidgen | tr '[:upper:]' '[:lower:]'

```### Bước 1: Chuẩn Bị IDs và Constants



Cần tạo UUID cho:#### 1.1. Tạo UUID cho Object và Fields

- 1 object standardId

- N field standardIds (mỗi field 1 UUID)Trước tiên, bạn cần tạo các UUID duy nhất cho:

- Object standardId (1 cái)

### 1.2. File `standard-object-ids.ts`- Mỗi field standardId (nhiều cái)



**Đường dẫn:** `packages/twenty-server/src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids.ts`**Cách tạo UUID:**



```typescript```bash

export const STANDARD_OBJECT_IDS = {# Trên macOS/Linux (tạo lowercase UUID)

  // ... existing objects (alphabetically)uuidgen | tr '[:upper:]' '[:lower:]'

  product: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',

} as const;# Hoặc dùng online tool

```https://www.uuidgenerator.net/

```

### 1.3. File `standard-field-ids.ts`

**Lưu ý:** Lưu lại các UUID này, bạn sẽ cần sử dụng chúng ở nhiều nơi.

**Đường dẫn:** `packages/twenty-server/src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids.ts`

#### 1.2. Thêm Object ID vào `standard-object-ids.ts`

```typescript

export const PRODUCT_STANDARD_FIELD_IDS = {**File:** `packages/twenty-server/src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids.ts`

  name: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',

  description: 'c3d4e5f6-a7b8-9012-cdef-123456789012',Thêm ID của object mới vào constant:

  price: 'd4e5f6a7-b8c9-0123-def1-234567890123',

  position: 'e5f6a7b8-c9d0-1234-ef12-345678901234',```typescript

  createdBy: 'f6a7b8c9-d0e1-2345-f123-456789012345',export const STANDARD_OBJECT_IDS = {

  searchVector: 'a7b8c9d0-e1f2-3456-0123-456789abcdef',  // ... existing objects

} as const;  product: '[UUID-MỚI]', // UUID bạn vừa tạo

```} as const;

```

### 1.4. File `standard-object-icons.ts`

**Ví dụ thực tế:**

**Đường dẫn:** `packages/twenty-server/src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-icons.ts````typescript

export const STANDARD_OBJECT_IDS = {

```typescript  company: '20202020-b374-4779-a561-80086cb2e17f',

export const STANDARD_OBJECT_ICONS = {  person: '20202020-e674-48e5-a542-72570eee7213',

  // ... existing icons  product: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', // ← Thêm dòng này

  product: 'IconBox', // Icon từ Tabler Icons} as const;

} as const;```

```

#### 1.3. Thêm Field IDs vào `standard-field-ids.ts`

**Lưu ý:** Icon từ [Tabler Icons](https://tabler.io/icons) với prefix `Icon`.

**File:** `packages/twenty-server/src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids.ts`

### 1.5. File `standard-objects-by-priority-rank.ts`

Tạo một constant chứa tất cả field IDs của object:

**Đường dẫn:** `packages/twenty-server/src/engine/core-modules/search/constants/standard-objects-by-priority-rank.ts`

```typescript

```typescriptexport const PRODUCT_STANDARD_FIELD_IDS = {

export const STANDARD_OBJECTS_BY_PRIORITY_RANK = {  name: '[UUID-MỚI]',

  person: 5,           // Core entities  description: '[UUID-MỚI]',

  company: 4,          // Major entities  price: '[UUID-MỚI]',

  opportunity: 3,      // Business objects  position: '[UUID-MỚI]',

  product: 3,          // ← Thêm vào đây (business object)  createdBy: '[UUID-MỚI]',

  employee: 2,         // Secondary objects  searchVector: '[UUID-MỚI]',

  task: 1,             // Organizational objects  // ... các field khác

  // ... existing objects} as const;

} as const;```

```

**Ví dụ thực tế:**

**Hướng dẫn chọn priority:**```typescript

- **5**: Core entities (Person)export const PRODUCT_STANDARD_FIELD_IDS = {

- **4**: Major entities (Company)  name: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',

- **3**: Business objects (Opportunity, Product)  description: 'c3d4e5f6-a7b8-9012-cdef-123456789012',

- **2**: Secondary objects (Employee, Note)  price: 'd4e5f6a7-b8c9-0123-def1-234567890123',

- **1**: Organizational objects (Task, Department)  position: 'e5f6a7b8-c9d0-1234-ef12-345678901234',

- **0**: Configuration/lookup objects  createdBy: 'f6a7b8c9-d0e1-2345-f123-456789012345',

  searchVector: 'a7b8c9d0-e1f2-3456-0123-456789abcdef',

---} as const;

```

## Bước 2: Tạo Workspace Entity

#### 1.4. Thêm Icon vào `standard-object-icons.ts`

### 2.1. Tạo Thư Mục

**File:** `packages/twenty-server/src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-icons.ts`

```bash

mkdir -p packages/twenty-server/src/modules/product/standard-objectsThêm icon cho object:

```

```typescript

### 2.2. Tạo Entity Fileexport const STANDARD_OBJECT_ICONS = {

  // ... existing icons

**Đường dẫn:** `packages/twenty-server/src/modules/product/standard-objects/product.workspace-entity.ts`  product: 'IconBox', // Icon từ Tabler Icons

} as const;

**Template:**```



```typescript**Lưu ý:** Icon phải là tên icon hợp lệ từ [Tabler Icons](https://tabler.io/icons) với prefix `Icon`.

import { msg } from '@lingui/core/macro';

import { FieldMetadataType } from 'twenty-shared/types';#### 1.5. Thêm Search Priority vào `standard-objects-by-priority-rank.ts`



import { SEARCH_VECTOR_FIELD } from 'src/engine/metadata-modules/constants/search-vector-field.constants';**File:** `packages/twenty-server/src/engine/core-modules/search/constants/standard-objects-by-priority-rank.ts`

import { ActorMetadata } from 'src/engine/metadata-modules/field-metadata/composite-types/actor.composite-type';

import { IndexType } from 'src/engine/metadata-modules/index-metadata/types/indexType.types';Thêm độ ưu tiên search (số càng cao càng ưu tiên):

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';

import { WorkspaceEntity } from 'src/engine/twenty-orm/decorators/workspace-entity.decorator';```typescript

import { WorkspaceField } from 'src/engine/twenty-orm/decorators/workspace-field.decorator';export const STANDARD_OBJECTS_BY_PRIORITY_RANK = {

import { WorkspaceFieldIndex } from 'src/engine/twenty-orm/decorators/workspace-field-index.decorator';  person: 5,

import { WorkspaceIsFieldUIReadOnly } from 'src/engine/twenty-orm/decorators/workspace-is-field-ui-readonly.decorator';  company: 4,

import { WorkspaceIsNullable } from 'src/engine/twenty-orm/decorators/workspace-is-nullable.decorator';  opportunity: 3,

import { WorkspaceIsSearchable } from 'src/engine/twenty-orm/decorators/workspace-is-searchable.decorator';  product: 3, // High priority - core business object

import { WorkspaceIsSystem } from 'src/engine/twenty-orm/decorators/workspace-is-system.decorator';  employee: 2,

import { PRODUCT_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';  // ... existing objects

import { STANDARD_OBJECT_ICONS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-icons';} as const;

import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';```

import {

  type FieldTypeAndNameMetadata,**Hướng dẫn chọn priority:**

  getTsVectorColumnExpressionFromFields,- **5**: Core entities (Person)

} from 'src/engine/workspace-manager/workspace-sync-metadata/utils/get-ts-vector-column-expression.util';- **4**: Major entities (Company)

- **3**: Business objects (Opportunity, Product)

// Định nghĩa các field sẽ được search- **2**: Secondary objects (Employee, Note)

const NAME_FIELD_NAME = 'name';- **1**: Organizational objects (Task, Department, Team)

- **0**: Configuration/lookup objects

export const SEARCH_FIELDS_FOR_PRODUCT: FieldTypeAndNameMetadata[] = [

  { name: NAME_FIELD_NAME, type: FieldMetadataType.TEXT },---

];

### Bước 2: Tạo Module và Workspace Entity

@WorkspaceEntity({

  standardId: STANDARD_OBJECT_IDS.product,#### 2.1. Tạo Thư Mục Module

  namePlural: 'products',

  labelSingular: msg`Product`,```bash

  labelPlural: msg`Products`,mkdir -p packages/twenty-server/src/modules/product/standard-objects

  description: msg`A product in the system`,```

  icon: STANDARD_OBJECT_ICONS.product,

  shortcut: 'P',#### 2.2. Tạo File Workspace Entity

  labelIdentifierStandardId: PRODUCT_STANDARD_FIELD_IDS.name,

})**Đường dẫn:** `packages/twenty-server/src/modules/product/standard-objects/product.workspace-entity.ts`

@WorkspaceIsSearchable()

export class ProductWorkspaceEntity extends BaseWorkspaceEntity {**Đường dẫn:** `packages/twenty-server/src/modules/product/standard-objects/product.workspace-entity.ts`

  // Field chính (Label Identifier) - BẮT BUỘC

  @WorkspaceField({**Template cơ bản cho Workspace Entity:**

    standardId: PRODUCT_STANDARD_FIELD_IDS.name,

    type: FieldMetadataType.TEXT,```typescript

    label: msg`Name`,import { msg } from '@lingui/core/macro';

    description: msg`Product name`,import { FieldMetadataType, RelationOnDeleteAction } from 'twenty-shared/types';

    icon: 'IconBox',

  })import { SEARCH_VECTOR_FIELD } from 'src/engine/metadata-modules/constants/search-vector-field.constants';

  name: string;import { ActorMetadata } from 'src/engine/metadata-modules/field-metadata/composite-types/actor.composite-type';

import { IndexType } from 'src/engine/metadata-modules/index-metadata/types/indexType.types';

  // Các field khác (nullable)import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';

  @WorkspaceField({import { WorkspaceEntity } from 'src/engine/twenty-orm/decorators/workspace-entity.decorator';

    standardId: PRODUCT_STANDARD_FIELD_IDS.description,import { WorkspaceFieldIndex } from 'src/engine/twenty-orm/decorators/workspace-field-index.decorator';

    type: FieldMetadataType.TEXT,import { WorkspaceField } from 'src/engine/twenty-orm/decorators/workspace-field.decorator';

    label: msg`Description`,import { WorkspaceIsFieldUIReadOnly } from 'src/engine/twenty-orm/decorators/workspace-is-field-ui-readonly.decorator';

    description: msg`Product description`,import { WorkspaceIsNullable } from 'src/engine/twenty-orm/decorators/workspace-is-nullable.decorator';

    icon: 'IconFileText',import { WorkspaceIsSearchable } from 'src/engine/twenty-orm/decorators/workspace-is-searchable.decorator';

  })import { WorkspaceIsSystem } from 'src/engine/twenty-orm/decorators/workspace-is-system.decorator';

  @WorkspaceIsNullable()import { PRODUCT_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';

  description: string | null;import { STANDARD_OBJECT_ICONS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-icons';

import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';

  // System field: Position - BẮT BUỘCimport {

  @WorkspaceField({  type FieldTypeAndNameMetadata,

    standardId: PRODUCT_STANDARD_FIELD_IDS.position,  getTsVectorColumnExpressionFromFields,

    type: FieldMetadataType.POSITION,} from 'src/engine/workspace-manager/workspace-sync-metadata/utils/get-ts-vector-column-expression.util';

    label: msg`Position`,

    description: msg`Product record position`,// Định nghĩa các field sẽ được search

    icon: 'IconHierarchy2',const NAME_FIELD_NAME = 'name';

    defaultValue: 0,

  })export const SEARCH_FIELDS_FOR_PRODUCT: FieldTypeAndNameMetadata[] = [

  @WorkspaceIsSystem()  { name: NAME_FIELD_NAME, type: FieldMetadataType.TEXT },

  position: number;];



  // System field: CreatedBy - BẮT BUỘC@WorkspaceEntity({

  @WorkspaceField({  standardId: STANDARD_OBJECT_IDS.product,        // Dùng constant đã tạo

    standardId: PRODUCT_STANDARD_FIELD_IDS.createdBy,  namePlural: 'products',                         // Tên số nhiều (dùng trong API)

    type: FieldMetadataType.ACTOR,  labelSingular: msg`Product`,                    // Label số ít (hiển thị UI)

    label: msg`Created by`,  labelPlural: msg`Products`,                     // Label số nhiều (hiển thị UI)

    icon: 'IconCreativeCommonsSa',  description: msg`A product in the system`,      // Mô tả

    description: msg`The creator of the record`,  icon: STANDARD_OBJECT_ICONS.product,           // Dùng constant đã tạo

  })  shortcut: 'P',                                  // Phím tắt (tùy chọn)

  @WorkspaceIsFieldUIReadOnly()  labelIdentifierStandardId: PRODUCT_STANDARD_FIELD_IDS.name,  // Field identifier chính

  createdBy: ActorMetadata;  imageIdentifierStandardId: PRODUCT_STANDARD_FIELD_IDS.imageUrl, // (Tùy chọn) Field cho avatar/image

})

  // Search vector - BẮT BUỘC nếu có @WorkspaceIsSearchable()@WorkspaceIsSearchable()  // Cho phép search full-text

  @WorkspaceField({export class ProductWorkspaceEntity extends BaseWorkspaceEntity {

    standardId: PRODUCT_STANDARD_FIELD_IDS.searchVector,  // Field chính (Label Identifier)

    type: FieldMetadataType.TS_VECTOR,  @WorkspaceField({

    label: SEARCH_VECTOR_FIELD.label,    standardId: PRODUCT_STANDARD_FIELD_IDS.name,  // Dùng constant đã tạo

    description: SEARCH_VECTOR_FIELD.description,    type: FieldMetadataType.TEXT,

    icon: 'IconBox',    label: msg`Name`,

    generatedType: 'STORED',    description: msg`Product name`,

    asExpression: getTsVectorColumnExpressionFromFields(    icon: 'IconBox',

      SEARCH_FIELDS_FOR_PRODUCT,  })

    ),  name: string;

  })

  @WorkspaceIsNullable()  // Các field khác (nullable)

  @WorkspaceIsSystem()  @WorkspaceField({

  @WorkspaceFieldIndex({ indexType: IndexType.GIN })    standardId: PRODUCT_STANDARD_FIELD_IDS.description,

  searchVector: string;    type: FieldMetadataType.TEXT,

}    label: msg`Description`,

```    description: msg`Product description`,

    icon: 'IconFileText',

---  })

  @WorkspaceIsNullable()

## Bước 3: Thêm Relations (Nếu Có)  description: string | null;



### Import cần thiết:  @WorkspaceField({

    standardId: PRODUCT_STANDARD_FIELD_IDS.price,

```typescript    type: FieldMetadataType.NUMBER,

import { RelationType } from 'src/engine/metadata-modules/field-metadata/interfaces/relation-type.interface';    label: msg`Price`,

import { Relation } from 'src/engine/workspace-manager/workspace-sync-metadata/interfaces/relation.interface';    description: msg`Product price`,

import { WorkspaceJoinColumn } from 'src/engine/twenty-orm/decorators/workspace-join-column.decorator';    icon: 'IconCurrencyDollar',

import { WorkspaceRelation } from 'src/engine/twenty-orm/decorators/workspace-relation.decorator';  })

import { RelationOnDeleteAction } from 'twenty-shared/types';  @WorkspaceIsNullable()

```  price: number | null;



### Many-to-One Relation  // System fields (BẮT BUỘC)

  @WorkspaceField({

Ví dụ: Product thuộc Category    standardId: PRODUCT_STANDARD_FIELD_IDS.position,

    type: FieldMetadataType.POSITION,

```typescript    label: msg`Position`,

import { CategoryWorkspaceEntity } from 'src/modules/product-category/standard-objects/product-category.workspace-entity';    description: msg`Product record position`,

    icon: 'IconHierarchy2',

// Thêm vào ProductWorkspaceEntity:    defaultValue: 0,

@WorkspaceRelation({  })

  standardId: PRODUCT_STANDARD_FIELD_IDS.category,  @WorkspaceIsSystem()

  type: RelationType.MANY_TO_ONE,  position: number;

  label: msg`Category`,

  description: msg`Product category`,  @WorkspaceField({

  icon: 'IconTag',    standardId: PRODUCT_STANDARD_FIELD_IDS.createdBy,

  inverseSideTarget: () => CategoryWorkspaceEntity,    type: FieldMetadataType.ACTOR,

  inverseSideFieldKey: 'products',    label: msg`Created by`,

  onDelete: RelationOnDeleteAction.SET_NULL,    icon: 'IconCreativeCommonsSa',

})    description: msg`The creator of the record`,

@WorkspaceIsNullable()  })

category: Relation<CategoryWorkspaceEntity> | null;  @WorkspaceIsFieldUIReadOnly()

  createdBy: ActorMetadata;

@WorkspaceJoinColumn('category')

categoryId: string | null;  // Search vector (BẮT BUỘC nếu @WorkspaceIsSearchable())

```  @WorkspaceField({

    standardId: PRODUCT_STANDARD_FIELD_IDS.searchVector,

### One-to-Many Relation    type: FieldMetadataType.TS_VECTOR,

    label: SEARCH_VECTOR_FIELD.label,

Ví dụ: Category có nhiều Products    description: SEARCH_VECTOR_FIELD.description,

    icon: 'IconBox',

```typescript    generatedType: 'STORED',

// Trong CategoryWorkspaceEntity:    asExpression: getTsVectorColumnExpressionFromFields(

@WorkspaceRelation({      SEARCH_FIELDS_FOR_PRODUCT,

  standardId: CATEGORY_STANDARD_FIELD_IDS.products,    ),

  type: RelationType.ONE_TO_MANY,  })

  label: msg`Products`,  @WorkspaceIsNullable()

  description: msg`Products in this category`,  @WorkspaceIsSystem()

  icon: 'IconBox',  @WorkspaceFieldIndex({ indexType: IndexType.GIN })

  inverseSideTarget: () => ProductWorkspaceEntity,  searchVector: string;

  inverseSideFieldKey: 'category',}

})```

products: Relation<ProductWorkspaceEntity[]>;

```---



**Lưu ý:**### Bước 3: Thêm Relations (Nếu Có)

- Many-to-One cần `@WorkspaceJoinColumn` và field `[name]Id`

- Relation 2 chiều phải định nghĩa ở cả 2 entitiesNếu object của bạn cần liên kết với các object khác, hãy thêm relations. Nhớ import thêm:

- `inverseSideFieldKey` phải match với tên field bên kia

```typescript

---import { RelationType } from 'src/engine/metadata-modules/field-metadata/interfaces/relation-type.interface';

import { Relation } from 'src/engine/workspace-manager/workspace-sync-metadata/interfaces/relation.interface';

## Bước 4: Đăng Ký Backend (1 File)import { WorkspaceJoinColumn } from 'src/engine/twenty-orm/decorators/workspace-join-column.decorator';

import { WorkspaceRelation } from 'src/engine/twenty-orm/decorators/workspace-relation.decorator';

**File:** `packages/twenty-server/src/engine/workspace-manager/workspace-sync-metadata/standard-objects/index.ts````



```typescript#### 3.1. Many-to-One Relation

// Import (theo alphabet)

import { ProductWorkspaceEntity } from 'src/modules/product/standard-objects/product.workspace-entity';Ví dụ: Product thuộc về một Category



// Thêm vào array (theo alphabet)```typescript

export const standardObjectMetadataDefinitions = [// Thêm vào ProductWorkspaceEntity class:

  AttachmentWorkspaceEntity,import { CategoryWorkspaceEntity } from 'src/modules/category/standard-objects/category.workspace-entity';

  BlocklistWorkspaceEntity,

  // ... existing entities@WorkspaceRelation({

  ProductWorkspaceEntity,  // ← Thêm vào đây  standardId: PRODUCT_STANDARD_FIELD_IDS.category,  // Thêm vào constant

  // ... other entities  type: RelationType.MANY_TO_ONE,

];  label: msg`Category`,

```  description: msg`Product category`,

  icon: 'IconTag',

---  inverseSideTarget: () => CategoryWorkspaceEntity,

  inverseSideFieldKey: 'products',

## Bước 5: Cập Nhật Frontend (3 Files)  onDelete: RelationOnDeleteAction.SET_NULL,

})

### 5.1. File `CoreObjectNameSingular.ts`@WorkspaceIsNullable()

category: Relation<CategoryWorkspaceEntity> | null;

**Đường dẫn:** `packages/twenty-front/src/modules/object-metadata/types/CoreObjectNameSingular.ts`

@WorkspaceJoinColumn('category')

```typescriptcategoryId: string | null;

export enum CoreObjectNameSingular {```

  // ... existing objects

  Product = 'product',#### 3.2. One-to-Many Relation

}

```Ví dụ: Category có nhiều Products



### 5.2. File `NavigationDrawerSectionForObjectMetadataItems.tsx````typescript

// Trong CategoryWorkspaceEntity class:

**Đường dẫn:** `packages/twenty-front/src/modules/object-metadata/components/NavigationDrawerSectionForObjectMetadataItems.tsx`import { ProductWorkspaceEntity } from 'src/modules/product/standard-objects/product.workspace-entity';



```typescript@WorkspaceRelation({

const ORDERED_STANDARD_OBJECTS: string[] = [  standardId: CATEGORY_STANDARD_FIELD_IDS.products,  // Thêm vào constant

  CoreObjectNameSingular.Person,  type: RelationType.ONE_TO_MANY,

  CoreObjectNameSingular.Company,  label: msg`Products`,

  CoreObjectNameSingular.Opportunity,  description: msg`Products in this category`,

  CoreObjectNameSingular.Product,    // ← Thêm vào đây  icon: 'IconBox',

  CoreObjectNameSingular.Task,  inverseSideTarget: () => ProductWorkspaceEntity,

  // ... other objects  inverseSideFieldKey: 'category',

];  onDelete: RelationOnDeleteAction.SET_NULL,

```})

@WorkspaceIsNullable()

### 5.3. File `getIconColorForObjectType.ts`products: Relation<ProductWorkspaceEntity[]>;

```

**Đường dẫn:** `packages/twenty-front/src/modules/object-metadata/utils/getIconColorForObjectType.ts`

**Lưu ý quan trọng về Relations:**

```typescript- `inverseSideTarget`: Trỏ đến entity liên kết

export const getIconColorForObjectType = ({- `inverseSideFieldKey`: Tên field ở phía bên kia của relation

  objectType,- `onDelete`: Hành động khi xóa (SET_NULL, CASCADE, RESTRICT)

  theme,- Many-to-One cần thêm `@WorkspaceJoinColumn` và field `[name]Id`

}: {- Relation 2 chiều: Phải định nghĩa ở cả 2 entity

  objectType: string;

  theme: Theme;---

}): string => {

  switch (objectType) {### Bước 4: Thêm Decorators Đặc Biệt (Nếu Cần)

    case 'note':

      return theme.color.yellow;---

    case 'task':

      return theme.color.blue;### Bước 4: Đăng Ký Standard Object Vào Backend

    case 'product':

      return theme.color.purple;  // ← Thêm vào đây#### 4.1. Import và Thêm vào Array

    // ... other cases

    default:**File:** `packages/twenty-server/src/engine/workspace-manager/workspace-sync-metadata/standard-objects/index.ts`

      return 'currentColor';**Bước 1:** Thêm import ở đầu file (theo thứ tự alphabet):

  }

};```typescript

```// ... existing imports

import { ProductWorkspaceEntity } from 'src/modules/product/standard-objects/product.workspace-entity';

**Màu có sẵn:** `blue`, `purple`, `green`, `orange`, `turquoise`, `red`, `yellow`// ... other imports

```

---

**Bước 2:** Thêm vào array `standardObjectMetadataDefinitions` (theo thứ tự alphabet):

## Bước 6: Tạo Views (Khuyến Nghị)

```typescript

### 6.1. Tạo View Fileexport const standardObjectMetadataDefinitions = [

  AttachmentWorkspaceEntity,

**Đường dẫn:** `packages/twenty-server/src/engine/workspace-manager/standard-objects-prefill-data/views/products-all.view.ts`  BlocklistWorkspaceEntity,

  // ... existing entities

```typescript  ProductWorkspaceEntity,        // ← Thêm vào đây

import { msg } from '@lingui/core/macro';  // ... other entities

import { IconList } from 'twenty-shared/core';];

```

import { PRODUCT_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';

**Lưu ý:** Danh sách thường được sắp xếp theo alphabet để dễ quản lý.

export const productsAllView = {

  name: msg`All Products`,---

  objectSingularName: 'product',

  type: 'table',### Bước 5: Cập Nhật Frontend

  key: 'INDEX',

  position: 0,#### 5.1. Thêm Vào CoreObjectNameSingular

  icon: IconList,

  kanbanFieldMetadataId: '',**File:** `packages/twenty-front/src/modules/object-metadata/types/CoreObjectNameSingular.ts`

  filters: [],

  fields: [```typescript

    {export enum CoreObjectNameSingular {

      fieldMetadataId: PRODUCT_STANDARD_FIELD_IDS.name,  // ... existing objects

      position: 0,  Product = 'product',

      isVisible: true,}

      size: 150,```

    },

    {#### 5.2. Thêm Vào Navigation

      fieldMetadataId: PRODUCT_STANDARD_FIELD_IDS.description,

      position: 1,**File:** `packages/twenty-front/src/modules/object-metadata/components/NavigationDrawerSectionForObjectMetadataItems.tsx`

      isVisible: true,

      size: 200,Thêm object vào navigation với thứ tự mong muốn:

    },

    // ... other fields```typescript

  ],const ORDERED_STANDARD_OBJECTS: string[] = [

};  CoreObjectNameSingular.Person,

```  CoreObjectNameSingular.Company,

  CoreObjectNameSingular.Opportunity,

### 6.2. Đăng Ký View  CoreObjectNameSingular.Product,    // ← Thêm vào đây

  CoreObjectNameSingular.Task,

**File:** `packages/twenty-server/src/engine/workspace-manager/standard-objects-prefill-data/prefill-core-views.ts`  // ... other objects

];

```typescript```

// Import

import { productsAllView } from './views/products-all.view';#### 5.3. Thêm Màu Sắc Icon



// Thêm vào array**File:** `packages/twenty-front/src/modules/object-metadata/utils/getIconColorForObjectType.ts`

const views = [

  // ... existing viewsThêm màu sắc cho icon của object:

  productsAllView,

];```typescript

```export const getIconColorForObjectType = ({

  objectType,

---  theme,

}: {

## Bước 7: Chạy Migration  objectType: string;

  theme: Theme;

```bash}): string => {

# Build server  switch (objectType) {

cd packages/twenty-server    case 'note':

yarn build      return theme.color.yellow;

    case 'task':

# Sync metadata - một workspace      return theme.color.blue;

yarn command:prod workspace:sync-metadata -w [workspace-id]    case 'product':

      return theme.color.purple; // ← Thêm vào đây

# HOẶC sync tất cả workspaces    // ... other cases

yarn command:prod workspace:sync-metadata    default:

```      return 'currentColor';

  }

Migration sẽ tạo:};

- Database tables```

- Columns cho tất cả fields

- Indexes**Các màu có sẵn:**

- Foreign keys cho relations- `theme.color.blue` - Xanh dương

- `theme.color.purple` - Tím

---- `theme.color.green` - Xanh lá

- `theme.color.orange` - Cam

## Checklist Hoàn Chỉnh- `theme.color.turquoise` - Xanh ngọc

- `theme.color.red` - Đỏ

### Backend (Server)- `theme.color.yellow` - Vàng



- [ ] Tạo UUIDs (object + fields)#### 5.4. Tạo View Files (Khuyến nghị)

- [ ] `standard-object-ids.ts` - object ID

- [ ] `standard-field-ids.ts` - field IDs constantTạo default view cho object để hiển thị trong UI:

- [ ] `standard-object-icons.ts` - icon

- [ ] `standard-objects-by-priority-rank.ts` - search priority**File:** `packages/twenty-server/src/engine/workspace-manager/standard-objects-prefill-data/views/products-all.view.ts`

- [ ] Tạo workspace entity file

- [ ] Thêm system fields: `position`, `createdBy````typescript

- [ ] Thêm `searchVector` (nếu searchable)import { msg } from '@lingui/core/macro';

- [ ] Thêm relations (nếu có)import { IconList } from 'twenty-shared/core';

- [ ] Đăng ký vào `standard-objects/index.ts`

export const productsAllView = {

### Frontend  name: msg`All Products`,

  objectSingularName: 'product',

- [ ] `CoreObjectNameSingular.ts` - enum value  type: 'table',

- [ ] `NavigationDrawerSectionForObjectMetadataItems.tsx` - ORDERED_STANDARD_OBJECTS  key: 'INDEX',

- [ ] `getIconColorForObjectType.ts` - màu icon  position: 0,

- [ ] Tạo view file (products-all.view.ts)  icon: IconList,

- [ ] Đăng ký view (`prefill-core-views.ts`)  kanbanFieldMetadataId: '',

  filters: [],

### Migration  fields: [

    {

- [ ] Build server      fieldMetadataId: PRODUCT_STANDARD_FIELD_IDS.name,

- [ ] Chạy workspace:sync-metadata      position: 0,

- [ ] Kiểm tra migration log      isVisible: true,

      size: 150,

### Testing    },

    {

- [ ] Object xuất hiện trong metadata      fieldMetadataId: PRODUCT_STANDARD_FIELD_IDS.description,

- [ ] Tạo/đọc/sửa/xóa records qua UI      position: 1,

- [ ] Relations hoạt động đúng      isVisible: true,

- [ ] Search hoạt động (nếu searchable)      size: 200,

- [ ] Navigation sidebar hiển thị đúng    },

    // ... other fields

---  ],

};

## Field Metadata Types Phổ Biến```



### Primitive Types**Đăng ký view trong `prefill-core-views.ts`:**

- `TEXT` - Chuỗi văn bản

- `NUMBER` - Số```typescript

- `BOOLEAN` - True/False// Import

- `DATE_TIME` - Ngày giờimport { productsAllView } from './views/products-all.view';

- `SELECT` - Lựa chọn đơn

- `MULTI_SELECT` - Lựa chọn nhiều// Thêm vào array

const views = [

### Composite Types  // ... existing views

- `FULL_NAME` - Họ tên (firstName, lastName)  productsAllView,

- `EMAILS` - Danh sách email];

- `PHONES` - Danh sách điện thoại```

- `LINKS` - Danh sách URL```

- `ADDRESS` - Địa chỉ đầy đủ

- `CURRENCY` - Tiền tệ (amount, currencyCode)**Bước 2:** Thêm vào array `standardObjectMetadataDefinitions` (theo thứ tự alphabet):

- `ACTOR` - Người thực hiện (name, source)

```typescript

### System Typesexport const standardObjectMetadataDefinitions = [

- `UUID` - ID duy nhất  AttachmentWorkspaceEntity,

- `POSITION` - Vị trí sắp xếp  BlocklistWorkspaceEntity,

- `TS_VECTOR` - Full-text search vector  // ... existing entities

  ProductWorkspaceEntity,        // ← Thêm vào đây

---  // ... other entities

];

## Decorators Quan Trọng```



### Entity Decorators**Lưu ý:** Danh sách thường được sắp xếp theo alphabet để dễ quản lý.

- `@WorkspaceEntity({...})` - Đánh dấu class là workspace entity

- `@WorkspaceIsSearchable()` - Cho phép full-text search---



### Field Decorators### Bước 7: Cập Nhật Frontend (Nếu Cần)

- `@WorkspaceIsNullable()` - Field có thể null

- `@WorkspaceIsSystem()` - System field (không thể xóa/edit)Nếu object cần hiển thị trong navigation hoặc UI, cập nhật frontend.

- `@WorkspaceIsFieldUIReadOnly()` - Read-only trong UI

- `@WorkspaceFieldIndex({ indexType: IndexType.GIN })` - Tạo index#### 7.1. Thêm Vào CoreObjectNameSingular



### Relation Decorators**File:** `packages/twenty-front/src/modules/object-metadata/types/CoreObjectNameSingular.ts`

- `@WorkspaceRelation({...})` - Định nghĩa relation

- `@WorkspaceJoinColumn('fieldName')` - Join column (cho Many-to-One)```typescript

export enum CoreObjectNameSingular {

---  // ... existing objects

  Product = 'product',

## Lưu Ý Quan Trọng}

```

### 1. System Fields Bắt Buộc

- **`position`** (POSITION) - Sắp xếp records#### 7.2. Thêm Vào Navigation (Tùy chọn)

- **`createdBy`** (ACTOR) - Người tạo record

**File:** `packages/twenty-front/src/modules/object-metadata/components/NavigationDrawerSectionForObjectMetadataItems.tsx`

### 2. Search Vector

- Bắt buộc nếu có `@WorkspaceIsSearchable()`Nếu muốn object xuất hiện trong navigation với thứ tự cụ thể:

- Phải định nghĩa `SEARCH_FIELDS_FOR_[OBJECT]`

```typescript

### 3. Label Identifierconst ORDERED_STANDARD_OBJECTS: string[] = [

- Field `labelIdentifierStandardId` là title chính  CoreObjectNameSingular.Person,

- Thường là field `name` hoặc `title`  CoreObjectNameSingular.Company,

  CoreObjectNameSingular.Opportunity,

### 4. Relations  CoreObjectNameSingular.Product,    // ← Thêm vào đây

- Many-to-One: Cần `@WorkspaceJoinColumn` và `[name]Id` field  CoreObjectNameSingular.Task,

- Phải cập nhật cả 2 phía (inverse side)  // ... other objects

- `inverseSideFieldKey` phải match tên field bên kia];

```

### 5. Constants

- **LUÔN** dùng `STANDARD_OBJECT_IDS.[objectName]`---

- **LUÔN** dùng `[OBJECT]_STANDARD_FIELD_IDS.[fieldName]`

- **KHÔNG BAO GIỜ** hard-code UUID### Bước 6: Chạy Migration



---Sau khi hoàn tất tất cả các bước trên, cần sync metadata để cập nhật database schema.



## Troubleshooting#### 6.1. Build Server



| Lỗi | Giải pháp |```bash

|-----|-----------|cd packages/twenty-server

| "Duplicate standardId" | Tạo UUID mới |yarn build

| "Cannot find module" | Kiểm tra import path |```

| "Missing required field" | Thêm system fields: position, createdBy |

| "Relation not working" | Kiểm tra inverseSideFieldKey và inverseSideTarget |#### 6.2. Sync Metadata

| "Sync metadata failed" | Chạy `yarn build` và xem error log |

**Sync cho một workspace cụ thể:**

---```bash

yarn command:prod workspace:sync-metadata -w [workspace-id]

## Best Practices```



1. ✅ Tham khảo existing objects trước khi bắt đầu**Sync cho tất cả workspaces:**

2. ✅ Sử dụng constants (không hard-code UUID)```bash

3. ✅ Sắp xếp imports và arrays theo alphabetyarn command:prod workspace:sync-metadata

4. ✅ Test migration trên local database trước```

5. ✅ Dùng `msg` macro cho i18n

6. ✅ Commit từng bước nhỏ**Lưu ý:** Migration này sẽ:

7. ✅ Document fields rõ ràng- Tạo bảng mới trong database

8. ✅ Follow naming conventions- Tạo các column cho tất cả fields

- Tạo indexes

---- Tạo relations/foreign keys



## Tài Liệu Tham Khảo---



**Code Examples:**## Tham Số Chi Tiết của @WorkspaceEntity

- Simple objects: `company`, `person`, `opportunity`

- Complex objects: `employee`, `department`, `team````typescript

@WorkspaceEntity({

**Key Directories:**  standardId: string,                    // BẮT BUỘC - UUID duy nhất

- Constants: `packages/twenty-server/src/engine/workspace-manager/workspace-sync-metadata/constants/`  namePlural: string,                    // BẮT BUỘC - Tên số nhiều cho API

- Decorators: `packages/twenty-server/src/engine/twenty-orm/decorators/`  labelSingular: MessageDescriptor,      // BẮT BUỘC - Label UI số ít (dùng msg`...`)

- Composite Types: `packages/twenty-server/src/engine/metadata-modules/field-metadata/composite-types/`  labelPlural: MessageDescriptor,        // BẮT BUỘC - Label UI số nhiều (dùng msg`...`)

  description?: MessageDescriptor,       // Tùy chọn - Mô tả object

**External:**  icon?: string,                         // Tùy chọn - Icon (từ Tabler Icons)

- [Tabler Icons](https://tabler.io/icons)  shortcut?: string,                     // Tùy chọn - Phím tắt (1 ký tự)

  labelIdentifierStandardId?: string,    // Tùy chọn - Field ID làm label chính (mặc định: id)

---  imageIdentifierStandardId?: string,    // Tùy chọn - Field ID cho avatar/image

})

**Happy coding! 🚀**```


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

### 5. Timeline Activity Integration (Quan Trọng!)

**⚠️ QUAN TRỌNG:** Nếu object của bạn cần hiển thị trong timeline (lịch sử hoạt động), bạn PHẢI thêm vào Timeline Activity system!

#### 5.1. Thêm Field ID vào TIMELINE_ACTIVITY_STANDARD_FIELD_IDS

**File:** `packages/twenty-server/src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids.ts`

```typescript
export const TIMELINE_ACTIVITY_STANDARD_FIELD_IDS = {
  // ... existing fields
  product: '[UUID-MỚI]',  // ← Thêm dòng này (dùng uuidgen)
  // ... other fields
} as const;
```

#### 5.2. Thêm Relation vào timeline-activity.workspace-entity.ts

**File:** `packages/twenty-server/src/modules/timeline/standard-objects/timeline-activity.workspace-entity.ts`

**Bước 1:** Thêm import:
```typescript
import { ProductWorkspaceEntity } from 'src/modules/product/standard-objects/product.workspace-entity';
```

**Bước 2:** Thêm relation (trước phần `@WorkspaceDynamicRelation`):
```typescript
@WorkspaceRelation({
  standardId: TIMELINE_ACTIVITY_STANDARD_FIELD_IDS.product,
  type: RelationType.MANY_TO_ONE,
  label: msg`Product`,
  description: msg`Event product`,
  icon: 'IconBox',
  inverseSideTarget: () => ProductWorkspaceEntity,
  inverseSideFieldKey: 'timelineActivities',
  onDelete: RelationOnDeleteAction.SET_NULL,
})
@WorkspaceIsNullable()
product: Relation<ProductWorkspaceEntity> | null;

@WorkspaceJoinColumn('product')
productId: string | null;
```

#### 5.3. Thêm Inverse Relation vào Object Entity

**File:** `packages/twenty-server/src/modules/product/standard-objects/product.workspace-entity.ts`

**Bước 1:** Thêm imports:
```typescript
import { RelationType } from 'src/engine/metadata-modules/field-metadata/interfaces/relation-type.interface';
import { Relation } from 'src/engine/workspace-manager/workspace-sync-metadata/interfaces/relation.interface';
import { WorkspaceRelation } from 'src/engine/twenty-orm/decorators/workspace-relation.decorator';
import { TimelineActivityWorkspaceEntity } from 'src/modules/timeline/standard-objects/timeline-activity.workspace-entity';
```

**Bước 2:** Thêm relation (trước search vector field):
```typescript
@WorkspaceRelation({
  standardId: '[UUID-MỚI]',  // Tạo UUID mới cho relation này
  type: RelationType.ONE_TO_MANY,
  label: msg`Timeline Activities`,
  description: msg`Events linked to the product`,
  icon: 'IconTimeline',
  inverseSideTarget: () => TimelineActivityWorkspaceEntity,
  inverseSideFieldKey: 'product',
})
@WorkspaceIsNullable()
timelineActivities: Relation<TimelineActivityWorkspaceEntity[]>;
```

**Khi nào cần thêm vào Timeline Activity?**
- ✅ Object đại diện cho entity nghiệp vụ quan trọng (Product, Employee, Customer...)
- ✅ Cần track lịch sử hoạt động của object
- ✅ Object có thể liên kết với các sự kiện (created, updated, deleted...)
- ❌ Object chỉ là lookup/configuration (ProductType, EmployeeLevel...)
- ❌ Object là system object không cần timeline

**Tham khảo:** Xem các object đã tích hợp timeline: Company, Person, Employee, Department, Team, Opportunity, Product...

### 6. Relations
- Many-to-One: Cần `@WorkspaceJoinColumn` và `[name]Id`
- Cập nhật cả 2 phía (inverse side)

### 7. Audit Logging
- Mặc định tất cả objects đều có audit logging (lưu lịch sử thay đổi)
- Dùng `@WorkspaceIsNotAuditLogged()` để tắt (ví dụ: Message, MessageThread...)

### 8. Feature Gating (Tùy chọn)
- Dùng `@WorkspaceGate()` để ẩn object đằng sau feature flag
- Object chỉ xuất hiện khi feature flag được bật
- Hữu ích cho features đang development hoặc beta

### 9. Duplicate Criteria (Tùy chọn)
- Dùng `@WorkspaceDuplicateCriteria()` để định nghĩa cách tìm duplicate records
- Hỗ trợ merge duplicates trong UI
- Ví dụ: Person có thể duplicate theo name, email, hoặc LinkedIn

### 10. Constants
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


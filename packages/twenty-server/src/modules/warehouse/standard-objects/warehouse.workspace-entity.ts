import { msg } from '@lingui/core/macro';
import { FieldMetadataType, RelationOnDeleteAction } from 'twenty-shared/types';

import { RelationType } from 'src/engine/metadata-modules/field-metadata/interfaces/relation-type.interface';
import type { Relation } from 'src/engine/workspace-manager/workspace-sync-metadata/interfaces/relation.interface';

import { SEARCH_VECTOR_FIELD } from 'src/engine/metadata-modules/constants/search-vector-field.constants';
import { ActorMetadata } from 'src/engine/metadata-modules/field-metadata/composite-types/actor.composite-type';
import { AddressMetadata } from 'src/engine/metadata-modules/field-metadata/composite-types/address.composite-type';
import { EmailsMetadata } from 'src/engine/metadata-modules/field-metadata/composite-types/emails.composite-type';
import { PhonesMetadata } from 'src/engine/metadata-modules/field-metadata/composite-types/phones.composite-type';
import { IndexType } from 'src/engine/metadata-modules/index-metadata/types/indexType.types';
import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { WorkspaceEntity } from 'src/engine/twenty-orm/decorators/workspace-entity.decorator';
import { WorkspaceField } from 'src/engine/twenty-orm/decorators/workspace-field.decorator';
import { WorkspaceFieldIndex } from 'src/engine/twenty-orm/decorators/workspace-field-index.decorator';
import { WorkspaceIsFieldUIReadOnly } from 'src/engine/twenty-orm/decorators/workspace-is-field-ui-readonly.decorator';
import { WorkspaceIsNullable } from 'src/engine/twenty-orm/decorators/workspace-is-nullable.decorator';
import { WorkspaceIsSearchable } from 'src/engine/twenty-orm/decorators/workspace-is-searchable.decorator';
import { WorkspaceIsSystem } from 'src/engine/twenty-orm/decorators/workspace-is-system.decorator';
import { WorkspaceRelation } from 'src/engine/twenty-orm/decorators/workspace-relation.decorator';
import { WAREHOUSE_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_ICONS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-icons';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';
import {
  type FieldTypeAndNameMetadata,
  getTsVectorColumnExpressionFromFields,
} from 'src/engine/workspace-manager/workspace-sync-metadata/utils/get-ts-vector-column-expression.util';
import { TimelineActivityWorkspaceEntity } from 'src/modules/timeline/standard-objects/timeline-activity.workspace-entity';
import { WarehouseProductWorkspaceEntity } from 'src/modules/warehouse-product/standard-objects/warehouse-product.workspace-entity';

const NAME_FIELD_NAME = 'name';
const CODE_FIELD_NAME = 'code';

export const SEARCH_FIELDS_FOR_WAREHOUSE: FieldTypeAndNameMetadata[] = [
  { name: NAME_FIELD_NAME, type: FieldMetadataType.TEXT },
  { name: CODE_FIELD_NAME, type: FieldMetadataType.TEXT },
];

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.warehouse,
  namePlural: 'warehouses',
  labelSingular: msg`Warehouse`,
  labelPlural: msg`Warehouses`,
  description: msg`A warehouse for storing products`,
  icon: STANDARD_OBJECT_ICONS.warehouse,
  labelIdentifierStandardId: WAREHOUSE_STANDARD_FIELD_IDS.name,
})
@WorkspaceIsSearchable()
export class WarehouseWorkspaceEntity extends BaseWorkspaceEntity {
  @WorkspaceField({
    standardId: WAREHOUSE_STANDARD_FIELD_IDS.name,
    type: FieldMetadataType.TEXT,
    label: msg`Name`,
    description: msg`Warehouse name`,
    icon: 'IconBuilding',
  })
  name: string;

  @WorkspaceField({
    standardId: WAREHOUSE_STANDARD_FIELD_IDS.code,
    type: FieldMetadataType.TEXT,
    label: msg`Code`,
    description: msg`Warehouse code`,
    icon: 'IconCode',
  })
  @WorkspaceIsNullable()
  code: string | null;

  @WorkspaceField({
    standardId: WAREHOUSE_STANDARD_FIELD_IDS.description,
    type: FieldMetadataType.TEXT,
    label: msg`Description`,
    description: msg`Warehouse description`,
    icon: 'IconFileText',
  })
  @WorkspaceIsNullable()
  description: string | null;

  @WorkspaceField({
    standardId: WAREHOUSE_STANDARD_FIELD_IDS.enabled,
    type: FieldMetadataType.BOOLEAN,
    label: msg`Enabled`,
    description: msg`Is warehouse enabled`,
    icon: 'IconToggleRight',
    defaultValue: true,
  })
  enabled: boolean;

  @WorkspaceField({
    standardId: WAREHOUSE_STANDARD_FIELD_IDS.logoUrl,
    type: FieldMetadataType.TEXT,
    label: msg`Logo`,
    description: msg`Warehouse logo URL`,
    icon: 'IconFileUpload',
  })
  @WorkspaceIsNullable()
  logoUrl: string | null;

  @WorkspaceField({
    standardId: WAREHOUSE_STANDARD_FIELD_IDS.email,
    type: FieldMetadataType.EMAILS,
    label: msg`Email`,
    description: msg`Warehouse contact email`,
    icon: 'IconMail',
  })
  @WorkspaceIsNullable()
  email: EmailsMetadata | null;

  @WorkspaceField({
    standardId: WAREHOUSE_STANDARD_FIELD_IDS.phone,
    type: FieldMetadataType.PHONES,
    label: msg`Phone`,
    description: msg`Warehouse contact phone`,
    icon: 'IconPhone',
  })
  @WorkspaceIsNullable()
  phone: PhonesMetadata | null;

  @WorkspaceField({
    standardId: WAREHOUSE_STANDARD_FIELD_IDS.address,
    type: FieldMetadataType.ADDRESS,
    label: msg`Address`,
    description: msg`Warehouse address`,
    icon: 'IconMap',
  })
  @WorkspaceIsNullable()
  address: AddressMetadata | null;

  // Relations
  @WorkspaceRelation({
    standardId: WAREHOUSE_STANDARD_FIELD_IDS.products,
    type: RelationType.ONE_TO_MANY,
    label: msg`Products`,
    description: msg`Products in this warehouse`,
    icon: 'IconPackage',
    inverseSideTarget: () => WarehouseProductWorkspaceEntity,
    inverseSideFieldKey: 'warehouse',
  })
  products: Relation<WarehouseProductWorkspaceEntity[]>;

  @WorkspaceRelation({
    standardId: WAREHOUSE_STANDARD_FIELD_IDS.timelineActivities,
    type: RelationType.ONE_TO_MANY,
    label: msg`Timeline Activities`,
    description: msg`Timeline activities linked to the warehouse`,
    icon: 'IconIconTimelineEvent',
    inverseSideTarget: () => TimelineActivityWorkspaceEntity,
    inverseSideFieldKey: 'warehouse',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  timelineActivities: Relation<TimelineActivityWorkspaceEntity[]>;

  // System fields
  @WorkspaceField({
    standardId: WAREHOUSE_STANDARD_FIELD_IDS.position,
    type: FieldMetadataType.POSITION,
    label: msg`Position`,
    description: msg`Warehouse record position`,
    icon: 'IconHierarchy2',
    defaultValue: 0,
  })
  @WorkspaceIsSystem()
  position: number;

  @WorkspaceField({
    standardId: WAREHOUSE_STANDARD_FIELD_IDS.createdBy,
    type: FieldMetadataType.ACTOR,
    label: msg`Created by`,
    icon: 'IconCreativeCommonsSa',
    description: msg`The creator of the record`,
  })
  @WorkspaceIsFieldUIReadOnly()
  createdBy: ActorMetadata;

  @WorkspaceField({
    standardId: WAREHOUSE_STANDARD_FIELD_IDS.searchVector,
    type: FieldMetadataType.TS_VECTOR,
    label: SEARCH_VECTOR_FIELD.label,
    description: SEARCH_VECTOR_FIELD.description,
    icon: 'IconBuilding',
    generatedType: 'STORED',
    asExpression: getTsVectorColumnExpressionFromFields(
      SEARCH_FIELDS_FOR_WAREHOUSE,
    ),
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  @WorkspaceFieldIndex({ indexType: IndexType.GIN })
  searchVector: string;
}

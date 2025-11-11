import { msg } from '@lingui/core/macro';
import {
  ActorMetadata,
  FieldMetadataType,
  RelationOnDeleteAction,
} from 'twenty-shared/types';

import { RelationType } from 'src/engine/metadata-modules/field-metadata/interfaces/relation-type.interface';
import type { Relation } from 'src/engine/workspace-manager/workspace-sync-metadata/interfaces/relation.interface';

import { SEARCH_VECTOR_FIELD } from 'src/engine/metadata-modules/constants/search-vector-field.constants';
import { IndexType } from 'src/engine/metadata-modules/index-metadata/types/indexType.types';
import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { WorkspaceEntity } from 'src/engine/twenty-orm/decorators/workspace-entity.decorator';
import { WorkspaceFieldIndex } from 'src/engine/twenty-orm/decorators/workspace-field-index.decorator';
import { WorkspaceField } from 'src/engine/twenty-orm/decorators/workspace-field.decorator';
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
import { InventoryWorkspaceEntity } from 'src/modules/inventory/standard-objects/inventory.workspace-entity';
import { TimelineActivityWorkspaceEntity } from 'src/modules/timeline/standard-objects/timeline-activity.workspace-entity';

const WAREHOUSE_CODE_FIELD_NAME = 'warehouseCode';

export const SEARCH_FIELDS_FOR_WAREHOUSE: FieldTypeAndNameMetadata[] = [
  { name: WAREHOUSE_CODE_FIELD_NAME, type: FieldMetadataType.TEXT },
];

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.warehouse,
  namePlural: 'warehouses',
  labelSingular: msg`Warehouse`,
  labelPlural: msg`Warehouses`,
  description: msg`A warehouse for storing products`,
  icon: STANDARD_OBJECT_ICONS.warehouse,
  labelIdentifierStandardId: WAREHOUSE_STANDARD_FIELD_IDS.warehouseCode,
})
@WorkspaceIsSearchable()
export class WarehouseWorkspaceEntity extends BaseWorkspaceEntity {
  @WorkspaceField({
    standardId: WAREHOUSE_STANDARD_FIELD_IDS.warehouseCode,
    type: FieldMetadataType.TEXT,
    label: msg`Warehouse Code`,
    description: msg`Unique warehouse identifier`,
    icon: 'IconCode',
  })
  warehouseCode: string;

  @WorkspaceField({
    standardId: WAREHOUSE_STANDARD_FIELD_IDS.projectId,
    type: FieldMetadataType.TEXT,
    label: msg`Project ID`,
    description: msg`Project identifier associated with warehouse`,
    icon: 'IconFolder',
  })
  projectId: string;

  @WorkspaceField({
    standardId: WAREHOUSE_STANDARD_FIELD_IDS.address,
    type: FieldMetadataType.TEXT,
    label: msg`Address`,
    description: msg`Warehouse address`,
    icon: 'IconMap',
  })
  @WorkspaceIsNullable()
  address: string | null;

  // Relations - Inventories (junction to product variants)
  @WorkspaceRelation({
    standardId: WAREHOUSE_STANDARD_FIELD_IDS.inventories,
    type: RelationType.ONE_TO_MANY,
    label: msg`Inventories`,
    description: msg`Product variant inventories in this warehouse`,
    icon: 'IconPackages',
    inverseSideTarget: () => InventoryWorkspaceEntity,
    inverseSideFieldKey: 'warehouse',
  })
  inventories: Relation<InventoryWorkspaceEntity[]>;

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

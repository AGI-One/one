import { msg } from '@lingui/core/macro';
import { FieldMetadataType, RelationOnDeleteAction } from 'twenty-shared/types';

import { RelationType } from 'src/engine/metadata-modules/field-metadata/interfaces/relation-type.interface';
import { Relation } from 'src/engine/workspace-manager/workspace-sync-metadata/interfaces/relation.interface';

import { ActorMetadata } from 'src/engine/metadata-modules/field-metadata/composite-types/actor.composite-type';
import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { WorkspaceEntity } from 'src/engine/twenty-orm/decorators/workspace-entity.decorator';
import { WorkspaceField } from 'src/engine/twenty-orm/decorators/workspace-field.decorator';
import { WorkspaceIsFieldUIReadOnly } from 'src/engine/twenty-orm/decorators/workspace-is-field-ui-readonly.decorator';
import { WorkspaceIsNullable } from 'src/engine/twenty-orm/decorators/workspace-is-nullable.decorator';
import { WorkspaceJoinColumn } from 'src/engine/twenty-orm/decorators/workspace-join-column.decorator';
import { WorkspaceRelation } from 'src/engine/twenty-orm/decorators/workspace-relation.decorator';
import { STANDARD_OBJECT_ICONS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-icons';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';
import { ProductVariantWorkspaceEntity } from 'src/modules/product-variant/standard-objects/product-variant.workspace-entity';
import { TimelineActivityWorkspaceEntity } from 'src/modules/timeline/standard-objects/timeline-activity.workspace-entity';
import { WarehouseWorkspaceEntity } from 'src/modules/warehouse/standard-objects/warehouse.workspace-entity';

// Field IDs
export const INVENTORY_STANDARD_FIELD_IDS = {
  name: 'e7f8a9b0-1c2d-3e4f-5a6b-7c8d9e0f1a2b',
  warehouse: '94d46cd8-c4f4-4c96-9e9b-9ba13e5a6c58',
  variant: 'db5bdc64-85e6-4cfb-ae60-c8b7e0a0c5e7',
  quantity: 'f3a7c8b1-9d4e-4f5a-8c6b-2e1d9a7f3c4e',
  reservedQuantity: 'a8f9c3d2-7e4b-4a9c-b5d8-6f2e1c9a8b7d',
  position: 'b9c0d1e2-8f7a-4b6c-9d5e-3a4f5c6b7d8e',
  timelineActivities: '4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a',
  createdBy: 'c2d8e9f1-6a7b-4c8d-9e3f-1a2b7c8d9e0f',
} as const;

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.inventory,
  namePlural: 'inventories',
  labelSingular: msg`Inventory`,
  labelPlural: msg`Inventories`,
  description: msg`Tracks product variant inventory levels across warehouses`,
  icon: STANDARD_OBJECT_ICONS.inventory,
  labelIdentifierStandardId: INVENTORY_STANDARD_FIELD_IDS.name,
})
export class InventoryWorkspaceEntity extends BaseWorkspaceEntity {
  // Name field (optional - can be auto-generated from warehouse + variant)
  @WorkspaceField({
    standardId: INVENTORY_STANDARD_FIELD_IDS.name,
    type: FieldMetadataType.TEXT,
    label: msg`Name`,
    description: msg`Inventory record name (e.g., "Warehouse A - Product X")`,
    icon: 'IconTag',
  })
  @WorkspaceIsNullable()
  name: string | null;

  // Warehouse relation
  @WorkspaceRelation({
    standardId: INVENTORY_STANDARD_FIELD_IDS.warehouse,
    type: RelationType.MANY_TO_ONE,
    label: msg`Warehouse`,
    description: msg`The warehouse location`,
    icon: 'IconBuilding',
    inverseSideTarget: () => WarehouseWorkspaceEntity,
    inverseSideFieldKey: 'inventories',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsNullable()
  warehouse: Relation<WarehouseWorkspaceEntity> | null;

  @WorkspaceJoinColumn('warehouse')
  warehouseId: string;

  // ProductVariant relation
  @WorkspaceRelation({
    standardId: INVENTORY_STANDARD_FIELD_IDS.variant,
    type: RelationType.MANY_TO_ONE,
    label: msg`Product Variant`,
    description: msg`The product variant`,
    icon: 'IconVersions',
    inverseSideTarget: () => ProductVariantWorkspaceEntity,
    inverseSideFieldKey: 'inventories',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsNullable()
  variant: Relation<ProductVariantWorkspaceEntity> | null;

  @WorkspaceJoinColumn('variant')
  variantId: string;

  // Quantity fields
  @WorkspaceField({
    standardId: INVENTORY_STANDARD_FIELD_IDS.quantity,
    type: FieldMetadataType.NUMBER,
    label: msg`Quantity`,
    description: msg`Total available quantity`,
    icon: 'IconNumber',
    defaultValue: 0,
  })
  quantity: number;
  @WorkspaceField({
    standardId: INVENTORY_STANDARD_FIELD_IDS.reservedQuantity,
    type: FieldMetadataType.NUMBER,
    label: msg`Reserved Quantity`,
    description: msg`Quantity reserved for pending orders`,
    icon: 'IconLock',
    defaultValue: 0,
  })
  reservedQuantity: number;

  // Position field for sorting
  @WorkspaceField({
    standardId: INVENTORY_STANDARD_FIELD_IDS.position,
    type: FieldMetadataType.POSITION,
    label: msg`Position`,
    description: msg`Inventory record position`,
    icon: 'IconList',
  })
  @WorkspaceIsNullable()
  position: number;

  // Timeline Activities
  @WorkspaceRelation({
    standardId: INVENTORY_STANDARD_FIELD_IDS.timelineActivities,
    type: RelationType.ONE_TO_MANY,
    label: msg`Timeline Activities`,
    description: msg`Timeline Activities linked to the inventory`,
    icon: 'IconTimelineEvent',
    inverseSideTarget: () => TimelineActivityWorkspaceEntity,
    inverseSideFieldKey: 'inventory',
  })
  @WorkspaceIsNullable()
  timelineActivities: Relation<TimelineActivityWorkspaceEntity[]>;

  // System fields
  @WorkspaceField({
    standardId: INVENTORY_STANDARD_FIELD_IDS.createdBy,
    type: FieldMetadataType.ACTOR,
    label: msg`Created by`,
    icon: 'IconCreativeCommonsSa',
    description: msg`The creator of the record`,
  })
  @WorkspaceIsFieldUIReadOnly()
  createdBy: ActorMetadata;
}

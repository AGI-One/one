import { msg } from '@lingui/core/macro';
import {
  FieldMetadataType,
  RelationOnDeleteAction,
  ActorMetadata,
} from 'twenty-shared/types';

import { RelationType } from 'src/engine/metadata-modules/field-metadata/interfaces/relation-type.interface';
import { Relation } from 'src/engine/workspace-manager/workspace-sync-metadata/interfaces/relation.interface';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { WorkspaceEntity } from 'src/engine/twenty-orm/decorators/workspace-entity.decorator';
import { WorkspaceField } from 'src/engine/twenty-orm/decorators/workspace-field.decorator';
import { WorkspaceIsFieldUIReadOnly } from 'src/engine/twenty-orm/decorators/workspace-is-field-ui-readonly.decorator';
import { WorkspaceIsNullable } from 'src/engine/twenty-orm/decorators/workspace-is-nullable.decorator';
import { WorkspaceJoinColumn } from 'src/engine/twenty-orm/decorators/workspace-join-column.decorator';
import { WorkspaceRelation } from 'src/engine/twenty-orm/decorators/workspace-relation.decorator';
import { STANDARD_OBJECT_ICONS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-icons';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';
import { TimelineActivityWorkspaceEntity } from 'src/modules/timeline/standard-objects/timeline-activity.workspace-entity';
import { WarehouseWorkspaceEntity } from 'src/modules/warehouse/standard-objects/warehouse.workspace-entity';
import { MaterialWorkspaceEntity } from 'src/modules/material/standard-objects/material.workspace-entity';
import { INVENTORY_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.inventory,
  namePlural: 'inventories',
  labelSingular: msg`Inventory`,
  labelPlural: msg`Inventories`,
  description: msg`Material inventory management`,
  icon: STANDARD_OBJECT_ICONS.inventory,
})
export class InventoryWorkspaceEntity extends BaseWorkspaceEntity {
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

  // Material relation
  @WorkspaceRelation({
    standardId: INVENTORY_STANDARD_FIELD_IDS.material,
    type: RelationType.MANY_TO_ONE,
    label: msg`Material`,
    description: msg`Material managed in inventory`,
    icon: 'IconBox',
    inverseSideTarget: () => MaterialWorkspaceEntity,
    inverseSideFieldKey: 'inventories',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsNullable()
  material: Relation<MaterialWorkspaceEntity> | null;

  @WorkspaceJoinColumn('material')
  materialId: string;

  // Quantity fields
  @WorkspaceField({
    standardId: INVENTORY_STANDARD_FIELD_IDS.openBalance,
    type: FieldMetadataType.NUMBER,
    label: msg`Opening Balance`,
    description: msg`Opening inventory balance`,
    icon: 'IconNumber',
    defaultValue: 0,
  })
  @WorkspaceIsNullable()
  openBalance: number | null;

  @WorkspaceField({
    standardId: INVENTORY_STANDARD_FIELD_IDS.inboundQuantity,
    type: FieldMetadataType.NUMBER,
    label: msg`Inbound Quantity`,
    description: msg`Quantity received into inventory`,
    icon: 'IconArrowDown',
    defaultValue: 0,
  })
  @WorkspaceIsNullable()
  inboundQuantity: number | null;

  @WorkspaceField({
    standardId: INVENTORY_STANDARD_FIELD_IDS.outboundQuantity,
    type: FieldMetadataType.NUMBER,
    label: msg`Outbound Quantity`,
    description: msg`Quantity issued from inventory`,
    icon: 'IconArrowUp',
    defaultValue: 0,
  })
  @WorkspaceIsNullable()
  outboundQuantity: number | null;

  @WorkspaceField({
    standardId: INVENTORY_STANDARD_FIELD_IDS.currentBalance,
    type: FieldMetadataType.NUMBER,
    label: msg`Current Balance`,
    description: msg`Current inventory balance`,
    icon: 'IconNumber',
    defaultValue: 0,
  })
  @WorkspaceIsNullable()
  currentBalance: number | null;

  @WorkspaceField({
    standardId: INVENTORY_STANDARD_FIELD_IDS.reservedQuantity,
    type: FieldMetadataType.NUMBER,
    label: msg`Reserved Quantity`,
    description: msg`Quantity reserved for orders`,
    icon: 'IconLock',
    defaultValue: 0,
  })
  @WorkspaceIsNullable()
  reservedQuantity: number | null;

  @WorkspaceField({
    standardId: INVENTORY_STANDARD_FIELD_IDS.availableQuantity,
    type: FieldMetadataType.NUMBER,
    label: msg`Available Quantity`,
    description: msg`Available quantity for use`,
    icon: 'IconCheck',
    defaultValue: 0,
  })
  @WorkspaceIsNullable()
  availableQuantity: number | null;

  @WorkspaceField({
    standardId: INVENTORY_STANDARD_FIELD_IDS.note,
    type: FieldMetadataType.TEXT,
    label: msg`Note`,
    description: msg`Notes about the inventory`,
    icon: 'IconNotes',
  })
  @WorkspaceIsNullable()
  note: string | null;

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

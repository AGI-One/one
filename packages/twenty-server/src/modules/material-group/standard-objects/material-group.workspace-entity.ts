import { msg } from '@lingui/core/macro';
import {
  FieldMetadataType,
  ActorMetadata,
  RelationOnDeleteAction,
} from 'twenty-shared/types';

import { RelationType } from 'src/engine/metadata-modules/field-metadata/interfaces/relation-type.interface';
import { Relation } from 'src/engine/workspace-manager/workspace-sync-metadata/interfaces/relation.interface';

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
import { WorkspaceJoinColumn } from 'src/engine/twenty-orm/decorators/workspace-join-column.decorator';
import { SEARCH_VECTOR_FIELD } from 'src/engine/metadata-modules/constants/search-vector-field.constants';
import { MATERIAL_GROUP_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_ICONS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-icons';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';
import {
  type FieldTypeAndNameMetadata,
  getTsVectorColumnExpressionFromFields,
} from 'src/engine/workspace-manager/workspace-sync-metadata/utils/get-ts-vector-column-expression.util';
// Import related entities
import { SupplierWorkspaceEntity } from 'src/modules/supplier/standard-objects/supplier.workspace-entity';
import { ManufacturerWorkspaceEntity } from 'src/modules/manufacturer/standard-objects/manufacturer.workspace-entity';
import { MaterialWorkspaceEntity } from 'src/modules/material/standard-objects/material.workspace-entity';
import { TimelineActivityWorkspaceEntity } from 'src/modules/timeline/standard-objects/timeline-activity.workspace-entity';

// Search fields definition
const MATERIAL_GROUP_CODE_FIELD_NAME = 'materialGroupCode';
const MATERIAL_GROUP_NAME_FIELD_NAME = 'materialGroupName';

export const SEARCH_FIELDS_FOR_MATERIAL_GROUP: FieldTypeAndNameMetadata[] = [
  { name: MATERIAL_GROUP_CODE_FIELD_NAME, type: FieldMetadataType.TEXT },
  { name: MATERIAL_GROUP_NAME_FIELD_NAME, type: FieldMetadataType.TEXT },
];

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.materialGroup,
  namePlural: 'materialGroups',
  labelSingular: msg`Material Group`,
  labelPlural: msg`Material Groups`,
  description: msg`Material group classification management`,
  icon: STANDARD_OBJECT_ICONS.materialGroup,
  shortcut: 'G',
  labelIdentifierStandardId:
    MATERIAL_GROUP_STANDARD_FIELD_IDS.materialGroupName,
})
@WorkspaceIsSearchable()
export class MaterialGroupWorkspaceEntity extends BaseWorkspaceEntity {
  // Core Business Fields
  @WorkspaceField({
    standardId: MATERIAL_GROUP_STANDARD_FIELD_IDS.materialGroupCode,
    type: FieldMetadataType.TEXT,
    label: msg`Material Group Code`,
    description: msg`Unique identifier for material group`,
    icon: 'IconCode',
  })
  materialGroupCode: string;

  @WorkspaceField({
    standardId: MATERIAL_GROUP_STANDARD_FIELD_IDS.materialGroupName,
    type: FieldMetadataType.TEXT,
    label: msg`Material Group Name`,
    description: msg`Name of the material group`,
    icon: 'IconCategory2',
  })
  materialGroupName: string;

  @WorkspaceField({
    standardId: MATERIAL_GROUP_STANDARD_FIELD_IDS.materialGroup,
    type: FieldMetadataType.TEXT,
    label: msg`Material Groups`,
    description: msg`Material group classification`,
    icon: 'IconTag',
  })
  @WorkspaceIsNullable()
  materialGroup: string | null;

  @WorkspaceField({
    standardId: MATERIAL_GROUP_STANDARD_FIELD_IDS.materialType,
    type: FieldMetadataType.TEXT,
    label: msg`Material Type`,
    description: msg`Type of material in the group`,
    icon: 'IconBoxSeam',
  })
  @WorkspaceIsNullable()
  materialType: string | null;

  @WorkspaceField({
    standardId: MATERIAL_GROUP_STANDARD_FIELD_IDS.note,
    type: FieldMetadataType.TEXT,
    label: msg`Note`,
    description: msg`Additional information about the material group`,
    icon: 'IconNotes',
  })
  @WorkspaceIsNullable()
  note: string | null;

  // Relations
  @WorkspaceRelation({
    standardId: MATERIAL_GROUP_STANDARD_FIELD_IDS.supplier,
    type: RelationType.MANY_TO_ONE,
    label: msg`Supplier`,
    description: msg`Primary supplier for this material group`,
    icon: 'IconTruck',
    inverseSideTarget: () => SupplierWorkspaceEntity,
    inverseSideFieldKey: 'materialGroups',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  supplier: Relation<SupplierWorkspaceEntity> | null;

  @WorkspaceJoinColumn('supplier')
  supplierId: string | null;

  @WorkspaceRelation({
    standardId: MATERIAL_GROUP_STANDARD_FIELD_IDS.manufacturer,
    type: RelationType.MANY_TO_ONE,
    label: msg`Manufacturer`,
    description: msg`Primary manufacturer for this material group`,
    icon: 'IconBuildingFactory2',
    inverseSideTarget: () => ManufacturerWorkspaceEntity,
    inverseSideFieldKey: 'materialGroups',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  manufacturer: Relation<ManufacturerWorkspaceEntity> | null;

  @WorkspaceJoinColumn('manufacturer')
  manufacturerId: string | null;

  @WorkspaceRelation({
    standardId: MATERIAL_GROUP_STANDARD_FIELD_IDS.materials,
    type: RelationType.ONE_TO_MANY,
    label: msg`Materials`,
    description: msg`Materials belonging to this group`,
    icon: 'IconBox',
    inverseSideTarget: () => MaterialWorkspaceEntity,
    inverseSideFieldKey: 'materialGroup',
  })
  materials: Relation<MaterialWorkspaceEntity[]>;

  // System Fields
  @WorkspaceField({
    standardId: MATERIAL_GROUP_STANDARD_FIELD_IDS.position,
    type: FieldMetadataType.POSITION,
    label: msg`Position`,
    description: msg`Position`,
    icon: 'IconHierarchy2',
  })
  @WorkspaceIsSystem()
  @WorkspaceIsNullable()
  position: number | null;

  @WorkspaceField({
    standardId: MATERIAL_GROUP_STANDARD_FIELD_IDS.createdBy,
    type: FieldMetadataType.ACTOR,
    label: msg`Created by`,
    icon: 'IconCreativeCommonsSa',
    description: msg`The creator of the record`,
  })
  @WorkspaceIsSystem()
  @WorkspaceIsNullable()
  @WorkspaceIsFieldUIReadOnly()
  createdBy: ActorMetadata | null;

  @WorkspaceRelation({
    standardId: MATERIAL_GROUP_STANDARD_FIELD_IDS.timelineActivities,
    type: RelationType.ONE_TO_MANY,
    label: msg`Timeline Activities`,
    description: msg`Timeline Activities linked to the material group`,
    icon: 'IconTimelineEvent',
    inverseSideTarget: () => TimelineActivityWorkspaceEntity,
    inverseSideFieldKey: 'materialGroup',
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  timelineActivities: Relation<TimelineActivityWorkspaceEntity[]>;

  @WorkspaceField({
    standardId: MATERIAL_GROUP_STANDARD_FIELD_IDS.searchVector,
    type: FieldMetadataType.TS_VECTOR,
    label: SEARCH_VECTOR_FIELD.label,
    description: SEARCH_VECTOR_FIELD.description,
    icon: 'IconSearch',
    generatedType: 'STORED',
    asExpression: getTsVectorColumnExpressionFromFields(
      SEARCH_FIELDS_FOR_MATERIAL_GROUP,
    ),
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  @WorkspaceFieldIndex({ indexType: IndexType.GIN })
  searchVector: string;
}

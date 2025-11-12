import { msg } from '@lingui/core/macro';
import {
  ActorMetadata,
  FieldMetadataType,
  RelationOnDeleteAction,
} from 'twenty-shared/types';

import { RelationType } from 'src/engine/metadata-modules/field-metadata/interfaces/relation-type.interface';
import { Relation } from 'src/engine/workspace-manager/workspace-sync-metadata/interfaces/relation.interface';

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
import { WorkspaceJoinColumn } from 'src/engine/twenty-orm/decorators/workspace-join-column.decorator';
import { WorkspaceRelation } from 'src/engine/twenty-orm/decorators/workspace-relation.decorator';
import { MATERIAL_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_ICONS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-icons';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';
import {
  type FieldTypeAndNameMetadata,
  getTsVectorColumnExpressionFromFields,
} from 'src/engine/workspace-manager/workspace-sync-metadata/utils/get-ts-vector-column-expression.util';
// Import related entities
import { InventoryWorkspaceEntity } from 'src/modules/inventory/standard-objects/inventory.workspace-entity';
import { MaterialCategoryWorkspaceEntity } from 'src/modules/material-category/standard-objects/material-category.workspace-entity';
import { MaterialGroupWorkspaceEntity } from 'src/modules/material-group/standard-objects/material-group.workspace-entity';
import { TimelineActivityWorkspaceEntity } from 'src/modules/timeline/standard-objects/timeline-activity.workspace-entity';

enum MaterialStatus {
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PENDING = 'pending',
}

// Search fields definition
const MATERIAL_CODE_FIELD_NAME = 'materialCode';
const MATERIAL_NAME_FIELD_NAME = 'materialName';

export const SEARCH_FIELDS_FOR_MATERIAL: FieldTypeAndNameMetadata[] = [
  { name: MATERIAL_CODE_FIELD_NAME, type: FieldMetadataType.TEXT },
  { name: MATERIAL_NAME_FIELD_NAME, type: FieldMetadataType.TEXT },
];

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.material,
  namePlural: 'materials',
  labelSingular: msg`Material`,
  labelPlural: msg`Materials`,
  description: msg`Material management`,
  icon: STANDARD_OBJECT_ICONS.material,
  shortcut: 'T',
  labelIdentifierStandardId: MATERIAL_STANDARD_FIELD_IDS.materialName,
})
@WorkspaceIsSearchable()
export class MaterialWorkspaceEntity extends BaseWorkspaceEntity {
  // Core Business Fields
  @WorkspaceField({
    standardId: MATERIAL_STANDARD_FIELD_IDS.materialCode,
    type: FieldMetadataType.TEXT,
    label: msg`Material Code`,
    description: msg`Unique identifier for the material`,
    icon: 'IconCode',
  })
  materialCode: string;

  @WorkspaceField({
    standardId: MATERIAL_STANDARD_FIELD_IDS.materialName,
    type: FieldMetadataType.TEXT,
    label: msg`Material Name`,
    description: msg`Name of the material`,
    icon: 'IconBox',
  })
  materialName: string;

  @WorkspaceField({
    standardId: MATERIAL_STANDARD_FIELD_IDS.systemNumber1,
    type: FieldMetadataType.TEXT,
    label: msg`System Number 1`,
    description: msg`First system number`,
    icon: 'IconHash',
  })
  @WorkspaceIsNullable()
  systemNumber1: string | null;

  @WorkspaceField({
    standardId: MATERIAL_STANDARD_FIELD_IDS.systemNumber2,
    type: FieldMetadataType.TEXT,
    label: msg`System Number 2`,
    description: msg`Second system number`,
    icon: 'IconHash',
  })
  @WorkspaceIsNullable()
  systemNumber2: string | null;

  @WorkspaceField({
    standardId: MATERIAL_STANDARD_FIELD_IDS.formatCode,
    type: FieldMetadataType.TEXT,
    label: msg`Format Code`,
    description: msg`Format code of the material`,
    icon: 'IconCode',
  })
  @WorkspaceIsNullable()
  formatCode: string | null;

  @WorkspaceField({
    standardId: MATERIAL_STANDARD_FIELD_IDS.specification,
    type: FieldMetadataType.TEXT,
    label: msg`Specification`,
    description: msg`Detailed technical specifications of the material`,
    icon: 'IconFileText',
  })
  @WorkspaceIsNullable()
  specification: string | null;

  @WorkspaceField({
    standardId: MATERIAL_STANDARD_FIELD_IDS.unit,
    type: FieldMetadataType.TEXT,
    label: msg`Unit`,
    description: msg`Unit of measurement`,
    icon: 'IconRuler',
  })
  @WorkspaceIsNullable()
  unit: string | null;

  @WorkspaceField({
    standardId: MATERIAL_STANDARD_FIELD_IDS.model,
    type: FieldMetadataType.TEXT,
    label: msg`Model`,
    description: msg`Model of the material`,
    icon: 'IconBrandModels',
  })
  @WorkspaceIsNullable()
  model: string | null;

  @WorkspaceField({
    standardId: MATERIAL_STANDARD_FIELD_IDS.note,
    type: FieldMetadataType.TEXT,
    label: msg`Note`,
    description: msg`Additional information about the material`,
    icon: 'IconNotes',
  })
  @WorkspaceIsNullable()
  note: string | null;

  @WorkspaceField({
    standardId: MATERIAL_STANDARD_FIELD_IDS.status,
    type: FieldMetadataType.SELECT,
    label: msg`Status`,
    description: msg`Material approval status`,
    icon: 'IconCircleDot',
    defaultValue: `'${MaterialStatus.APPROVED}'`,
    options: [
      {
        value: MaterialStatus.APPROVED,
        label: 'Approved',
        position: 0,
        color: 'green',
      },
      {
        value: MaterialStatus.REJECTED,
        label: 'Rejected',
        position: 1,
        color: 'red',
      },
      {
        value: MaterialStatus.PENDING,
        label: 'Pending',
        position: 2,
        color: 'yellow',
      },
    ],
  })
  status: MaterialStatus;

  @WorkspaceField({
    standardId: MATERIAL_STANDARD_FIELD_IDS.project,
    type: FieldMetadataType.TEXT,
    label: msg`Project`,
    description: msg`Related project ID or name`,
    icon: 'IconFolder',
  })
  @WorkspaceIsNullable()
  project: string | null;

  // Relations
  @WorkspaceRelation({
    standardId: MATERIAL_STANDARD_FIELD_IDS.materialGroup,
    type: RelationType.MANY_TO_ONE,
    label: msg`Material Group`,
    description: msg`Material group that this material belongs to`,
    icon: 'IconCategory2',
    inverseSideTarget: () => MaterialGroupWorkspaceEntity,
    inverseSideFieldKey: 'materials',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  materialGroup: Relation<MaterialGroupWorkspaceEntity> | null;

  @WorkspaceJoinColumn('materialGroup')
  materialGroupId: string | null;

  @WorkspaceRelation({
    standardId: MATERIAL_STANDARD_FIELD_IDS.materialCategory,
    type: RelationType.MANY_TO_ONE,
    label: msg`Material Category`,
    description: msg`Material category that this material belongs to`,
    icon: 'IconCategory',
    inverseSideTarget: () => MaterialCategoryWorkspaceEntity,
    inverseSideFieldKey: 'materials',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  materialCategory: Relation<MaterialCategoryWorkspaceEntity> | null;

  @WorkspaceJoinColumn('materialCategory')
  materialCategoryId: string | null;

  @WorkspaceRelation({
    standardId: MATERIAL_STANDARD_FIELD_IDS.inventories,
    type: RelationType.ONE_TO_MANY,
    label: msg`Inventories`,
    description: msg`List of inventories for this material`,
    icon: 'IconPackages',
    inverseSideTarget: () => InventoryWorkspaceEntity,
    inverseSideFieldKey: 'material',
  })
  inventories: Relation<InventoryWorkspaceEntity[]>;

  // System Fields
  @WorkspaceField({
    standardId: MATERIAL_STANDARD_FIELD_IDS.position,
    type: FieldMetadataType.POSITION,
    label: msg`Position`,
    description: msg`Position`,
    icon: 'IconHierarchy2',
  })
  @WorkspaceIsSystem()
  @WorkspaceIsNullable()
  position: number | null;

  @WorkspaceField({
    standardId: MATERIAL_STANDARD_FIELD_IDS.createdBy,
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
    standardId: MATERIAL_STANDARD_FIELD_IDS.timelineActivities,
    type: RelationType.ONE_TO_MANY,
    label: msg`Timeline Activities`,
    description: msg`Timeline Activities linked to the material`,
    icon: 'IconTimelineEvent',
    inverseSideTarget: () => TimelineActivityWorkspaceEntity,
    inverseSideFieldKey: 'material',
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  timelineActivities: Relation<TimelineActivityWorkspaceEntity[]>;

  @WorkspaceField({
    standardId: MATERIAL_STANDARD_FIELD_IDS.searchVector,
    type: FieldMetadataType.TS_VECTOR,
    label: SEARCH_VECTOR_FIELD.label,
    description: SEARCH_VECTOR_FIELD.description,
    icon: 'IconSearch',
    generatedType: 'STORED',
    asExpression: getTsVectorColumnExpressionFromFields(
      SEARCH_FIELDS_FOR_MATERIAL,
    ),
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  @WorkspaceFieldIndex({ indexType: IndexType.GIN })
  searchVector: string;
}

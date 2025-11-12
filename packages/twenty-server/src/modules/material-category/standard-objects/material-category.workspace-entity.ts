import { msg } from '@lingui/core/macro';
import { ActorMetadata, FieldMetadataType } from 'twenty-shared/types';

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
import { WorkspaceRelation } from 'src/engine/twenty-orm/decorators/workspace-relation.decorator';
import { MATERIAL_CATEGORY_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_ICONS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-icons';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';
import {
  type FieldTypeAndNameMetadata,
  getTsVectorColumnExpressionFromFields,
} from 'src/engine/workspace-manager/workspace-sync-metadata/utils/get-ts-vector-column-expression.util';
// Import related entities
import { MaterialWorkspaceEntity } from 'src/modules/material/standard-objects/material.workspace-entity';
import { TimelineActivityWorkspaceEntity } from 'src/modules/timeline/standard-objects/timeline-activity.workspace-entity';

// Search fields definition
const MATERIAL_CATEGORY_CODE_FIELD_NAME = 'materialCategoryCode';
const MATERIAL_CATEGORY_NAME_FIELD_NAME = 'materialCategoryName';

export const SEARCH_FIELDS_FOR_MATERIAL_CATEGORY: FieldTypeAndNameMetadata[] = [
  { name: MATERIAL_CATEGORY_CODE_FIELD_NAME, type: FieldMetadataType.TEXT },
  { name: MATERIAL_CATEGORY_NAME_FIELD_NAME, type: FieldMetadataType.TEXT },
];

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.materialCategory,
  namePlural: 'materialCategories',
  labelSingular: msg`Material Category`,
  labelPlural: msg`Material Categories`,
  description: msg`Material category management`,
  icon: STANDARD_OBJECT_ICONS.materialCategory,
  shortcut: 'T',
  labelIdentifierStandardId:
    MATERIAL_CATEGORY_STANDARD_FIELD_IDS.materialCategoryName,
})
@WorkspaceIsSearchable()
export class MaterialCategoryWorkspaceEntity extends BaseWorkspaceEntity {
  // Core Business Fields
  @WorkspaceField({
    standardId: MATERIAL_CATEGORY_STANDARD_FIELD_IDS.materialCategoryCode,
    type: FieldMetadataType.TEXT,
    label: msg`Material Category Code`,
    description: msg`Unique identifier for the material`,
    icon: 'IconCode',
  })
  materialCategoryCode: string;

  @WorkspaceField({
    standardId: MATERIAL_CATEGORY_STANDARD_FIELD_IDS.materialCategoryName,
    type: FieldMetadataType.TEXT,
    label: msg`Material Category Name`,
    description: msg`Name of the material`,
    icon: 'IconBox',
  })
  materialCategoryName: string;

  @WorkspaceRelation({
    standardId: MATERIAL_CATEGORY_STANDARD_FIELD_IDS.materials,
    type: RelationType.ONE_TO_MANY,
    label: msg`Materials`,
    description: msg`Materials belonging to this category`,
    icon: 'IconBox',
    inverseSideTarget: () => MaterialWorkspaceEntity,
    inverseSideFieldKey: 'materialCategory',
  })
  materials: Relation<MaterialWorkspaceEntity[]>;

  // System Fields
  @WorkspaceField({
    standardId: MATERIAL_CATEGORY_STANDARD_FIELD_IDS.position,
    type: FieldMetadataType.POSITION,
    label: msg`Position`,
    description: msg`Position`,
    icon: 'IconHierarchy2',
  })
  @WorkspaceIsSystem()
  @WorkspaceIsNullable()
  position: number | null;

  @WorkspaceField({
    standardId: MATERIAL_CATEGORY_STANDARD_FIELD_IDS.createdBy,
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
    standardId: MATERIAL_CATEGORY_STANDARD_FIELD_IDS.timelineActivities,
    type: RelationType.ONE_TO_MANY,
    label: msg`Timeline Activities`,
    description: msg`Timeline Activities linked to the material`,
    icon: 'IconTimelineEvent',
    inverseSideTarget: () => TimelineActivityWorkspaceEntity,
    inverseSideFieldKey: 'materialCategory',
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  timelineActivities: Relation<TimelineActivityWorkspaceEntity[]>;

  @WorkspaceField({
    standardId: MATERIAL_CATEGORY_STANDARD_FIELD_IDS.searchVector,
    type: FieldMetadataType.TS_VECTOR,
    label: SEARCH_VECTOR_FIELD.label,
    description: SEARCH_VECTOR_FIELD.description,
    icon: 'IconSearch',
    generatedType: 'STORED',
    asExpression: getTsVectorColumnExpressionFromFields(
      SEARCH_FIELDS_FOR_MATERIAL_CATEGORY,
    ),
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  @WorkspaceFieldIndex({ indexType: IndexType.GIN })
  searchVector: string;
}

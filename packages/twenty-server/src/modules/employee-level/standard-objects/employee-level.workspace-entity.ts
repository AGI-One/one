import { msg } from '@lingui/core/macro';
import { FieldMetadataType, RelationOnDeleteAction } from 'twenty-shared/types';

import { RelationType } from 'src/engine/metadata-modules/field-metadata/interfaces/relation-type.interface';
import { Relation } from 'src/engine/workspace-manager/workspace-sync-metadata/interfaces/relation.interface';

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
import { WorkspaceRelation } from 'src/engine/twenty-orm/decorators/workspace-relation.decorator';
import {
  type FieldTypeAndNameMetadata,
  getTsVectorColumnExpressionFromFields,
} from 'src/engine/workspace-manager/workspace-sync-metadata/utils/get-ts-vector-column-expression.util';
import { EmployeeWorkspaceEntity } from 'src/modules/employee/standard-objects/employee.workspace-entity';

const LEVEL_FIELD_NAME = 'level';

export const SEARCH_FIELDS_FOR_EMPLOYEE_LEVEL: FieldTypeAndNameMetadata[] = [
  { name: LEVEL_FIELD_NAME, type: FieldMetadataType.TEXT },
];

@WorkspaceEntity({
  standardId: '82d8264c-8c2c-4e2f-a01e-00b9fb58fa01',
  namePlural: 'employeeLevels',
  labelSingular: msg`Employee Level`,
  labelPlural: msg`Employee Levels`,
  description: msg`Employee seniority or experience level (Junior, Mid, Senior, etc.)`,
  icon: 'IconStairs',
  shortcut: 'EL',
  labelIdentifierStandardId: '3fbfe175-325c-43d5-9c5e-5a3eedbb3ff5',
})
@WorkspaceIsSearchable()
export class EmployeeLevelWorkspaceEntity extends BaseWorkspaceEntity {
  @WorkspaceField({
    standardId: '3fbfe175-325c-43d5-9c5e-5a3eedbb3ff5',
    type: FieldMetadataType.TEXT,
    label: msg`Level`,
    description: msg`Employee level (e.g., Junior, Mid-level, Senior, Lead, Principal)`,
    icon: 'IconStairs',
  })
  level: string;

  @WorkspaceField({
    standardId: '0f33eaf1-f785-413b-915d-34763d2dd483',
    type: FieldMetadataType.POSITION,
    label: msg`Position`,
    description: msg`Employee level record position`,
    icon: 'IconHierarchy2',
    defaultValue: 0,
  })
  @WorkspaceIsSystem()
  position: number;

  @WorkspaceField({
    standardId: '447edf35-ebd4-44ad-88e6-734f451cec92',
    type: FieldMetadataType.ACTOR,
    label: msg`Created by`,
    icon: 'IconCreativeCommonsSa',
    description: msg`The creator of the record`,
  })
  @WorkspaceIsFieldUIReadOnly()
  createdBy: ActorMetadata;

  // Relations
  @WorkspaceRelation({
    standardId: 'dd5809bc-5635-4723-a16b-483898b9b986',
    type: RelationType.ONE_TO_MANY,
    label: msg`Employees`,
    description: msg`Employees at this level`,
    icon: 'IconUsers',
    inverseSideTarget: () => EmployeeWorkspaceEntity,
    inverseSideFieldKey: 'level',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  employees: Relation<EmployeeWorkspaceEntity[]>;

  @WorkspaceField({
    standardId: 'a6f7c1c9-fc2e-4b93-ac8d-da652b75a3a3',
    type: FieldMetadataType.TS_VECTOR,
    label: SEARCH_VECTOR_FIELD.label,
    description: SEARCH_VECTOR_FIELD.description,
    icon: 'IconStairs',
    generatedType: 'STORED',
    asExpression: getTsVectorColumnExpressionFromFields(
      SEARCH_FIELDS_FOR_EMPLOYEE_LEVEL,
    ),
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  @WorkspaceFieldIndex({ indexType: IndexType.GIN })
  searchVector: string;
}

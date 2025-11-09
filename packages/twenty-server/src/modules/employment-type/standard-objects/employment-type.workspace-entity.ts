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
import { TimelineActivityWorkspaceEntity } from 'src/modules/timeline/standard-objects/timeline-activity.workspace-entity';

const NAME_FIELD_NAME = 'name';

export const SEARCH_FIELDS_FOR_EMPLOYMENT_TYPE: FieldTypeAndNameMetadata[] = [
  { name: NAME_FIELD_NAME, type: FieldMetadataType.TEXT },
];

@WorkspaceEntity({
  standardId: '6c231232-1bf2-4669-b653-60faa7e02fab',
  namePlural: 'employmentTypes',
  labelSingular: msg`Employment Type`,
  labelPlural: msg`Employment Types`,
  description: msg`Type of employment (full-time, part-time, contract, etc.)`,
  icon: 'IconFileText',
  shortcut: 'ET',
  labelIdentifierStandardId: '60f38a84-d8b3-4e84-b256-32a643acffed',
})
@WorkspaceIsSearchable()
export class EmploymentTypeWorkspaceEntity extends BaseWorkspaceEntity {
  @WorkspaceField({
    standardId: '60f38a84-d8b3-4e84-b256-32a643acffed',
    type: FieldMetadataType.TEXT,
    label: msg`Name`,
    description: msg`Employment type name (e.g., Full-time, Part-time, Contract, Freelance)`,
    icon: 'IconFileText',
  })
  name: string;

  @WorkspaceField({
    standardId: 'c4c515df-e83f-413f-b1fa-c3c892d4f05d',
    type: FieldMetadataType.POSITION,
    label: msg`Position`,
    description: msg`Employment type record position`,
    icon: 'IconHierarchy2',
    defaultValue: 0,
  })
  @WorkspaceIsSystem()
  position: number;

  @WorkspaceField({
    standardId: '8645b7bd-64c2-4f6a-8d2f-a314b83795bd',
    type: FieldMetadataType.ACTOR,
    label: msg`Created by`,
    icon: 'IconCreativeCommonsSa',
    description: msg`The creator of the record`,
  })
  @WorkspaceIsFieldUIReadOnly()
  createdBy: ActorMetadata;

  // Relations
  @WorkspaceRelation({
    standardId: '25c86e5e-929a-49dc-99d0-05bbed697978',
    type: RelationType.ONE_TO_MANY,
    label: msg`Employees`,
    description: msg`Employees with this employment type`,
    icon: 'IconUsers',
    inverseSideTarget: () => EmployeeWorkspaceEntity,
    inverseSideFieldKey: 'employmentType',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  employees: Relation<EmployeeWorkspaceEntity[]>;

  @WorkspaceRelation({
    standardId: 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
    type: RelationType.ONE_TO_MANY,
    label: msg`Timeline Activities`,
    description: msg`Events linked to the employment type`,
    icon: 'IconTimeline',
    inverseSideTarget: () => TimelineActivityWorkspaceEntity,
    inverseSideFieldKey: 'employmentType',
  })
  @WorkspaceIsNullable()
  timelineActivities: Relation<TimelineActivityWorkspaceEntity[]>;

  @WorkspaceField({
    standardId: 'aeae1670-b7db-40a9-a62c-5839347ec156',
    type: FieldMetadataType.TS_VECTOR,
    label: SEARCH_VECTOR_FIELD.label,
    description: SEARCH_VECTOR_FIELD.description,
    icon: 'IconFileText',
    generatedType: 'STORED',
    asExpression: getTsVectorColumnExpressionFromFields(
      SEARCH_FIELDS_FOR_EMPLOYMENT_TYPE,
    ),
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  @WorkspaceFieldIndex({ indexType: IndexType.GIN })
  searchVector: string;
}

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

export const SEARCH_FIELDS_FOR_DEPARTMENT: FieldTypeAndNameMetadata[] = [
  { name: NAME_FIELD_NAME, type: FieldMetadataType.TEXT },
];

@WorkspaceEntity({
  standardId: '4fd2619f-2624-48cd-97e8-c5328de9f7ea',
  namePlural: 'departments',
  labelSingular: msg`Department`,
  labelPlural: msg`Departments`,
  description: msg`An organizational department`,
  icon: 'IconBuilding',
  shortcut: 'D',
  labelIdentifierStandardId: '4f96d230-a3f0-4d40-949b-44f082811ba1',
})
@WorkspaceIsSearchable()
export class DepartmentWorkspaceEntity extends BaseWorkspaceEntity {
  @WorkspaceField({
    standardId: '4f96d230-a3f0-4d40-949b-44f082811ba1',
    type: FieldMetadataType.TEXT,
    label: msg`Name`,
    description: msg`Department name`,
    icon: 'IconBuilding',
  })
  name: string;

  @WorkspaceField({
    standardId: '1355827d-f446-4397-8775-a76ada067c8d',
    type: FieldMetadataType.POSITION,
    label: msg`Position`,
    description: msg`Department record position`,
    icon: 'IconHierarchy2',
    defaultValue: 0,
  })
  @WorkspaceIsSystem()
  position: number;

  @WorkspaceField({
    standardId: '7d03bfc8-bd7f-4b53-8216-ecf1a4311c5b',
    type: FieldMetadataType.ACTOR,
    label: msg`Created by`,
    icon: 'IconCreativeCommonsSa',
    description: msg`The creator of the record`,
  })
  @WorkspaceIsFieldUIReadOnly()
  createdBy: ActorMetadata;

  // Relations
  @WorkspaceRelation({
    standardId: '4fea132a-1762-480f-88e5-30f0c8c3addf',
    type: RelationType.ONE_TO_MANY,
    label: msg`Employees`,
    description: msg`Employees in this department`,
    icon: 'IconUsers',
    inverseSideTarget: () => EmployeeWorkspaceEntity,
    inverseSideFieldKey: 'department',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  employees: Relation<EmployeeWorkspaceEntity[]>;

  @WorkspaceRelation({
    standardId: 'f8dcde89-e8a4-4f35-a5d2-7c91e3f08d46',
    type: RelationType.ONE_TO_MANY,
    label: msg`Timeline Activities`,
    description: msg`Events linked to the department`,
    icon: 'IconTimeline',
    inverseSideTarget: () => TimelineActivityWorkspaceEntity,
    inverseSideFieldKey: 'department',
  })
  @WorkspaceIsNullable()
  timelineActivities: Relation<TimelineActivityWorkspaceEntity[]>;

  @WorkspaceField({
    standardId: '9861955e-2ae8-4e8b-9b17-02b146194b11',
    type: FieldMetadataType.TS_VECTOR,
    label: SEARCH_VECTOR_FIELD.label,
    description: SEARCH_VECTOR_FIELD.description,
    icon: 'IconBuilding',
    generatedType: 'STORED',
    asExpression: getTsVectorColumnExpressionFromFields(
      SEARCH_FIELDS_FOR_DEPARTMENT,
    ),
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  @WorkspaceFieldIndex({ indexType: IndexType.GIN })
  searchVector: string;
}

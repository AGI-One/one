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

const NAME_FIELD_NAME = 'name';

export const SEARCH_FIELDS_FOR_ORGANIZATION_POSITION: FieldTypeAndNameMetadata[] =
  [{ name: NAME_FIELD_NAME, type: FieldMetadataType.TEXT }];

@WorkspaceEntity({
  standardId: '44b2f458-19c2-4460-ab19-33bcc40db34e',
  namePlural: 'organizationPositions',
  labelSingular: msg`Organization Position`,
  labelPlural: msg`Organization Positions`,
  description: msg`An organizational position or job role`,
  icon: 'IconBriefcase',
  shortcut: 'OP',
  labelIdentifierStandardId: 'dcd033ec-8b95-4f12-a520-b5af1382a0df',
})
@WorkspaceIsSearchable()
export class OrganizationPositionWorkspaceEntity extends BaseWorkspaceEntity {
  @WorkspaceField({
    standardId: 'dcd033ec-8b95-4f12-a520-b5af1382a0df',
    type: FieldMetadataType.TEXT,
    label: msg`Name`,
    description: msg`Position name`,
    icon: 'IconBriefcase',
  })
  name: string;

  @WorkspaceField({
    standardId: '1ba60754-71a9-4cf5-861e-e6885aa377ef',
    type: FieldMetadataType.POSITION,
    label: msg`Position Order`,
    description: msg`Position record order`,
    icon: 'IconHierarchy2',
    defaultValue: 0,
  })
  @WorkspaceIsSystem()
  position: number;

  @WorkspaceField({
    standardId: '61081bb2-191e-4221-a504-208ecb0ebdc6',
    type: FieldMetadataType.ACTOR,
    label: msg`Created by`,
    icon: 'IconCreativeCommonsSa',
    description: msg`The creator of the record`,
  })
  @WorkspaceIsFieldUIReadOnly()
  createdBy: ActorMetadata;

  // Relations
  @WorkspaceRelation({
    standardId: '38b95cc0-ee07-4bfa-81e0-ebbe56d21891',
    type: RelationType.ONE_TO_MANY,
    label: msg`Employees`,
    description: msg`Employees with this position`,
    icon: 'IconUsers',
    inverseSideTarget: () => EmployeeWorkspaceEntity,
    inverseSideFieldKey: 'organizationPosition',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  employees: Relation<EmployeeWorkspaceEntity[]>;

  @WorkspaceField({
    standardId: 'e6f71ed2-42f9-4756-ae9b-f8655485c83d',
    type: FieldMetadataType.TS_VECTOR,
    label: SEARCH_VECTOR_FIELD.label,
    description: SEARCH_VECTOR_FIELD.description,
    icon: 'IconBriefcase',
    generatedType: 'STORED',
    asExpression: getTsVectorColumnExpressionFromFields(
      SEARCH_FIELDS_FOR_ORGANIZATION_POSITION,
    ),
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  @WorkspaceFieldIndex({ indexType: IndexType.GIN })
  searchVector: string;
}

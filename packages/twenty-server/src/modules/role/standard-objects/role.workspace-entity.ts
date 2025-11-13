import { msg } from '@lingui/core/macro';
import {
  FieldMetadataType,
  RelationOnDeleteAction,
  ActorMetadata,
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
import { WorkspaceRelation } from 'src/engine/twenty-orm/decorators/workspace-relation.decorator';
import { ROLE_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_ICONS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-icons';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';
import {
  type FieldTypeAndNameMetadata,
  getTsVectorColumnExpressionFromFields,
} from 'src/engine/workspace-manager/workspace-sync-metadata/utils/get-ts-vector-column-expression.util';
import { TimelineActivityWorkspaceEntity } from 'src/modules/timeline/standard-objects/timeline-activity.workspace-entity';

const ROLE_NAME_FIELD_NAME = 'roleName';
const DESCRIPTION_FIELD_NAME = 'description';

export const SEARCH_FIELDS_FOR_ROLES: FieldTypeAndNameMetadata[] = [
  { name: ROLE_NAME_FIELD_NAME, type: FieldMetadataType.TEXT },
  { name: DESCRIPTION_FIELD_NAME, type: FieldMetadataType.TEXT },
];

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.role,
  namePlural: 'roles',
  labelSingular: msg`Role`,
  labelPlural: msg`Roles`,
  description: msg`A role in the organization`,
  icon: STANDARD_OBJECT_ICONS.role,
  labelIdentifierStandardId: ROLE_STANDARD_FIELD_IDS.roleName,
})
@WorkspaceIsSearchable()
export class RoleWorkspaceEntity extends BaseWorkspaceEntity {
  @WorkspaceField({
    standardId: ROLE_STANDARD_FIELD_IDS.roleName,
    type: FieldMetadataType.TEXT,
    label: msg`Role Name`,
    description: msg`Role name`,
    icon: 'IconUsers',
  })
  roleName: string;

  @WorkspaceField({
    standardId: ROLE_STANDARD_FIELD_IDS.roleCode,
    type: FieldMetadataType.TEXT,
    label: msg`Role Code`,
    description: msg`Role code`,
    icon: 'IconCode',
  })
  roleCode: string;

  @WorkspaceField({
    standardId: ROLE_STANDARD_FIELD_IDS.description,
    type: FieldMetadataType.TEXT,
    label: msg`Description`,
    description: msg`Role description`,
    icon: 'IconFileDescription',
  })
  @WorkspaceIsNullable()
  description: string | null;

  @WorkspaceField({
    standardId: ROLE_STANDARD_FIELD_IDS.workGroup,
    type: FieldMetadataType.TEXT,
    label: msg`Work Group`,
    description: msg`Work group`,
    icon: 'IconUsersGroup',
  })
  @WorkspaceIsNullable()
  workGroup: string | null;

  @WorkspaceField({
    standardId: ROLE_STANDARD_FIELD_IDS.position,
    type: FieldMetadataType.POSITION,
    label: msg`Position`,
    description: msg`Role record position`,
    icon: 'IconHierarchy2',
    defaultValue: 0,
  })
  @WorkspaceIsSystem()
  position: number;

  @WorkspaceField({
    standardId: ROLE_STANDARD_FIELD_IDS.createdBy,
    type: FieldMetadataType.ACTOR,
    label: msg`Created by`,
    icon: 'IconCreativeCommonsSa',
    description: msg`The creator of the record`,
  })
  @WorkspaceIsFieldUIReadOnly()
  createdBy: ActorMetadata;

  @WorkspaceRelation({
    standardId: ROLE_STANDARD_FIELD_IDS.timelineActivities,
    type: RelationType.ONE_TO_MANY,
    label: msg`Timeline Activities`,
    description: msg`Timeline Activities linked to the role.`,
    icon: 'IconTimelineEvent',
    inverseSideTarget: () => TimelineActivityWorkspaceEntity,
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  timelineActivities: Relation<TimelineActivityWorkspaceEntity[]>;

  @WorkspaceField({
    standardId: ROLE_STANDARD_FIELD_IDS.searchVector,
    type: FieldMetadataType.TS_VECTOR,
    label: SEARCH_VECTOR_FIELD.label,
    description: SEARCH_VECTOR_FIELD.description,
    icon: 'IconUser',
    generatedType: 'STORED',
    asExpression: getTsVectorColumnExpressionFromFields(
      SEARCH_FIELDS_FOR_ROLES,
    ),
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  @WorkspaceFieldIndex({ indexType: IndexType.GIN })
  searchVector: string;
}

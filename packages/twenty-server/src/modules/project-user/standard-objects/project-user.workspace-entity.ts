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
import { WorkspaceIsSystem } from 'src/engine/twenty-orm/decorators/workspace-is-system.decorator';
import { WorkspaceJoinColumn } from 'src/engine/twenty-orm/decorators/workspace-join-column.decorator';
import { WorkspaceRelation } from 'src/engine/twenty-orm/decorators/workspace-relation.decorator';
import { STANDARD_OBJECT_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_ICONS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-icons';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';
import {
  type FieldTypeAndNameMetadata,
  getTsVectorColumnExpressionFromFields,
} from 'src/engine/workspace-manager/workspace-sync-metadata/utils/get-ts-vector-column-expression.util';
import { ProjectWorkspaceEntity } from 'src/modules/project/standard-objects/project.workspace-entity';
import { TimelineActivityWorkspaceEntity } from 'src/modules/timeline/standard-objects/timeline-activity.workspace-entity';
import { AppUserWorkspaceEntity } from 'src/modules/user/standard-objects/user.workspace-entity';

const SEARCH_FIELDS_FOR_PROJECT_USER: FieldTypeAndNameMetadata[] = [
  { name: 'email', type: FieldMetadataType.TEXT },
];

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.projectUser,
  namePlural: 'projectUsers',
  labelSingular: msg`Project User`,
  labelPlural: msg`Project Users`,
  description: msg`Junction table linking users to projects`,
  icon: STANDARD_OBJECT_ICONS.projectUser,
  labelIdentifierStandardId: STANDARD_OBJECT_FIELD_IDS.projectUser.email,
})
export class ProjectUserWorkspaceEntity extends BaseWorkspaceEntity {
  @WorkspaceField({
    standardId: STANDARD_OBJECT_FIELD_IDS.projectUser.email,
    type: FieldMetadataType.TEXT,
    label: msg`Email`,
    description: msg`Email of the user in project`,
    icon: 'IconMail',
  })
  email: string;

  // System Fields
  @WorkspaceField({
    standardId: STANDARD_OBJECT_FIELD_IDS.projectUser.position,
    type: FieldMetadataType.POSITION,
    label: msg`Position`,
    description: msg`Position`,
    icon: 'IconHierarchy2',
    defaultValue: 0,
  })
  @WorkspaceIsSystem()
  position: number;

  @WorkspaceField({
    standardId: STANDARD_OBJECT_FIELD_IDS.projectUser.createdBy,
    type: FieldMetadataType.ACTOR,
    label: msg`Created by`,
    icon: 'IconCreativeCommonsSa',
    description: msg`The creator of the record`,
  })
  @WorkspaceIsFieldUIReadOnly()
  createdBy: ActorMetadata;

  @WorkspaceField({
    standardId: STANDARD_OBJECT_FIELD_IDS.projectUser.searchVector,
    type: FieldMetadataType.TS_VECTOR,
    label: SEARCH_VECTOR_FIELD.label,
    description: SEARCH_VECTOR_FIELD.description,
    icon: 'IconUser',
    generatedType: 'STORED',
    asExpression: getTsVectorColumnExpressionFromFields(
      SEARCH_FIELDS_FOR_PROJECT_USER,
    ),
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  @WorkspaceFieldIndex({ indexType: IndexType.GIN })
  searchVector: string;

  // Relations
  @WorkspaceRelation({
    standardId: STANDARD_OBJECT_FIELD_IDS.projectUser.appUserId,
    type: RelationType.MANY_TO_ONE,
    label: msg`App User`,
    description: msg`App User`,
    icon: 'IconUser',
    inverseSideTarget: () => AppUserWorkspaceEntity,
    inverseSideFieldKey: 'projectUsers',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsNullable()
  appUser: Relation<AppUserWorkspaceEntity> | null;

  @WorkspaceJoinColumn('appUser')
  appUserId: string | null;

  @WorkspaceRelation({
    standardId: STANDARD_OBJECT_FIELD_IDS.projectUser.projectId,
    type: RelationType.MANY_TO_ONE,
    label: msg`Project`,
    description: msg`Project`,
    icon: 'IconBriefcase',
    inverseSideTarget: () => ProjectWorkspaceEntity,
    inverseSideFieldKey: 'projectUsers',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsNullable()
  project: Relation<ProjectWorkspaceEntity> | null;

  @WorkspaceJoinColumn('project')
  projectId: string | null;

  @WorkspaceRelation({
    standardId: STANDARD_OBJECT_FIELD_IDS.projectUser.timelineActivities,
    type: RelationType.ONE_TO_MANY,
    label: msg`Timeline`,
    description: msg`Timeline linked to the project user`,
    icon: 'IconTimelineEvent',
    inverseSideTarget: () => TimelineActivityWorkspaceEntity,
    inverseSideFieldKey: 'projectUser',
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  timelineActivities: Relation<TimelineActivityWorkspaceEntity[]>;
}

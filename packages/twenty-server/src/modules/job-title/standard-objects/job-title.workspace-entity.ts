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
import { WorkspaceIsSystem } from 'src/engine/twenty-orm/decorators/workspace-is-system.decorator';
import { WorkspaceRelation } from 'src/engine/twenty-orm/decorators/workspace-relation.decorator';
import { JOB_TITLE_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_ICONS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-icons';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';
import { TimelineActivityWorkspaceEntity } from 'src/modules/timeline/standard-objects/timeline-activity.workspace-entity';

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.jobTitle,
  namePlural: 'jobTitles',
  labelSingular: msg`Job Title`,
  labelPlural: msg`Job Titles`,
  description: msg`A job title in the organization`,
  icon: STANDARD_OBJECT_ICONS.jobTitle,
  labelIdentifierStandardId: JOB_TITLE_STANDARD_FIELD_IDS.title,
})
export class JobTitleWorkspaceEntity extends BaseWorkspaceEntity {
  @WorkspaceField({
    standardId: JOB_TITLE_STANDARD_FIELD_IDS.title,
    type: FieldMetadataType.TEXT,
    label: msg`Title`,
    description: msg`Job title`,
    icon: 'IconBriefcase',
  })
  title: string;

  @WorkspaceField({
    standardId: JOB_TITLE_STANDARD_FIELD_IDS.code,
    type: FieldMetadataType.TEXT,
    label: msg`Code`,
    description: msg`Job title code`,
    icon: 'IconCode',
  })
  code: string;

  @WorkspaceField({
    standardId: JOB_TITLE_STANDARD_FIELD_IDS.position,
    type: FieldMetadataType.POSITION,
    label: msg`Position`,
    description: msg`Job title record position`,
    icon: 'IconHierarchy2',
    defaultValue: 0,
  })
  @WorkspaceIsSystem()
  position: number;

  @WorkspaceField({
    standardId: JOB_TITLE_STANDARD_FIELD_IDS.createdBy,
    type: FieldMetadataType.ACTOR,
    label: msg`Created by`,
    icon: 'IconCreativeCommonsSa',
    description: msg`The creator of the record`,
  })
  @WorkspaceIsFieldUIReadOnly()
  createdBy: ActorMetadata;

  @WorkspaceRelation({
    standardId: JOB_TITLE_STANDARD_FIELD_IDS.timelineActivities,
    type: RelationType.ONE_TO_MANY,
    label: msg`Timeline Activities`,
    description: msg`Timeline Activities linked to the job title.`,
    icon: 'IconTimelineEvent',
    inverseSideTarget: () => TimelineActivityWorkspaceEntity,
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  timelineActivities: Relation<TimelineActivityWorkspaceEntity[]>;
}

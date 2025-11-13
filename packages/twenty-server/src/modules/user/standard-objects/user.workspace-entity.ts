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
import { WorkspaceRelation } from 'src/engine/twenty-orm/decorators/workspace-relation.decorator';
import { APP_USER_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_ICONS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-icons';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';
import {
  type FieldTypeAndNameMetadata,
  getTsVectorColumnExpressionFromFields,
} from 'src/engine/workspace-manager/workspace-sync-metadata/utils/get-ts-vector-column-expression.util';
import { ProjectUserWorkspaceEntity } from 'src/modules/project-user/standard-objects/project-user.workspace-entity';
import { QuotationWorkspaceEntity } from 'src/modules/quotation/standar-objects/quotation.workspace-entity';
import { TimelineActivityWorkspaceEntity } from 'src/modules/timeline/standard-objects/timeline-activity.workspace-entity';

const DISPLAY_NAME_FIELD_NAME = 'displayName';
const MAIL_FIELD_NAME = 'mail';

export const SEARCH_FIELDS_FOR_APP_USERS: FieldTypeAndNameMetadata[] = [
  { name: DISPLAY_NAME_FIELD_NAME, type: FieldMetadataType.TEXT },
  { name: MAIL_FIELD_NAME, type: FieldMetadataType.TEXT },
];

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.appUser,
  namePlural: 'appUsers',
  labelSingular: msg`App User`,
  labelPlural: msg`App Users`,
  description: msg`A user in the system`,
  icon: STANDARD_OBJECT_ICONS.appUser,
  labelIdentifierStandardId: APP_USER_STANDARD_FIELD_IDS.displayName,
})
@WorkspaceIsSearchable()
export class AppUserWorkspaceEntity extends BaseWorkspaceEntity {
  @WorkspaceField({
    standardId: APP_USER_STANDARD_FIELD_IDS.mail,
    type: FieldMetadataType.TEXT,
    label: msg`Email`,
    description: msg`User email`,
    icon: 'IconMail',
  })
  mail: string;

  @WorkspaceField({
    standardId: APP_USER_STANDARD_FIELD_IDS.isActive,
    type: FieldMetadataType.BOOLEAN,
    label: msg`Is Active`,
    description: msg`Whether the user is active`,
    icon: 'IconCheck',
    defaultValue: true,
  })
  isActive: boolean;

  @WorkspaceField({
    standardId: APP_USER_STANDARD_FIELD_IDS.displayName,
    type: FieldMetadataType.TEXT,
    label: msg`Display Name`,
    description: msg`User display name`,
    icon: 'IconUser',
  })
  @WorkspaceIsNullable()
  displayName: string | null;
  @WorkspaceRelation({
    standardId: APP_USER_STANDARD_FIELD_IDS.receivedQuotations,
    type: RelationType.ONE_TO_MANY,
    label: msg`Quotations`,
    description: msg`Quotations provided by this supplier`,
    icon: 'IconQuote',
    inverseSideTarget: () => QuotationWorkspaceEntity,
    inverseSideFieldKey: 'receivedBy',
  })
  receivedQuotations: Relation<QuotationWorkspaceEntity[]>;

  @WorkspaceRelation({
    standardId: APP_USER_STANDARD_FIELD_IDS.approvedQuotations,
    type: RelationType.ONE_TO_MANY,
    label: msg`Quotations`,
    description: msg`Quotations provided by this supplier`,
    icon: 'IconQuote',
    inverseSideTarget: () => QuotationWorkspaceEntity,
    inverseSideFieldKey: 'approvedBy',
  })
  approvedQuotations: Relation<QuotationWorkspaceEntity[]>;

  @WorkspaceRelation({
    standardId: APP_USER_STANDARD_FIELD_IDS.negotiationQuotations,
    type: RelationType.ONE_TO_MANY,
    label: msg`Quotations`,
    description: msg`Quotations provided by this supplier`,
    icon: 'IconQuote',
    inverseSideTarget: () => QuotationWorkspaceEntity,
    inverseSideFieldKey: 'negotiationBy',
  })
  negotiationQuotations: Relation<QuotationWorkspaceEntity[]>;

  @WorkspaceField({
    standardId: APP_USER_STANDARD_FIELD_IDS.position,
    type: FieldMetadataType.POSITION,
    label: msg`Position`,
    description: msg`User record position`,
    icon: 'IconHierarchy2',
    defaultValue: 0,
  })
  @WorkspaceIsSystem()
  position: number;

  @WorkspaceField({
    standardId: APP_USER_STANDARD_FIELD_IDS.createdBy,
    type: FieldMetadataType.ACTOR,
    label: msg`Created by`,
    icon: 'IconCreativeCommonsSa',
    description: msg`The creator of the record`,
  })
  @WorkspaceIsFieldUIReadOnly()
  createdBy: ActorMetadata;

  @WorkspaceRelation({
    standardId: APP_USER_STANDARD_FIELD_IDS.timelineActivities,
    type: RelationType.ONE_TO_MANY,
    label: msg`Timeline Activities`,
    description: msg`Timeline Activities linked to the user.`,
    icon: 'IconTimelineEvent',
    inverseSideTarget: () => TimelineActivityWorkspaceEntity,
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  timelineActivities: Relation<TimelineActivityWorkspaceEntity[]>;

  @WorkspaceRelation({
    standardId: APP_USER_STANDARD_FIELD_IDS.projectUsers,
    type: RelationType.ONE_TO_MANY,
    label: msg`Project Users`,
    description: msg`Project users linked to the user`,
    icon: 'IconUserPlus',
    inverseSideTarget: () => ProjectUserWorkspaceEntity,
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsNullable()
  projectUsers: Relation<ProjectUserWorkspaceEntity[]>;

  @WorkspaceField({
    standardId: APP_USER_STANDARD_FIELD_IDS.searchVector,
    type: FieldMetadataType.TS_VECTOR,
    label: SEARCH_VECTOR_FIELD.label,
    description: SEARCH_VECTOR_FIELD.description,
    icon: 'IconUser',
    generatedType: 'STORED',
    asExpression: getTsVectorColumnExpressionFromFields(
      SEARCH_FIELDS_FOR_APP_USERS,
    ),
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  @WorkspaceFieldIndex({ indexType: IndexType.GIN })
  searchVector: string;
}

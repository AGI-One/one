import { msg } from '@lingui/core/macro';
import { FieldMetadataType, RelationOnDeleteAction } from 'twenty-shared/types';

import { RelationType } from 'src/engine/metadata-modules/field-metadata/interfaces/relation-type.interface';
import { Relation } from 'src/engine/workspace-manager/workspace-sync-metadata/interfaces/relation.interface';

import { SEARCH_VECTOR_FIELD } from 'src/engine/metadata-modules/constants/search-vector-field.constants';
import { ActorMetadata } from 'src/engine/metadata-modules/field-metadata/composite-types/actor.composite-type';
import { EmailsMetadata } from 'src/engine/metadata-modules/field-metadata/composite-types/emails.composite-type';
import { FullNameMetadata } from 'src/engine/metadata-modules/field-metadata/composite-types/full-name.composite-type';
import { LinksMetadata } from 'src/engine/metadata-modules/field-metadata/composite-types/links.composite-type';
import { PhonesMetadata } from 'src/engine/metadata-modules/field-metadata/composite-types/phones.composite-type';
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
import {
  type FieldTypeAndNameMetadata,
  getTsVectorColumnExpressionFromFields,
} from 'src/engine/workspace-manager/workspace-sync-metadata/utils/get-ts-vector-column-expression.util';
import { DepartmentWorkspaceEntity } from 'src/modules/department/standard-objects/department.workspace-entity';
import { EmployeeAwardWorkspaceEntity } from 'src/modules/employee-award/standard-objects/employee-award.workspace-entity';
import { EmployeeLevelWorkspaceEntity } from 'src/modules/employee-level/standard-objects/employee-level.workspace-entity';
import { EmploymentTypeWorkspaceEntity } from 'src/modules/employment-type/standard-objects/employment-type.workspace-entity';
import { OrganizationPositionWorkspaceEntity } from 'src/modules/position/standard-objects/position.workspace-entity';
import { TeamWorkspaceEntity } from 'src/modules/team/standard-objects/team.workspace-entity';
import { TimelineActivityWorkspaceEntity } from 'src/modules/timeline/standard-objects/timeline-activity.workspace-entity';

const NAME_FIELD_NAME = 'name';
const EMAILS_FIELD_NAME = 'emails';
const PHONES_FIELD_NAME = 'phones';
const JOB_TITLE_FIELD_NAME = 'jobTitle';

export const SEARCH_FIELDS_FOR_EMPLOYEE: FieldTypeAndNameMetadata[] = [
  { name: NAME_FIELD_NAME, type: FieldMetadataType.FULL_NAME },
  { name: EMAILS_FIELD_NAME, type: FieldMetadataType.EMAILS },
  { name: PHONES_FIELD_NAME, type: FieldMetadataType.PHONES },
  { name: JOB_TITLE_FIELD_NAME, type: FieldMetadataType.TEXT },
];

@WorkspaceEntity({
  standardId: 'd9eb3cd3-0d19-4d3e-95a0-e1b8c222279b',
  namePlural: 'employees',
  labelSingular: msg`Employee`,
  labelPlural: msg`Employees`,
  description: msg`An employee of the organization`,
  icon: 'IconUser',
  shortcut: 'E',
  labelIdentifierStandardId: '01bb78ac-387b-42f3-b9a2-e54ef14363af',
})
@WorkspaceIsSearchable()
export class EmployeeWorkspaceEntity extends BaseWorkspaceEntity {
  // Basic Information
  @WorkspaceField({
    standardId: '01bb78ac-387b-42f3-b9a2-e54ef14363af',
    type: FieldMetadataType.FULL_NAME,
    label: msg`Full Name`,
    description: msg`Employee's full name`,
    icon: 'IconUser',
  })
  @WorkspaceIsNullable()
  name: FullNameMetadata | null;

  @WorkspaceField({
    standardId: '73423c75-387d-4932-9579-023d4d45ae24',
    type: FieldMetadataType.EMAILS,
    label: msg`Emails`,
    description: msg`Employee's email addresses`,
    icon: 'IconMail',
  })
  emails: EmailsMetadata;

  @WorkspaceField({
    standardId: '336960e0-05a0-4aa0-9aee-8a3dedbb30ee',
    type: FieldMetadataType.PHONES,
    label: msg`Phones`,
    description: msg`Employee's phone numbers`,
    icon: 'IconPhone',
  })
  phones: PhonesMetadata;

  @WorkspaceField({
    standardId: 'dde2410e-0035-4f9b-91e7-712c8299edc9',
    type: FieldMetadataType.TEXT,
    label: msg`Job Title`,
    description: msg`Employee's job title`,
    icon: 'IconBriefcase',
  })
  @WorkspaceIsNullable()
  jobTitle: string | null;

  @WorkspaceField({
    standardId: '957cefcd-c8c9-4b6e-908a-56665954664a',
    type: FieldMetadataType.TEXT,
    label: msg`Short Description`,
    description: msg`Brief description of the employee`,
    icon: 'IconFileText',
  })
  @WorkspaceIsNullable()
  shortDescription: string | null;

  @WorkspaceField({
    standardId: '34e695d4-be1c-4e57-aaf7-4739af789ab2',
    type: FieldMetadataType.TEXT,
    label: msg`Description`,
    description: msg`Detailed description of the employee`,
    icon: 'IconFileDescription',
  })
  @WorkspaceIsNullable()
  description: string | null;

  // Employment Dates
  @WorkspaceField({
    standardId: '2be61b48-538c-475f-9c0e-036e030134c4',
    type: FieldMetadataType.DATE_TIME,
    label: msg`Started Work On`,
    description: msg`Date when employee started working`,
    icon: 'IconCalendar',
  })
  @WorkspaceIsNullable()
  startedWorkOn: string | null;

  @WorkspaceField({
    standardId: 'b256a270-7679-400f-a2fc-6c32559dd7fc',
    type: FieldMetadataType.DATE_TIME,
    label: msg`End Work`,
    description: msg`Date when employee ended work`,
    icon: 'IconCalendar',
  })
  @WorkspaceIsNullable()
  endWork: string | null;

  // Compensation
  @WorkspaceField({
    standardId: '96284f0a-530d-46cf-b07b-8053399becbc',
    type: FieldMetadataType.NUMBER,
    label: msg`Bill Rate Value`,
    description: msg`Employee's billing rate`,
    icon: 'IconCurrencyDollar',
  })
  @WorkspaceIsNullable()
  billRateValue: number | null;

  @WorkspaceField({
    standardId: '6b61213f-cbe7-469e-8548-a36cfc5962b2',
    type: FieldMetadataType.TEXT,
    label: msg`Bill Rate Currency`,
    description: msg`Currency for billing rate`,
    icon: 'IconCurrency',
  })
  @WorkspaceIsNullable()
  billRateCurrency: string | null;

  @WorkspaceField({
    standardId: '469b7a83-d042-45d9-9742-fe3c13905be7',
    type: FieldMetadataType.TEXT,
    label: msg`Pay Period`,
    description: msg`Employee's pay period (weekly, biweekly, monthly)`,
    icon: 'IconCalendarStats',
  })
  @WorkspaceIsNullable()
  payPeriod: string | null;

  // Statistics
  @WorkspaceField({
    standardId: 'ba3d4ea2-ab41-44da-9fd6-c8389740892d',
    type: FieldMetadataType.NUMBER,
    label: msg`Total Work Hours`,
    description: msg`Total hours worked`,
    icon: 'IconClock',
  })
  @WorkspaceIsNullable()
  totalWorkHours: number | null;

  @WorkspaceField({
    standardId: '78ebf4b0-2428-4d32-aafe-554e11efb31e',
    type: FieldMetadataType.NUMBER,
    label: msg`Average Income`,
    description: msg`Average income of the employee`,
    icon: 'IconChartBar',
  })
  @WorkspaceIsNullable()
  averageIncome: number | null;

  @WorkspaceField({
    standardId: '7c7cebed-9b42-4e42-afce-21cfdc92005a',
    type: FieldMetadataType.NUMBER,
    label: msg`Average Bonus`,
    description: msg`Average bonus of the employee`,
    icon: 'IconGift',
  })
  @WorkspaceIsNullable()
  averageBonus: number | null;

  // Social Links
  @WorkspaceField({
    standardId: 'c7ca1c29-757a-41ca-b189-b78eca02a160',
    type: FieldMetadataType.LINKS,
    label: msg`LinkedIn`,
    description: msg`Employee's LinkedIn profile`,
    icon: 'IconBrandLinkedin',
  })
  @WorkspaceIsNullable()
  linkedinLink: LinksMetadata | null;

  @WorkspaceField({
    standardId: '81dbad06-5b0d-4d44-aaa9-b38ed71f8dbc',
    type: FieldMetadataType.LINKS,
    label: msg`GitHub`,
    description: msg`Employee's GitHub profile`,
    icon: 'IconBrandGithub',
  })
  @WorkspaceIsNullable()
  githubLink: LinksMetadata | null;

  @WorkspaceField({
    standardId: '0944ce81-d65c-4441-b0fe-31ce113e73e3',
    type: FieldMetadataType.LINKS,
    label: msg`GitLab`,
    description: msg`Employee's GitLab profile`,
    icon: 'IconBrandGitlab',
  })
  @WorkspaceIsNullable()
  gitlabLink: LinksMetadata | null;

  @WorkspaceField({
    standardId: 'd236b4ff-ce78-4a08-bf63-11cb92e3eab8',
    type: FieldMetadataType.LINKS,
    label: msg`Facebook`,
    description: msg`Employee's Facebook profile`,
    icon: 'IconBrandFacebook',
  })
  @WorkspaceIsNullable()
  facebookLink: LinksMetadata | null;

  @WorkspaceField({
    standardId: 'be8e85f0-805f-4917-ae77-2e4d3b547045',
    type: FieldMetadataType.LINKS,
    label: msg`Twitter/X`,
    description: msg`Employee's Twitter/X profile`,
    icon: 'IconBrandX',
  })
  @WorkspaceIsNullable()
  twitterLink: LinksMetadata | null;

  // Status & Settings
  @WorkspaceField({
    standardId: 'df850f30-47b1-4175-abf6-d424045a752e',
    type: FieldMetadataType.BOOLEAN,
    label: msg`Is Active`,
    description: msg`Whether the employee is currently active`,
    icon: 'IconCheck',
    defaultValue: true,
  })
  isActive: boolean;

  @WorkspaceField({
    standardId: '943aaf8e-437d-4ca4-8917-f85aee31181c',
    type: FieldMetadataType.BOOLEAN,
    label: msg`Time Tracking Enabled`,
    description: msg`Whether time tracking is enabled for this employee`,
    icon: 'IconClock',
    defaultValue: false,
  })
  isTrackingEnabled: boolean;

  @WorkspaceField({
    standardId: 'fe4722e4-1741-4c95-9e3b-c30f55313966',
    type: FieldMetadataType.TEXT,
    label: msg`Avatar URL`,
    description: msg`Employee's avatar image URL`,
    icon: 'IconPhoto',
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  avatarUrl: string | null;

  @WorkspaceField({
    standardId: '7e849780-d1d6-42fe-b71d-f5fb889e8195',
    type: FieldMetadataType.POSITION,
    label: msg`Position`,
    description: msg`Employee record position`,
    icon: 'IconHierarchy2',
    defaultValue: 0,
  })
  @WorkspaceIsSystem()
  position: number;

  @WorkspaceField({
    standardId: '20202020-d001-4001-a001-000000000025',
    type: FieldMetadataType.ACTOR,
    label: msg`Created by`,
    icon: 'IconCreativeCommonsSa',
    description: msg`The creator of the record`,
  })
  @WorkspaceIsFieldUIReadOnly()
  createdBy: ActorMetadata;

  // Relations
  @WorkspaceRelation({
    standardId: '642e44d9-d29a-4a99-9493-69a002396b14',
    type: RelationType.MANY_TO_ONE,
    label: msg`Department`,
    description: msg`Employee's department`,
    icon: 'IconBuilding',
    inverseSideTarget: () => DepartmentWorkspaceEntity,
    inverseSideFieldKey: 'employees',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  department: Relation<DepartmentWorkspaceEntity> | null;

  @WorkspaceJoinColumn('department')
  departmentId: string | null;

  @WorkspaceRelation({
    standardId: '367d3ac2-f76a-45b1-ba78-f8fce8890521',
    type: RelationType.MANY_TO_ONE,
    label: msg`Position`,
    description: msg`Employee's position`,
    icon: 'IconBriefcase',
    inverseSideTarget: () => OrganizationPositionWorkspaceEntity,
    inverseSideFieldKey: 'employees',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  organizationPosition: Relation<OrganizationPositionWorkspaceEntity> | null;

  @WorkspaceJoinColumn('organizationPosition')
  organizationPositionId: string | null;

  @WorkspaceRelation({
    standardId: 'f5d532b0-afcd-4bcb-aecd-a111609a627b',
    type: RelationType.MANY_TO_ONE,
    label: msg`Employment Type`,
    description: msg`Employee's employment type`,
    icon: 'IconFileText',
    inverseSideTarget: () => EmploymentTypeWorkspaceEntity,
    inverseSideFieldKey: 'employees',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  employmentType: Relation<EmploymentTypeWorkspaceEntity> | null;

  @WorkspaceJoinColumn('employmentType')
  employmentTypeId: string | null;

  @WorkspaceRelation({
    standardId: '2fd82431-770a-4039-b639-b8725ac7956d',
    type: RelationType.MANY_TO_ONE,
    label: msg`Employee Level`,
    description: msg`Employee's level`,
    icon: 'IconStairs',
    inverseSideTarget: () => EmployeeLevelWorkspaceEntity,
    inverseSideFieldKey: 'employees',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  level: Relation<EmployeeLevelWorkspaceEntity> | null;

  @WorkspaceJoinColumn('level')
  levelId: string | null;

  @WorkspaceRelation({
    standardId: '2a765e1c-d0aa-4edd-875b-33a202d8a9f5',
    type: RelationType.MANY_TO_ONE,
    label: msg`Team`,
    description: msg`Employee's team`,
    icon: 'IconUsers',
    inverseSideTarget: () => TeamWorkspaceEntity,
    inverseSideFieldKey: 'members',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  team: Relation<TeamWorkspaceEntity> | null;

  @WorkspaceJoinColumn('team')
  teamId: string | null;

  @WorkspaceRelation({
    standardId: '1115b06c-a627-40d6-9012-b6a5b169522a',
    type: RelationType.ONE_TO_MANY,
    label: msg`Awards`,
    description: msg`Awards received by the employee`,
    icon: 'IconAward',
    inverseSideTarget: () => EmployeeAwardWorkspaceEntity,
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsNullable()
  awards: Relation<EmployeeAwardWorkspaceEntity[]>;

  @WorkspaceRelation({
    standardId: 'c2d3e4f5-6a7b-8c9d-0e1f-2a3b4c5d6e7f',
    type: RelationType.ONE_TO_MANY,
    label: msg`Timeline Activities`,
    description: msg`Events linked to the employee`,
    icon: 'IconTimeline',
    inverseSideTarget: () => TimelineActivityWorkspaceEntity,
    inverseSideFieldKey: 'employee',
  })
  @WorkspaceIsNullable()
  timelineActivities: Relation<TimelineActivityWorkspaceEntity[]>;

  @WorkspaceField({
    standardId: '79940b12-d808-49c0-a3ad-e2d364dbc78b',
    type: FieldMetadataType.TS_VECTOR,
    label: SEARCH_VECTOR_FIELD.label,
    description: SEARCH_VECTOR_FIELD.description,
    icon: 'IconUser',
    generatedType: 'STORED',
    asExpression: getTsVectorColumnExpressionFromFields(
      SEARCH_FIELDS_FOR_EMPLOYEE,
    ),
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  @WorkspaceFieldIndex({ indexType: IndexType.GIN })
  searchVector: string;
}

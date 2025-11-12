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
import { PROJECT_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_ICONS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-icons';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';
import {
  type FieldTypeAndNameMetadata,
  getTsVectorColumnExpressionFromFields,
} from 'src/engine/workspace-manager/workspace-sync-metadata/utils/get-ts-vector-column-expression.util';
import { BoQWorkspaceEntity } from 'src/modules/boq/standard-objects/boq.workspace-entity';
import { MaterialApprovalWorkspaceEntity } from 'src/modules/material-approval/standard-objects/material-approval.workspace-entity';
import { MaterialOrderWorkspaceEntity } from 'src/modules/material-order/standard-objects/material-order.workspace-entity';
import { MaterialPurchaseRequestWorkspaceEntity } from 'src/modules/material-purchase-request/standard-objects/material-purchase-request.workspace-entity';
import { MaterialRequestWorkspaceEntity } from 'src/modules/material-request/standard-objects/material-request.workspace-entity';
import { PriceContractWorkspaceEntity } from 'src/modules/price-contract/standard-objects/price-contract.workspace-entity';
import { ProjectUserWorkspaceEntity } from 'src/modules/project-user/standard-objects/project-user.workspace-entity';
import { QuotationWorkspaceEntity } from 'src/modules/quotation/standar-objects/quotation.workspace-entity';
import { TimelineActivityWorkspaceEntity } from 'src/modules/timeline/standard-objects/timeline-activity.workspace-entity';

const PROJECT_CODE_FIELD_NAME = 'projectCode';
const PROJECT_NAME_FIELD_NAME = 'projectName';
const PROJECT_OWNER_NAME_FIELD_NAME = 'projectOwnerName';
const CONTRACT_NUMBER_FIELD_NAME = 'contractNumber';

export const SEARCH_FIELDS_FOR_PROJECTS: FieldTypeAndNameMetadata[] = [
  { name: PROJECT_CODE_FIELD_NAME, type: FieldMetadataType.TEXT },
  { name: PROJECT_NAME_FIELD_NAME, type: FieldMetadataType.TEXT },
  { name: PROJECT_OWNER_NAME_FIELD_NAME, type: FieldMetadataType.TEXT },
  { name: CONTRACT_NUMBER_FIELD_NAME, type: FieldMetadataType.TEXT },
];

export enum ProjectStatus {
  PREPARING_BID = 'preparing_bid',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ON_HOLD = 'on_hold',
  CANCELLED = 'cancelled',
}

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.project,
  namePlural: 'projects',
  labelSingular: msg`Project`,
  labelPlural: msg`Projects`,
  description: msg`PCU Project entity for construction projects`,
  icon: STANDARD_OBJECT_ICONS.project,
  labelIdentifierStandardId: PROJECT_STANDARD_FIELD_IDS.projectName,
})
@WorkspaceIsSearchable()
export class ProjectWorkspaceEntity extends BaseWorkspaceEntity {
  @WorkspaceField({
    standardId: PROJECT_STANDARD_FIELD_IDS.projectCode,
    type: FieldMetadataType.TEXT,
    label: msg`Project Code`,
    description: msg`Unique project code`,
    icon: 'IconCode',
  })
  projectCode: string;

  @WorkspaceField({
    standardId: PROJECT_STANDARD_FIELD_IDS.projectName,
    type: FieldMetadataType.TEXT,
    label: msg`Project Name`,
    description: msg`Name of the project`,
    icon: 'IconBriefcase',
  })
  @WorkspaceIsNullable()
  projectName: string | null;

  @WorkspaceField({
    standardId: PROJECT_STANDARD_FIELD_IDS.projectOwnerGroup,
    type: FieldMetadataType.TEXT,
    label: msg`Project Owner Group`,
    description: msg`Project owner organization group`,
    icon: 'IconBuildingCommunity',
  })
  @WorkspaceIsNullable()
  projectOwnerGroup: string | null;

  @WorkspaceField({
    standardId: PROJECT_STANDARD_FIELD_IDS.projectOwnerName,
    type: FieldMetadataType.TEXT,
    label: msg`Project Owner Name`,
    description: msg`Name of project owner`,
    icon: 'IconUserCircle',
  })
  @WorkspaceIsNullable()
  projectOwnerName: string | null;

  @WorkspaceField({
    standardId: PROJECT_STANDARD_FIELD_IDS.contractNumber,
    type: FieldMetadataType.TEXT,
    label: msg`Contract Number`,
    description: msg`Contract reference number`,
    icon: 'IconFileContract',
  })
  @WorkspaceIsNullable()
  contractNumber: string | null;

  @WorkspaceField({
    standardId: PROJECT_STANDARD_FIELD_IDS.contractDate,
    type: FieldMetadataType.DATE_TIME,
    label: msg`Contract Date`,
    description: msg`Date when contract was signed`,
    icon: 'IconCalendar',
  })
  @WorkspaceIsNullable()
  contractDate: Date | null;

  @WorkspaceField({
    standardId: PROJECT_STANDARD_FIELD_IDS.contractFileId,
    type: FieldMetadataType.TEXT,
    label: msg`Contract File ID`,
    description: msg`ID reference to contract file`,
    icon: 'IconFileText',
  })
  @WorkspaceIsNullable()
  contractFileId: string | null;

  @WorkspaceField({
    standardId: PROJECT_STANDARD_FIELD_IDS.startDate,
    type: FieldMetadataType.DATE_TIME,
    label: msg`Start Date`,
    description: msg`Project start date`,
    icon: 'IconCalendarEvent',
  })
  @WorkspaceIsNullable()
  startDate: Date | null;

  @WorkspaceField({
    standardId: PROJECT_STANDARD_FIELD_IDS.endDate,
    type: FieldMetadataType.DATE_TIME,
    label: msg`End Date`,
    description: msg`Project completion date`,
    icon: 'IconCalendarX',
  })
  @WorkspaceIsNullable()
  endDate: Date | null;

  @WorkspaceField({
    standardId: PROJECT_STANDARD_FIELD_IDS.commanderEmail,
    type: FieldMetadataType.TEXT,
    label: msg`Commander Email`,
    description: msg`Email of project commander`,
    icon: 'IconMail',
  })
  @WorkspaceIsNullable()
  commanderEmail: string | null;

  @WorkspaceField({
    standardId: PROJECT_STANDARD_FIELD_IDS.supplyManagerEmail,
    type: FieldMetadataType.TEXT,
    label: msg`Supply Manager Email`,
    description: msg`Email of supply manager`,
    icon: 'IconMailCheck',
  })
  @WorkspaceIsNullable()
  supplyManagerEmail: string | null;

  @WorkspaceField({
    standardId: PROJECT_STANDARD_FIELD_IDS.status,
    type: FieldMetadataType.SELECT,
    label: msg`Status`,
    description: msg`Current project status`,
    icon: 'IconProgressCheck',
    options: [
      {
        value: ProjectStatus.PREPARING_BID,
        label: 'Preparing Bid',
        position: 0,
        color: 'blue',
      },
      {
        value: ProjectStatus.IN_PROGRESS,
        label: 'In Progress',
        position: 1,
        color: 'green',
      },
      {
        value: ProjectStatus.COMPLETED,
        label: 'Completed',
        position: 2,
        color: 'gray',
      },
      {
        value: ProjectStatus.ON_HOLD,
        label: 'On Hold',
        position: 3,
        color: 'orange',
      },
      {
        value: ProjectStatus.CANCELLED,
        label: 'Cancelled',
        position: 4,
        color: 'red',
      },
    ],
    defaultValue: `'${ProjectStatus.PREPARING_BID}'`,
  })
  status: ProjectStatus;
  @WorkspaceRelation({
    standardId: PROJECT_STANDARD_FIELD_IDS.quotations,
    type: RelationType.ONE_TO_MANY,
    label: msg`Quotations`,
    description: msg`Quotations associated with the project`,
    icon: 'IconQuote',
    inverseSideTarget: () => QuotationWorkspaceEntity,
    inverseSideFieldKey: 'project',
  })
  quotations: Relation<QuotationWorkspaceEntity[]>;
  // System fields
  @WorkspaceField({
    standardId: PROJECT_STANDARD_FIELD_IDS.position,
    type: FieldMetadataType.POSITION,
    label: msg`Position`,
    description: msg`Project record position`,
    icon: 'IconHierarchy2',
    defaultValue: 0,
  })
  @WorkspaceIsSystem()
  position: number;

  @WorkspaceField({
    standardId: PROJECT_STANDARD_FIELD_IDS.createdBy,
    type: FieldMetadataType.ACTOR,
    label: msg`Created by`,
    icon: 'IconCreativeCommonsSa',
    description: msg`The creator of the record`,
  })
  @WorkspaceIsFieldUIReadOnly()
  createdBy: ActorMetadata;

  @WorkspaceRelation({
    standardId: PROJECT_STANDARD_FIELD_IDS.priceContracts,
    type: RelationType.ONE_TO_MANY,
    label: msg`Price Contracts`,
    description: msg`Price contracts for this project`,
    icon: 'IconFileContract',
    inverseSideTarget: () => PriceContractWorkspaceEntity,
    inverseSideFieldKey: 'project',
  })
  @WorkspaceIsNullable()
  priceContracts: Relation<PriceContractWorkspaceEntity[]>;

  @WorkspaceRelation({
    standardId: PROJECT_STANDARD_FIELD_IDS.materialRequests,
    type: RelationType.ONE_TO_MANY,
    label: msg`Material Requests`,
    description: msg`Material requests for this project`,
    icon: 'IconFileText',
    inverseSideTarget: () => MaterialRequestWorkspaceEntity,
    inverseSideFieldKey: 'project',
  })
  @WorkspaceIsNullable()
  materialRequests: Relation<MaterialRequestWorkspaceEntity[]>;

  @WorkspaceRelation({
    standardId: PROJECT_STANDARD_FIELD_IDS.materialApprovals,
    type: RelationType.ONE_TO_MANY,
    label: msg`Material Approvals`,
    description: msg`Material approvals for this project`,
    icon: 'IconCircleCheck',
    inverseSideTarget: () => MaterialApprovalWorkspaceEntity,
    inverseSideFieldKey: 'project',
  })
  @WorkspaceIsNullable()
  materialApprovals: Relation<MaterialApprovalWorkspaceEntity[]>;

  @WorkspaceRelation({
    standardId: PROJECT_STANDARD_FIELD_IDS.boqs,
    type: RelationType.ONE_TO_MANY,
    label: msg`BoQs`,
    description: msg`Bills of quantities for this project`,
    icon: 'IconListNumbers',
    inverseSideTarget: () => BoQWorkspaceEntity,
    inverseSideFieldKey: 'project',
  })
  @WorkspaceIsNullable()
  boqs: Relation<BoQWorkspaceEntity[]>;

  // Timeline relation
  @WorkspaceRelation({
    standardId: PROJECT_STANDARD_FIELD_IDS.timelineActivities,
    type: RelationType.ONE_TO_MANY,
    label: msg`Timeline Activities`,
    description: msg`Timeline Activities linked to the project.`,
    icon: 'IconTimelineEvent',
    inverseSideTarget: () => TimelineActivityWorkspaceEntity,
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  timelineActivities: Relation<TimelineActivityWorkspaceEntity[]>;

  @WorkspaceRelation({
    standardId: PROJECT_STANDARD_FIELD_IDS.materialPurchaseRequests,
    type: RelationType.ONE_TO_MANY,
    label: msg`Purchase Requests`,
    description: msg`Material purchase requests for this project`,
    icon: 'IconShoppingCart',
    inverseSideTarget: () => MaterialPurchaseRequestWorkspaceEntity,
    inverseSideFieldKey: 'project',
  })
  materialPurchaseRequests: Relation<MaterialPurchaseRequestWorkspaceEntity[]>;

  @WorkspaceRelation({
    standardId: PROJECT_STANDARD_FIELD_IDS.materialOrders,
    type: RelationType.ONE_TO_MANY,
    label: msg`Material Orders`,
    description: msg`Material orders for this project`,
    icon: 'IconFileInvoice',
    inverseSideTarget: () => MaterialOrderWorkspaceEntity,
    inverseSideFieldKey: 'project',
  })
  materialOrders: Relation<MaterialOrderWorkspaceEntity[]>;

  // Project Users relation
  @WorkspaceRelation({
    standardId: PROJECT_STANDARD_FIELD_IDS.projectUsers,
    type: RelationType.ONE_TO_MANY,
    label: msg`Project Users`,
    description: msg`Users assigned to this project`,
    icon: 'IconUserPlus',
    inverseSideTarget: () => ProjectUserWorkspaceEntity,
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsNullable()
  projectUsers: Relation<ProjectUserWorkspaceEntity[]>;

  @WorkspaceField({
    standardId: PROJECT_STANDARD_FIELD_IDS.searchVector,
    type: FieldMetadataType.TS_VECTOR,
    label: SEARCH_VECTOR_FIELD.label,
    description: SEARCH_VECTOR_FIELD.description,
    icon: 'IconUser',
    generatedType: 'STORED',
    asExpression: getTsVectorColumnExpressionFromFields(
      SEARCH_FIELDS_FOR_PROJECTS,
    ),
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  @WorkspaceFieldIndex({ indexType: IndexType.GIN })
  searchVector: string;
}

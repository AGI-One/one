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
import { QUOTATION_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_ICONS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-icons';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';
import {
  type FieldTypeAndNameMetadata,
  getTsVectorColumnExpressionFromFields,
} from 'src/engine/workspace-manager/workspace-sync-metadata/utils/get-ts-vector-column-expression.util';
// Import related entities
import { WorkspaceJoinColumn } from 'src/engine/twenty-orm/decorators/workspace-join-column.decorator';
import { ProjectWorkspaceEntity } from 'src/modules/project/standard-objects/project.workspace-entity';
import { QuotationItemWorkspaceEntity } from 'src/modules/quotation-item/standard-objects/quotation-item.workspace-entity';
import { SupplierWorkspaceEntity } from 'src/modules/supplier/standard-objects/supplier.workspace-entity';
import { TimelineActivityWorkspaceEntity } from 'src/modules/timeline/standard-objects/timeline-activity.workspace-entity';
import { AppUserWorkspaceEntity } from 'src/modules/user/standard-objects/user.workspace-entity';

enum QuotationStatus {
  RECEIVED = 'received',
  UNDER_REVIEW = 'under_review',
  NEGOTIATING = 'negotiating',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

// Search fields definition
const QUOTATION_CODE_FIELD_NAME = 'quotationCode';
const QUOTATION_NAME_FIELD_NAME = 'quotationName';

export const SEARCH_FIELDS_FOR_QUOTATION: FieldTypeAndNameMetadata[] = [
  { name: QUOTATION_CODE_FIELD_NAME, type: FieldMetadataType.TEXT },
  { name: QUOTATION_NAME_FIELD_NAME, type: FieldMetadataType.TEXT },
];

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.quotation,
  namePlural: 'quotations',
  labelSingular: msg`Quotation`,
  labelPlural: msg`Quotations`,
  description: msg`Quotation management`,
  icon: STANDARD_OBJECT_ICONS.quotation,
  shortcut: 'T',
  labelIdentifierStandardId: QUOTATION_STANDARD_FIELD_IDS.quotationName,
})
@WorkspaceIsSearchable()
export class QuotationWorkspaceEntity extends BaseWorkspaceEntity {
  // Core Business Fields
  @WorkspaceField({
    standardId: QUOTATION_STANDARD_FIELD_IDS.quotationCode,
    type: FieldMetadataType.TEXT,
    label: msg`Quotation Code`,
    description: msg`Unique identifier for the quotation`,
    icon: 'IconCode',
  })
  quotationCode: string;

  @WorkspaceField({
    standardId: QUOTATION_STANDARD_FIELD_IDS.quotationName,
    type: FieldMetadataType.TEXT,
    label: msg`Quotation Name`,
    description: msg`Name of the quotation`,
    icon: 'IconBox',
  })
  quotationName: string;

  @WorkspaceField({
    standardId: QUOTATION_STANDARD_FIELD_IDS.supplierQuotationRef,
    type: FieldMetadataType.TEXT,
    label: msg`Supplier Quotation Reference`,
    description: msg`Reference to the supplier's quotation`,
    icon: 'IconBox',
  })
  supplierQuotationRef: string;

  @WorkspaceRelation({
    standardId: QUOTATION_STANDARD_FIELD_IDS.supplier,
    type: RelationType.MANY_TO_ONE,
    label: msg`Supplier`,
    description: msg`Supplier that this quotation belongs to`,
    icon: 'IconUser',
    inverseSideTarget: () => SupplierWorkspaceEntity,
    inverseSideFieldKey: 'quotations',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  supplier: Relation<SupplierWorkspaceEntity> | null;

  @WorkspaceJoinColumn('supplier')
  supplierId: string | null;

  @WorkspaceRelation({
    standardId: QUOTATION_STANDARD_FIELD_IDS.project,
    type: RelationType.MANY_TO_ONE,
    label: msg`Project`,
    description: msg`Project that this quotation belongs to`,
    icon: 'IconCategory2',
    inverseSideTarget: () => ProjectWorkspaceEntity,
    inverseSideFieldKey: 'quotations',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  project: Relation<ProjectWorkspaceEntity> | null;

  @WorkspaceJoinColumn('project')
  projectId: string | null;

  // quotation date DATE_TIME
  @WorkspaceField({
    standardId: QUOTATION_STANDARD_FIELD_IDS.quotationDate,
    type: FieldMetadataType.DATE_TIME,
    label: msg`Quotation Date`,
    description: msg`Date of the quotation`,
    icon: 'IconCalendar',
  })
  @WorkspaceIsNullable()
  quotationDate: Date | null;

  // valid until DATE_TIME
  @WorkspaceField({
    standardId: QUOTATION_STANDARD_FIELD_IDS.validUntil,
    type: FieldMetadataType.DATE_TIME,
    label: msg`Valid Until`,
    description: msg`Validity date of the quotation`,
    icon: 'IconCalendarEvent',
  })
  @WorkspaceIsNullable()
  validUntil: Date | null;

  // total amount NUMBER
  @WorkspaceField({
    standardId: QUOTATION_STANDARD_FIELD_IDS.totalAmount,
    type: FieldMetadataType.NUMBER,
    label: msg`Total Amount`,
    description: msg`Total amount of the quotation`,
    icon: 'IconCurrencyDollar',
  })
  @WorkspaceIsNullable()
  totalAmount: number | null;

  // delivery fee NUMBER
  @WorkspaceField({
    standardId: QUOTATION_STANDARD_FIELD_IDS.deliveryFee,
    type: FieldMetadataType.NUMBER,
    label: msg`Delivery Fee`,
    description: msg`Delivery fee for the quotation`,
    icon: 'IconTruckDelivery',
  })
  @WorkspaceIsNullable()
  deliveryFee: number | null;

  // currency TEXT
  @WorkspaceField({
    standardId: QUOTATION_STANDARD_FIELD_IDS.currency,
    type: FieldMetadataType.TEXT,
    label: msg`Currency`,
    description: msg`Currency of the quotation`,
    icon: 'IconCurrencyDollar',
  })
  @WorkspaceIsNullable()
  currency: string | null;

  // status SELECT
  @WorkspaceField({
    standardId: QUOTATION_STANDARD_FIELD_IDS.status,
    type: FieldMetadataType.SELECT,
    label: msg`Status`,
    description: msg`Status of the quotation`,
    icon: 'IconInfoCircle',
    options: [
      {
        value: QuotationStatus.RECEIVED,
        position: 0,
        color: 'green',
        label: `Received`,
      },
      {
        value: QuotationStatus.UNDER_REVIEW,
        position: 1,
        color: 'yellow',
        label: `Under Review`,
      },
      {
        value: QuotationStatus.NEGOTIATING,
        position: 2,
        color: 'orange',
        label: `Negotiating`,
      },
      {
        value: QuotationStatus.APPROVED,
        position: 3,
        color: 'blue',
        label: `Approved`,
      },
      {
        value: QuotationStatus.REJECTED,
        position: 4,
        color: 'red',
        label: `Rejected`,
      },
      {
        value: QuotationStatus.EXPIRED,
        position: 5,
        color: 'gray',
        label: `Expired`,
      },
    ],
    defaultValue: `'${QuotationStatus.RECEIVED}'`,
  })
  status: string;

  // terms and conditions LONG_TEXT
  @WorkspaceField({
    standardId: QUOTATION_STANDARD_FIELD_IDS.termsAndConditions,
    type: FieldMetadataType.TEXT,
    label: msg`Terms and Conditions`,
    description: msg`Terms and conditions of the quotation`,
    icon: 'IconFileText',
  })
  @WorkspaceIsNullable()
  termsAndConditions: string | null;

  // note TEXT
  @WorkspaceField({
    standardId: QUOTATION_STANDARD_FIELD_IDS.note,
    type: FieldMetadataType.TEXT,
    label: msg`Note`,
    description: msg`Additional notes for the quotation`,
    icon: 'IconNotes',
  })
  @WorkspaceIsNullable()
  note: string | null;

  // received date DATE_TIME
  @WorkspaceField({
    standardId: QUOTATION_STANDARD_FIELD_IDS.receivedDate,
    type: FieldMetadataType.DATE_TIME,
    label: msg`Received Date`,
    description: msg`Date when the quotation was received`,
    icon: 'IconInbox',
  })
  @WorkspaceIsNullable()
  receivedDate: Date | null;

  // received by ACTOR
  @WorkspaceRelation({
    standardId: QUOTATION_STANDARD_FIELD_IDS.receivedBy,
    type: RelationType.MANY_TO_ONE,
    label: msg`Received By`,
    icon: 'IconUserCheck',
    description: msg`Person who received the quotation`,
    inverseSideTarget: () => AppUserWorkspaceEntity,
    inverseSideFieldKey: 'receivedQuotations',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  receivedBy: Relation<AppUserWorkspaceEntity> | null;

  @WorkspaceJoinColumn('receivedBy')
  receivedById: string | null;

  // approval date DATE_TIME
  @WorkspaceField({
    standardId: QUOTATION_STANDARD_FIELD_IDS.approvalDate,
    type: FieldMetadataType.DATE_TIME,
    label: msg`Approval Date`,
    description: msg`Date when the quotation was approved`,
    icon: 'IconCheck',
  })
  @WorkspaceIsNullable()
  approvalDate: Date | null;

  // approved by ACTOR

  @WorkspaceRelation({
    standardId: QUOTATION_STANDARD_FIELD_IDS.approvedBy,
    type: RelationType.MANY_TO_ONE,
    label: msg`Approved By`,
    icon: 'IconUserCheck',
    description: msg`Person who approved the quotation`,
    inverseSideTarget: () => AppUserWorkspaceEntity,
    inverseSideFieldKey: 'approvedQuotations',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  approvedBy: Relation<AppUserWorkspaceEntity> | null;

  @WorkspaceJoinColumn('approvedBy')
  approvedById: string | null;

  // approval note TEXT
  @WorkspaceField({
    standardId: QUOTATION_STANDARD_FIELD_IDS.approvalNote,
    type: FieldMetadataType.TEXT,
    label: msg`Approval Note`,
    description: msg`Note regarding the approval of the quotation`,
    icon: 'IconNotes',
  })
  @WorkspaceIsNullable()
  approvalNote: string | null;

  // negotiation note TEXT
  @WorkspaceField({
    standardId: QUOTATION_STANDARD_FIELD_IDS.negotiationNote,
    type: FieldMetadataType.TEXT,
    label: msg`Negotiation Note`,
    description: msg`Note regarding the negotiation of the quotation`,
    icon: 'IconNotes',
  })
  @WorkspaceIsNullable()
  negotiationNote: string | null;

  // negotiation by ACTOR
  @WorkspaceRelation({
    standardId: QUOTATION_STANDARD_FIELD_IDS.negotiationBy,
    type: RelationType.MANY_TO_ONE,
    label: msg`Negotiated By`,
    icon: 'IconUserCheck',
    description: msg`Person who negotiated the quotation`,
    inverseSideTarget: () => AppUserWorkspaceEntity,
    inverseSideFieldKey: 'negotiationQuotations',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  negotiationBy: Relation<AppUserWorkspaceEntity> | null;

  @WorkspaceJoinColumn('negotiationBy')
  negotiationById: string | null;

  // negotiation date DATE_TIME
  @WorkspaceField({
    standardId: QUOTATION_STANDARD_FIELD_IDS.negotiationDate,
    type: FieldMetadataType.DATE_TIME,
    label: msg`Negotiation Date`,
    description: msg`Date when the quotation was negotiated`,
    icon: 'IconHandshake',
  })
  @WorkspaceIsNullable()
  negotiationDate: Date | null;

  // revision count NUMBER
  @WorkspaceField({
    standardId: QUOTATION_STANDARD_FIELD_IDS.revisionCount,
    type: FieldMetadataType.NUMBER,
    label: msg`Revision Count`,
    description: msg`Number of revisions for the quotation`,
    icon: 'IconRefresh',
  })
  @WorkspaceIsNullable()
  revisionCount: number | null;

  // selection note TEXT
  @WorkspaceField({
    standardId: QUOTATION_STANDARD_FIELD_IDS.selectionNote,
    type: FieldMetadataType.TEXT,
    label: msg`Selection Note`,
    description: msg`Note regarding the selection of the quotation`,
    icon: 'IconNotes',
  })
  @WorkspaceIsNullable()
  selectionNote: string | null;

  // delivery time TEXT
  @WorkspaceField({
    standardId: QUOTATION_STANDARD_FIELD_IDS.deliveryTime,
    type: FieldMetadataType.TEXT,
    label: msg`Delivery Time`,
    description: msg`Delivery time for the quotation`,
    icon: 'IconClock',
  })
  @WorkspaceIsNullable()
  deliveryTime: string | null;

  // payment terms LONG_TEXT
  @WorkspaceField({
    standardId: QUOTATION_STANDARD_FIELD_IDS.paymentTerms,
    type: FieldMetadataType.TEXT,
    label: msg`Payment Terms`,
    description: msg`Payment terms for the quotation`,
    icon: 'IconFileDollar',
  })
  @WorkspaceIsNullable()
  paymentTerms: string | null;

  // warranty period TEXT
  @WorkspaceField({
    standardId: QUOTATION_STANDARD_FIELD_IDS.warrantyPeriod,
    type: FieldMetadataType.TEXT,
    label: msg`Warranty Period`,
    description: msg`Warranty period for the quotation`,
    icon: 'IconShieldCheck',
  })
  @WorkspaceIsNullable()
  warrantyPeriod: string | null;

  // file id LONG_TEXT
  @WorkspaceField({
    standardId: QUOTATION_STANDARD_FIELD_IDS.fileId,
    type: FieldMetadataType.TEXT,
    label: msg`File IDs`,
    description: msg`IDs of files associated with the quotation`,
    icon: 'IconPaperclip',
  })
  @WorkspaceIsNullable()
  fileId: string | null;

  // System Fields
  @WorkspaceField({
    standardId: QUOTATION_STANDARD_FIELD_IDS.position,
    type: FieldMetadataType.POSITION,
    label: msg`Position`,
    description: msg`Position`,
    icon: 'IconHierarchy2',
  })
  @WorkspaceIsSystem()
  @WorkspaceIsNullable()
  position: number | null;

  @WorkspaceField({
    standardId: QUOTATION_STANDARD_FIELD_IDS.createdBy,
    type: FieldMetadataType.ACTOR,
    label: msg`Created by`,
    icon: 'IconCreativeCommonsSa',
    description: msg`The creator of the record`,
  })
  @WorkspaceIsSystem()
  @WorkspaceIsNullable()
  @WorkspaceIsFieldUIReadOnly()
  createdBy: ActorMetadata | null;

  @WorkspaceRelation({
    standardId: QUOTATION_STANDARD_FIELD_IDS.quotationItems,
    type: RelationType.ONE_TO_MANY,
    label: msg`Quotation Items`,
    description: msg`Items in this quotation`,
    icon: 'IconListDetails',
    inverseSideTarget: () => QuotationItemWorkspaceEntity,
    inverseSideFieldKey: 'quotation',
  })
  @WorkspaceIsNullable()
  quotationItems: Relation<QuotationItemWorkspaceEntity[]>;

  @WorkspaceRelation({
    standardId: QUOTATION_STANDARD_FIELD_IDS.timelineActivities,
    type: RelationType.ONE_TO_MANY,
    label: msg`Timeline Activities`,
    description: msg`Timeline Activities linked to the quotation`,
    icon: 'IconTimelineEvent',
    inverseSideTarget: () => TimelineActivityWorkspaceEntity,
    inverseSideFieldKey: 'quotation',
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  timelineActivities: Relation<TimelineActivityWorkspaceEntity[]>;

  @WorkspaceField({
    standardId: QUOTATION_STANDARD_FIELD_IDS.searchVector,
    type: FieldMetadataType.TS_VECTOR,
    label: SEARCH_VECTOR_FIELD.label,
    description: SEARCH_VECTOR_FIELD.description,
    icon: 'IconSearch',
    generatedType: 'STORED',
    asExpression: getTsVectorColumnExpressionFromFields(
      SEARCH_FIELDS_FOR_QUOTATION,
    ),
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  @WorkspaceFieldIndex({ indexType: IndexType.GIN })
  searchVector: string;
}

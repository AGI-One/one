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
import { MATERIAL_ORDER_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_ICONS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-icons';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';
import {
  type FieldTypeAndNameMetadata,
  getTsVectorColumnExpressionFromFields,
} from 'src/engine/workspace-manager/workspace-sync-metadata/utils/get-ts-vector-column-expression.util';
// Import related entities
import { WorkspaceJoinColumn } from 'src/engine/twenty-orm/decorators/workspace-join-column.decorator';
import { ProjectWorkspaceEntity } from 'src/modules/project/standard-objects/project.workspace-entity';
import { SupplierWorkspaceEntity } from 'src/modules/supplier/standard-objects/supplier.workspace-entity';
import { TimelineActivityWorkspaceEntity } from 'src/modules/timeline/standard-objects/timeline-activity.workspace-entity';

// MaterialPurchaseRequest, CommentOrder, OrderFollower will be added later

enum MaterialOrderApprovalStatus {
  PENDING = 'pending',
  COMMANDER_APPROVED = 'commander_approved',
  QC_APPROVED = 'qc_approved',
  SUPPLIER_APPROVED = 'supplier_approved',
  DIRECTOR_APPROVED = 'director_approved',
  SUPPLIER_STAFF_APPROVED = 'supplier_staff_approved',
  PAID = 'paid',
  RECEIVED = 'received',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

enum NextApprover {
  COMMANDER = 'commander',
  QC = 'qc',
  SUPPLIER = 'supplier',
  DIRECTOR = 'director',
  SUPPLIER_STAFF = 'supplier_staff',
}

// Search fields definition
const ORDER_NAME_FIELD_NAME = 'orderName';
const NOTE_FIELD_NAME = 'note';
const APPROVAL_NOTE_FIELD_NAME = 'approvalNote';

export const SEARCH_FIELDS_FOR_MATERIAL_ORDER: FieldTypeAndNameMetadata[] = [
  { name: ORDER_NAME_FIELD_NAME, type: FieldMetadataType.TEXT },
  { name: NOTE_FIELD_NAME, type: FieldMetadataType.TEXT },
  { name: APPROVAL_NOTE_FIELD_NAME, type: FieldMetadataType.TEXT },
];

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.materialOrder,
  namePlural: 'materialOrders',
  labelSingular: msg`Material Order`,
  labelPlural: msg`Material Orders`,
  description: msg`Material order management`,
  icon: STANDARD_OBJECT_ICONS.materialOrder,
  labelIdentifierStandardId: MATERIAL_ORDER_STANDARD_FIELD_IDS.orderName,
})
@WorkspaceIsSearchable()
export class MaterialOrderWorkspaceEntity extends BaseWorkspaceEntity {
  // Basic Information
  @WorkspaceField({
    standardId: MATERIAL_ORDER_STANDARD_FIELD_IDS.orderCode,
    type: FieldMetadataType.TEXT,
    label: msg`Order Code`,
    description: msg`Code of the material order`,
    icon: 'IconTag',
  })
  @WorkspaceIsNullable()
  orderCode: string | null;

  @WorkspaceField({
    standardId: MATERIAL_ORDER_STANDARD_FIELD_IDS.orderName,
    type: FieldMetadataType.TEXT,
    label: msg`Order Name`,
    description: msg`Name of the material order`,
    icon: 'IconTag',
  })
  @WorkspaceIsNullable()
  orderName: string | null;

  // Approval Workflow
  @WorkspaceField({
    standardId: MATERIAL_ORDER_STANDARD_FIELD_IDS.nextApprover,
    type: FieldMetadataType.SELECT,
    label: msg`Next Approver`,
    description: msg`Next person to approve this order`,
    icon: 'IconUserCheck',
    options: [
      {
        value: NextApprover.COMMANDER,
        position: 0,
        color: 'blue',
        label: 'Commander',
      },
      {
        value: NextApprover.QC,
        position: 1,
        color: 'purple',
        label: 'QC',
      },
      {
        value: NextApprover.SUPPLIER,
        position: 2,
        color: 'orange',
        label: 'Supplier',
      },
      {
        value: NextApprover.DIRECTOR,
        position: 3,
        color: 'red',
        label: 'Director',
      },
      {
        value: NextApprover.SUPPLIER_STAFF,
        position: 4,
        color: 'green',
        label: 'Supplier Staff',
      },
    ],
  })
  @WorkspaceIsNullable()
  nextApprover: NextApprover | null;

  // Relations - Supplier
  @WorkspaceRelation({
    standardId: MATERIAL_ORDER_STANDARD_FIELD_IDS.supplier,
    type: RelationType.MANY_TO_ONE,
    label: msg`Supplier`,
    description: msg`Supplier for this order`,
    icon: 'IconTruck',
    inverseSideTarget: () => SupplierWorkspaceEntity,
    inverseSideFieldKey: 'materialOrders',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  supplier: Relation<SupplierWorkspaceEntity> | null;

  @WorkspaceJoinColumn('supplier')
  supplierId: string | null;

  // Relations - Project
  @WorkspaceRelation({
    standardId: MATERIAL_ORDER_STANDARD_FIELD_IDS.project,
    type: RelationType.MANY_TO_ONE,
    label: msg`Project`,
    description: msg`Project related to this order`,
    icon: 'IconBriefcase',
    inverseSideTarget: () => ProjectWorkspaceEntity,
    inverseSideFieldKey: 'materialOrders',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsNullable()
  project: Relation<ProjectWorkspaceEntity> | null;

  @WorkspaceJoinColumn('project')
  projectId: string | null;

  // Priority & Status
  @WorkspaceField({
    standardId: MATERIAL_ORDER_STANDARD_FIELD_IDS.priority,
    type: FieldMetadataType.SELECT,
    label: msg`Priority`,
    description: msg`Priority level`,
    icon: 'IconFlag',
    options: [
      {
        value: Priority.LOW,
        position: 0,
        color: 'gray',
        label: 'Low',
      },
      {
        value: Priority.MEDIUM,
        position: 1,
        color: 'blue',
        label: 'Medium',
      },
      {
        value: Priority.HIGH,
        position: 2,
        color: 'orange',
        label: 'High',
      },
      {
        value: Priority.URGENT,
        position: 3,
        color: 'red',
        label: 'Urgent',
      },
    ],
    defaultValue: `'${Priority.MEDIUM}'`,
  })
  @WorkspaceIsNullable()
  priority: Priority | null;

  @WorkspaceField({
    standardId: MATERIAL_ORDER_STANDARD_FIELD_IDS.purchaseApprovalStatus,
    type: FieldMetadataType.SELECT,
    label: msg`Approval Status`,
    description: msg`Purchase approval status`,
    icon: 'IconCheckbox',
    options: [
      {
        value: MaterialOrderApprovalStatus.PENDING,
        position: 0,
        color: 'yellow',
        label: 'Pending',
      },
      {
        value: MaterialOrderApprovalStatus.COMMANDER_APPROVED,
        position: 1,
        color: 'blue',
        label: 'Commander Approved',
      },
      {
        value: MaterialOrderApprovalStatus.QC_APPROVED,
        position: 2,
        color: 'purple',
        label: 'QC Approved',
      },
      {
        value: MaterialOrderApprovalStatus.SUPPLIER_APPROVED,
        position: 3,
        color: 'orange',
        label: 'Supplier Approved',
      },
      {
        value: MaterialOrderApprovalStatus.DIRECTOR_APPROVED,
        position: 4,
        color: 'red',
        label: 'Director Approved',
      },
      {
        value: MaterialOrderApprovalStatus.SUPPLIER_STAFF_APPROVED,
        position: 5,
        color: 'green',
        label: 'Supplier Staff Approved',
      },
      {
        value: MaterialOrderApprovalStatus.PAID,
        position: 6,
        color: 'blue',
        label: 'Paid',
      },
      {
        value: MaterialOrderApprovalStatus.RECEIVED,
        position: 7,
        color: 'turquoise',
        label: 'Received',
      },
      {
        value: MaterialOrderApprovalStatus.REJECTED,
        position: 8,
        color: 'red',
        label: 'Rejected',
      },
      {
        value: MaterialOrderApprovalStatus.CANCELLED,
        position: 9,
        color: 'gray',
        label: 'Cancelled',
      },
    ],
    defaultValue: `'${MaterialOrderApprovalStatus.PENDING}'`,
  })
  @WorkspaceIsNullable()
  purchaseApprovalStatus: MaterialOrderApprovalStatus | null;

  // Approval Information
  @WorkspaceField({
    standardId: MATERIAL_ORDER_STANDARD_FIELD_IDS.createdBy,
    type: FieldMetadataType.ACTOR,
    label: msg`Created by`,
    icon: 'IconCreativeCommonsSa',
    description: msg`The creator of the record`,
  })
  @WorkspaceIsSystem()
  @WorkspaceIsNullable()
  @WorkspaceIsFieldUIReadOnly()
  createdBy: ActorMetadata | null;

  @WorkspaceField({
    standardId: MATERIAL_ORDER_STANDARD_FIELD_IDS.approvedBy,
    type: FieldMetadataType.TEXT,
    label: msg`Approved By`,
    description: msg`Person who approved`,
    icon: 'IconUserCheck',
  })
  @WorkspaceIsNullable()
  approvedBy: string | null;

  @WorkspaceField({
    standardId: MATERIAL_ORDER_STANDARD_FIELD_IDS.nextApprovedBy,
    type: FieldMetadataType.TEXT,
    label: msg`Next Approved By`,
    description: msg`Next person to approve`,
    icon: 'IconUserCheck',
  })
  @WorkspaceIsNullable()
  nextApprovedBy: string | null;

  @WorkspaceField({
    standardId: MATERIAL_ORDER_STANDARD_FIELD_IDS.approvedDate,
    type: FieldMetadataType.DATE_TIME,
    label: msg`Approved Date`,
    description: msg`Date when approved`,
    icon: 'IconCalendarCheck',
  })
  @WorkspaceIsNullable()
  approvedDate: Date | null;

  // Reference Information
  @WorkspaceField({
    standardId: MATERIAL_ORDER_STANDARD_FIELD_IDS.externalReference,
    type: FieldMetadataType.TEXT,
    label: msg`External Reference`,
    description: msg`External reference code`,
    icon: 'IconExternalLink',
  })
  @WorkspaceIsNullable()
  externalReference: string | null;

  @WorkspaceField({
    standardId: MATERIAL_ORDER_STANDARD_FIELD_IDS.approvalNote,
    type: FieldMetadataType.TEXT,
    label: msg`Approval Note`,
    description: msg`Note for approval`,
    icon: 'IconNotes',
  })
  @WorkspaceIsNullable()
  approvalNote: string | null;

  // Financial Information
  @WorkspaceField({
    standardId: MATERIAL_ORDER_STANDARD_FIELD_IDS.totalAmount,
    type: FieldMetadataType.NUMBER,
    label: msg`Total Amount`,
    description: msg`Total amount of the order`,
    icon: 'IconCurrencyDollar',
  })
  @WorkspaceIsNullable()
  totalAmount: number | null;

  @WorkspaceField({
    standardId: MATERIAL_ORDER_STANDARD_FIELD_IDS.amountPaid,
    type: FieldMetadataType.NUMBER,
    label: msg`Amount Paid`,
    description: msg`Amount paid`,
    icon: 'IconCash',
  })
  @WorkspaceIsNullable()
  amountPaid: number | null;

  @WorkspaceField({
    standardId: MATERIAL_ORDER_STANDARD_FIELD_IDS.paymentMethod,
    type: FieldMetadataType.TEXT,
    label: msg`Payment Method`,
    description: msg`Payment method`,
    icon: 'IconCreditCard',
  })
  @WorkspaceIsNullable()
  paymentMethod: string | null;

  // Documents
  @WorkspaceField({
    standardId: MATERIAL_ORDER_STANDARD_FIELD_IDS.quotationFile,
    type: FieldMetadataType.TEXT,
    label: msg`Quotation File`,
    description: msg`Quotation file reference`,
    icon: 'IconFileText',
  })
  @WorkspaceIsNullable()
  quotationFile: string | null;

  @WorkspaceField({
    standardId: MATERIAL_ORDER_STANDARD_FIELD_IDS.referenceDocumentLink,
    type: FieldMetadataType.LINKS,
    label: msg`Reference Document`,
    description: msg`Link to reference document`,
    icon: 'IconLink',
  })
  @WorkspaceIsNullable()
  referenceDocumentLink: {
    primaryLinkLabel: string;
    primaryLinkUrl: string;
    secondaryLinks: { label: string; url: string }[];
  } | null;

  @WorkspaceField({
    standardId: MATERIAL_ORDER_STANDARD_FIELD_IDS.note,
    type: FieldMetadataType.TEXT,
    label: msg`Note`,
    description: msg`Additional notes`,
    icon: 'IconNotes',
  })
  @WorkspaceIsNullable()
  note: string | null;

  // System Fields
  @WorkspaceField({
    standardId: MATERIAL_ORDER_STANDARD_FIELD_IDS.position,
    type: FieldMetadataType.POSITION,
    label: msg`Position`,
    description: msg`Position`,
    icon: 'IconHierarchy2',
  })
  @WorkspaceIsSystem()
  @WorkspaceIsNullable()
  position: number | null;

  @WorkspaceRelation({
    standardId: MATERIAL_ORDER_STANDARD_FIELD_IDS.timelineActivities,
    type: RelationType.ONE_TO_MANY,
    label: msg`Timeline Activities`,
    description: msg`Timeline Activities linked to the material order`,
    icon: 'IconTimelineEvent',
    inverseSideTarget: () => TimelineActivityWorkspaceEntity,
    inverseSideFieldKey: 'materialOrder',
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  timelineActivities: Relation<TimelineActivityWorkspaceEntity[]>;

  // Inverse relations - Will be added when CommentOrder and OrderFollower are created in Phase 7
  // @WorkspaceRelation({
  //   standardId: MATERIAL_ORDER_STANDARD_FIELD_IDS.commentOrders,
  //   type: RelationType.ONE_TO_MANY,
  //   label: msg`Comment Orders`,
  //   description: msg`Comments linked to this order`,
  //   icon: 'IconMessageCircle',
  //   inverseSideTarget: () => CommentOrderWorkspaceEntity,
  //   inverseSideFieldKey: 'materialOrder',
  // })
  // @WorkspaceIsNullable()
  // commentOrders: Relation<CommentOrderWorkspaceEntity[]>;

  // @WorkspaceRelation({
  //   standardId: MATERIAL_ORDER_STANDARD_FIELD_IDS.orderFollowers,
  //   type: RelationType.ONE_TO_MANY,
  //   label: msg`Order Followers`,
  //   description: msg`Followers of this order`,
  //   icon: 'IconUsers',
  //   inverseSideTarget: () => OrderFollowerWorkspaceEntity,
  //   inverseSideFieldKey: 'materialOrder',
  // })
  // @WorkspaceIsNullable()
  // orderFollowers: Relation<OrderFollowerWorkspaceEntity[]>;

  @WorkspaceField({
    standardId: MATERIAL_ORDER_STANDARD_FIELD_IDS.searchVector,
    type: FieldMetadataType.TS_VECTOR,
    label: SEARCH_VECTOR_FIELD.label,
    description: SEARCH_VECTOR_FIELD.description,
    icon: 'IconSearch',
    generatedType: 'STORED',
    asExpression: getTsVectorColumnExpressionFromFields(
      SEARCH_FIELDS_FOR_MATERIAL_ORDER,
    ),
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  @WorkspaceFieldIndex({ indexType: IndexType.GIN })
  searchVector: string;
}

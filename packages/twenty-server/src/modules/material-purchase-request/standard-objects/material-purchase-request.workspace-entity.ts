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
import { MATERIAL_PURCHASE_REQUEST_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_ICONS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-icons';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';
import {
  type FieldTypeAndNameMetadata,
  getTsVectorColumnExpressionFromFields,
} from 'src/engine/workspace-manager/workspace-sync-metadata/utils/get-ts-vector-column-expression.util';
// Import related entities
import { WorkspaceJoinColumn } from 'src/engine/twenty-orm/decorators/workspace-join-column.decorator';
import { MaterialRequestWorkspaceEntity } from 'src/modules/material-request/standard-objects/material-request.workspace-entity';
import { MaterialWorkspaceEntity } from 'src/modules/material/standard-objects/material.workspace-entity';
import { ProjectWorkspaceEntity } from 'src/modules/project/standard-objects/project.workspace-entity';
import { QuotationItemWorkspaceEntity } from 'src/modules/quotation-item/standard-objects/quotation-item.workspace-entity';
import { SupplierWorkspaceEntity } from 'src/modules/supplier/standard-objects/supplier.workspace-entity';
import { TimelineActivityWorkspaceEntity } from 'src/modules/timeline/standard-objects/timeline-activity.workspace-entity';

enum MaterialPurchaseRequestStatus {
  WAITING_FOR_QUOTATION = 'waiting_for_quotation',
  QUOTATION_RECEIVED = 'quotation_received',
  APPROVED = 'approved',
  PENDING = 'pending',
  READY_FOR_ORDER = 'ready_for_order',
}

enum ProcurementDepartmentApprovalStatus {
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

// Search fields definition
const PURCHASE_REQUEST_NAME_FIELD_NAME = 'purchaseRequestName';
const NOTE_FIELD_NAME = 'note';
const APPROVAL_NOTE_FIELD_NAME = 'approvalNote';
const PROCUREMENT_DEPARTMENT_NOTE_FIELD_NAME = 'procurementDepartmentNote';

export const SEARCH_FIELDS_FOR_MATERIAL_PURCHASE_REQUEST: FieldTypeAndNameMetadata[] =
  [
    { name: PURCHASE_REQUEST_NAME_FIELD_NAME, type: FieldMetadataType.TEXT },
    { name: NOTE_FIELD_NAME, type: FieldMetadataType.TEXT },
    { name: APPROVAL_NOTE_FIELD_NAME, type: FieldMetadataType.TEXT },
    {
      name: PROCUREMENT_DEPARTMENT_NOTE_FIELD_NAME,
      type: FieldMetadataType.TEXT,
    },
  ];

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.materialPurchaseRequest,
  namePlural: 'materialPurchaseRequests',
  labelSingular: msg`Material Purchase Request`,
  labelPlural: msg`Material Purchase Requests`,
  description: msg`Material purchase request management`,
  icon: STANDARD_OBJECT_ICONS.materialPurchaseRequest,
  labelIdentifierStandardId:
    MATERIAL_PURCHASE_REQUEST_STANDARD_FIELD_IDS.purchaseRequestName,
})
@WorkspaceIsSearchable()
export class MaterialPurchaseRequestWorkspaceEntity extends BaseWorkspaceEntity {
  // Basic Information
  @WorkspaceField({
    standardId:
      MATERIAL_PURCHASE_REQUEST_STANDARD_FIELD_IDS.purchaseRequestCode,
    type: FieldMetadataType.TEXT,
    label: msg`Purchase Request Code`,
    description: msg`Code of the purchase request`,
    icon: 'IconTag',
  })
  @WorkspaceIsNullable()
  purchaseRequestCode: string | null;

  @WorkspaceField({
    standardId:
      MATERIAL_PURCHASE_REQUEST_STANDARD_FIELD_IDS.purchaseRequestName,
    type: FieldMetadataType.TEXT,
    label: msg`Purchase Request Name`,
    description: msg`Name of the purchase request`,
    icon: 'IconTag',
  })
  @WorkspaceIsNullable()
  purchaseRequestName: string | null;

  // Relations - Material Request
  @WorkspaceRelation({
    standardId: MATERIAL_PURCHASE_REQUEST_STANDARD_FIELD_IDS.materialRequest,
    type: RelationType.MANY_TO_ONE,
    label: msg`Material Request`,
    description: msg`Related material request`,
    icon: 'IconFileText',
    inverseSideTarget: () => MaterialRequestWorkspaceEntity,
    inverseSideFieldKey: 'materialPurchaseRequests',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  materialRequest: Relation<MaterialRequestWorkspaceEntity> | null;

  @WorkspaceJoinColumn('materialRequest')
  materialRequestId: string | null;

  // Relations - Material
  @WorkspaceRelation({
    standardId: MATERIAL_PURCHASE_REQUEST_STANDARD_FIELD_IDS.material,
    type: RelationType.MANY_TO_ONE,
    label: msg`Material`,
    description: msg`Material being requested`,
    icon: 'IconBox',
    inverseSideTarget: () => MaterialWorkspaceEntity,
    inverseSideFieldKey: 'materialPurchaseRequests',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  material: Relation<MaterialWorkspaceEntity> | null;

  @WorkspaceJoinColumn('material')
  materialId: string | null;

  // Relations - Supplier
  @WorkspaceRelation({
    standardId: MATERIAL_PURCHASE_REQUEST_STANDARD_FIELD_IDS.supplier,
    type: RelationType.MANY_TO_ONE,
    label: msg`Supplier`,
    description: msg`Supplier for this purchase request`,
    icon: 'IconTruck',
    inverseSideTarget: () => SupplierWorkspaceEntity,
    inverseSideFieldKey: 'materialPurchaseRequests',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  supplier: Relation<SupplierWorkspaceEntity> | null;

  @WorkspaceJoinColumn('supplier')
  supplierId: string | null;

  // Relations - Project
  @WorkspaceRelation({
    standardId: MATERIAL_PURCHASE_REQUEST_STANDARD_FIELD_IDS.project,
    type: RelationType.MANY_TO_ONE,
    label: msg`Project`,
    description: msg`Project related to this purchase request`,
    icon: 'IconBriefcase',
    inverseSideTarget: () => ProjectWorkspaceEntity,
    inverseSideFieldKey: 'materialPurchaseRequests',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsNullable()
  project: Relation<ProjectWorkspaceEntity> | null;

  @WorkspaceJoinColumn('project')
  projectId: string | null;

  // Quantity Fields
  @WorkspaceField({
    standardId: MATERIAL_PURCHASE_REQUEST_STANDARD_FIELD_IDS.requestedQuantity,
    type: FieldMetadataType.NUMBER,
    label: msg`Requested Quantity`,
    description: msg`Requested quantity`,
    icon: 'IconHash',
  })
  @WorkspaceIsNullable()
  requestedQuantity: number | null;

  @WorkspaceField({
    standardId: MATERIAL_PURCHASE_REQUEST_STANDARD_FIELD_IDS.inventoryQuantity,
    type: FieldMetadataType.NUMBER,
    label: msg`Inventory Quantity`,
    description: msg`Current inventory quantity`,
    icon: 'IconPackages',
  })
  @WorkspaceIsNullable()
  inventoryQuantity: number | null;

  @WorkspaceField({
    standardId: MATERIAL_PURCHASE_REQUEST_STANDARD_FIELD_IDS.shortageQuantity,
    type: FieldMetadataType.NUMBER,
    label: msg`Shortage Quantity`,
    description: msg`Shortage quantity to be purchased`,
    icon: 'IconAlertCircle',
  })
  @WorkspaceIsNullable()
  shortageQuantity: number | null;

  @WorkspaceField({
    standardId: MATERIAL_PURCHASE_REQUEST_STANDARD_FIELD_IDS.purchaseQuantity,
    type: FieldMetadataType.NUMBER,
    label: msg`Purchase Quantity`,
    description: msg`Quantity to purchase`,
    icon: 'IconShoppingCart',
  })
  @WorkspaceIsNullable()
  purchaseQuantity: number | null;

  @WorkspaceField({
    standardId: MATERIAL_PURCHASE_REQUEST_STANDARD_FIELD_IDS.approvedQuantity,
    type: FieldMetadataType.NUMBER,
    label: msg`Approved Quantity`,
    description: msg`Approved quantity`,
    icon: 'IconCheck',
  })
  @WorkspaceIsNullable()
  approvedQuantity: number | null;

  @WorkspaceField({
    standardId:
      MATERIAL_PURCHASE_REQUEST_STANDARD_FIELD_IDS.actualReceivedQuantity,
    type: FieldMetadataType.NUMBER,
    label: msg`Actual Received Quantity`,
    description: msg`Actual quantity received`,
    icon: 'IconPackageImport',
    defaultValue: 0,
  })
  @WorkspaceIsNullable()
  actualReceivedQuantity: number | null;

  // Priority & Status
  @WorkspaceField({
    standardId: MATERIAL_PURCHASE_REQUEST_STANDARD_FIELD_IDS.priority,
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
    standardId: MATERIAL_PURCHASE_REQUEST_STANDARD_FIELD_IDS.status,
    type: FieldMetadataType.SELECT,
    label: msg`Status`,
    description: msg`Status of the purchase request`,
    icon: 'IconInfoCircle',
    options: [
      {
        value: MaterialPurchaseRequestStatus.WAITING_FOR_QUOTATION,
        position: 0,
        color: 'yellow',
        label: 'Waiting for Quotation',
      },
      {
        value: MaterialPurchaseRequestStatus.QUOTATION_RECEIVED,
        position: 1,
        color: 'blue',
        label: 'Quotation Received',
      },
      {
        value: MaterialPurchaseRequestStatus.APPROVED,
        position: 2,
        color: 'green',
        label: 'Approved',
      },
      {
        value: MaterialPurchaseRequestStatus.PENDING,
        position: 3,
        color: 'orange',
        label: 'Pending',
      },
      {
        value: MaterialPurchaseRequestStatus.READY_FOR_ORDER,
        position: 4,
        color: 'purple',
        label: 'Ready for Order',
      },
    ],
    defaultValue: `'${MaterialPurchaseRequestStatus.PENDING}'`,
  })
  @WorkspaceIsNullable()
  status: MaterialPurchaseRequestStatus | null;

  // Request Information
  @WorkspaceField({
    standardId: MATERIAL_PURCHASE_REQUEST_STANDARD_FIELD_IDS.requestedBy,
    type: FieldMetadataType.TEXT,
    label: msg`Requested By`,
    description: msg`Person who requested`,
    icon: 'IconUser',
  })
  @WorkspaceIsNullable()
  requestedBy: string | null;

  @WorkspaceField({
    standardId: MATERIAL_PURCHASE_REQUEST_STANDARD_FIELD_IDS.approvedBy,
    type: FieldMetadataType.TEXT,
    label: msg`Approved By`,
    description: msg`Person who approved`,
    icon: 'IconUserCheck',
  })
  @WorkspaceIsNullable()
  approvedBy: string | null;

  @WorkspaceField({
    standardId: MATERIAL_PURCHASE_REQUEST_STANDARD_FIELD_IDS.requestDate,
    type: FieldMetadataType.DATE_TIME,
    label: msg`Request Date`,
    description: msg`Date when requested`,
    icon: 'IconCalendar',
  })
  @WorkspaceIsNullable()
  requestDate: Date | null;

  @WorkspaceField({
    standardId: MATERIAL_PURCHASE_REQUEST_STANDARD_FIELD_IDS.requiredDate,
    type: FieldMetadataType.DATE_TIME,
    label: msg`Required Date`,
    description: msg`Date when material is required`,
    icon: 'IconCalendarDue',
  })
  @WorkspaceIsNullable()
  requiredDate: Date | null;

  @WorkspaceField({
    standardId: MATERIAL_PURCHASE_REQUEST_STANDARD_FIELD_IDS.approvedDate,
    type: FieldMetadataType.DATE_TIME,
    label: msg`Approved Date`,
    description: msg`Date when approved`,
    icon: 'IconCalendarCheck',
  })
  @WorkspaceIsNullable()
  approvedDate: Date | null;

  @WorkspaceField({
    standardId: MATERIAL_PURCHASE_REQUEST_STANDARD_FIELD_IDS.approvalNote,
    type: FieldMetadataType.TEXT,
    label: msg`Approval Note`,
    description: msg`Note for approval`,
    icon: 'IconNotes',
  })
  @WorkspaceIsNullable()
  approvalNote: string | null;

  // Pricing Fields
  @WorkspaceField({
    standardId: MATERIAL_PURCHASE_REQUEST_STANDARD_FIELD_IDS.unitPrice,
    type: FieldMetadataType.NUMBER,
    label: msg`Unit Price`,
    description: msg`Unit price`,
    icon: 'IconCurrencyDollar',
  })
  @WorkspaceIsNullable()
  unitPrice: number | null;

  @WorkspaceField({
    standardId: MATERIAL_PURCHASE_REQUEST_STANDARD_FIELD_IDS.totalAmount,
    type: FieldMetadataType.NUMBER,
    label: msg`Total Amount`,
    description: msg`Total amount`,
    icon: 'IconCurrencyDollar',
  })
  @WorkspaceIsNullable()
  totalAmount: number | null;

  @WorkspaceField({
    standardId: MATERIAL_PURCHASE_REQUEST_STANDARD_FIELD_IDS.amountPaid,
    type: FieldMetadataType.NUMBER,
    label: msg`Amount Paid`,
    description: msg`Amount paid`,
    icon: 'IconCash',
  })
  @WorkspaceIsNullable()
  amountPaid: number | null;

  // Relations - Material Order (will be created in this phase)
  // Temporarily use TEXT field until MaterialOrder entity is created
  @WorkspaceField({
    standardId: MATERIAL_PURCHASE_REQUEST_STANDARD_FIELD_IDS.orderId,
    type: FieldMetadataType.TEXT,
    label: msg`Order ID`,
    description: msg`ID of the related material order`,
    icon: 'IconFileInvoice',
  })
  @WorkspaceIsNullable()
  orderId: string | null;

  @WorkspaceField({
    standardId: MATERIAL_PURCHASE_REQUEST_STANDARD_FIELD_IDS.note,
    type: FieldMetadataType.TEXT,
    label: msg`Note`,
    description: msg`Additional notes`,
    icon: 'IconNotes',
  })
  @WorkspaceIsNullable()
  note: string | null;

  // Recommendation Fields
  @WorkspaceField({
    standardId:
      MATERIAL_PURCHASE_REQUEST_STANDARD_FIELD_IDS.recommendedSupplierId,
    type: FieldMetadataType.TEXT,
    label: msg`Recommended Supplier ID`,
    description: msg`ID of recommended supplier`,
    icon: 'IconTruck',
  })
  @WorkspaceIsNullable()
  recommendedSupplierId: string | null;

  @WorkspaceField({
    standardId:
      MATERIAL_PURCHASE_REQUEST_STANDARD_FIELD_IDS.recommendedQuotationId,
    type: FieldMetadataType.TEXT,
    label: msg`Recommended Quotation ID`,
    description: msg`ID of recommended quotation`,
    icon: 'IconFileText',
  })
  @WorkspaceIsNullable()
  recommendedQuotationId: string | null;

  @WorkspaceField({
    standardId:
      MATERIAL_PURCHASE_REQUEST_STANDARD_FIELD_IDS.recommendedQuotationItemId,
    type: FieldMetadataType.TEXT,
    label: msg`Recommended Quotation Item ID`,
    description: msg`ID of recommended quotation item`,
    icon: 'IconListDetails',
  })
  @WorkspaceIsNullable()
  recommendedQuotationItemId: string | null;

  // Procurement Department Approval
  @WorkspaceField({
    standardId:
      MATERIAL_PURCHASE_REQUEST_STANDARD_FIELD_IDS.procurementDepartmentApprovalStatus,
    type: FieldMetadataType.SELECT,
    label: msg`Procurement Dept Approval`,
    description: msg`Procurement department approval status`,
    icon: 'IconCheckbox',
    options: [
      {
        value: ProcurementDepartmentApprovalStatus.ACCEPTED,
        position: 0,
        color: 'green',
        label: 'Accepted',
      },
      {
        value: ProcurementDepartmentApprovalStatus.REJECTED,
        position: 1,
        color: 'red',
        label: 'Rejected',
      },
    ],
  })
  @WorkspaceIsNullable()
  procurementDepartmentApprovalStatus: ProcurementDepartmentApprovalStatus | null;

  @WorkspaceField({
    standardId:
      MATERIAL_PURCHASE_REQUEST_STANDARD_FIELD_IDS.procurementDepartmentNote,
    type: FieldMetadataType.TEXT,
    label: msg`Procurement Dept Note`,
    description: msg`Procurement department note`,
    icon: 'IconNotes',
  })
  @WorkspaceIsNullable()
  procurementDepartmentNote: string | null;

  @WorkspaceField({
    standardId:
      MATERIAL_PURCHASE_REQUEST_STANDARD_FIELD_IDS.procurementDepartmentApprovalDate,
    type: FieldMetadataType.DATE_TIME,
    label: msg`Procurement Dept Approval Date`,
    description: msg`Procurement department approval date`,
    icon: 'IconCalendarCheck',
  })
  @WorkspaceIsNullable()
  procurementDepartmentApprovalDate: Date | null;

  // Supplier List (JSON)
  @WorkspaceField({
    standardId: MATERIAL_PURCHASE_REQUEST_STANDARD_FIELD_IDS.supplierList,
    type: FieldMetadataType.RAW_JSON,
    label: msg`Supplier List`,
    description: msg`List of suppliers (JSON)`,
    icon: 'IconList',
  })
  @WorkspaceIsNullable()
  supplierList: JSON | null;

  // System Fields
  @WorkspaceField({
    standardId: MATERIAL_PURCHASE_REQUEST_STANDARD_FIELD_IDS.position,
    type: FieldMetadataType.POSITION,
    label: msg`Position`,
    description: msg`Position`,
    icon: 'IconHierarchy2',
  })
  @WorkspaceIsSystem()
  @WorkspaceIsNullable()
  position: number | null;

  @WorkspaceField({
    standardId: MATERIAL_PURCHASE_REQUEST_STANDARD_FIELD_IDS.createdBy,
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
    standardId: MATERIAL_PURCHASE_REQUEST_STANDARD_FIELD_IDS.timelineActivities,
    type: RelationType.ONE_TO_MANY,
    label: msg`Timeline Activities`,
    description: msg`Timeline Activities linked to the purchase request`,
    icon: 'IconTimelineEvent',
    inverseSideTarget: () => TimelineActivityWorkspaceEntity,
    inverseSideFieldKey: 'materialPurchaseRequest',
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  timelineActivities: Relation<TimelineActivityWorkspaceEntity[]>;

  // Inverse relation - QuotationItems
  @WorkspaceRelation({
    standardId: MATERIAL_PURCHASE_REQUEST_STANDARD_FIELD_IDS.quotationItems,
    type: RelationType.ONE_TO_MANY,
    label: msg`Quotation Items`,
    description: msg`Quotation items linked to this purchase request`,
    icon: 'IconListDetails',
    inverseSideTarget: () => QuotationItemWorkspaceEntity,
    inverseSideFieldKey: 'materialPurchaseRequest',
  })
  @WorkspaceIsNullable()
  quotationItems: Relation<QuotationItemWorkspaceEntity[]>;

  @WorkspaceField({
    standardId: MATERIAL_PURCHASE_REQUEST_STANDARD_FIELD_IDS.searchVector,
    type: FieldMetadataType.TS_VECTOR,
    label: SEARCH_VECTOR_FIELD.label,
    description: SEARCH_VECTOR_FIELD.description,
    icon: 'IconSearch',
    generatedType: 'STORED',
    asExpression: getTsVectorColumnExpressionFromFields(
      SEARCH_FIELDS_FOR_MATERIAL_PURCHASE_REQUEST,
    ),
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  @WorkspaceFieldIndex({ indexType: IndexType.GIN })
  searchVector: string;
}

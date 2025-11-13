import { msg } from '@lingui/core/macro';
import { ActorMetadata, FieldMetadataType } from 'twenty-shared/types';

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
import { SUPPLIER_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_ICONS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-icons';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';
import {
  type FieldTypeAndNameMetadata,
  getTsVectorColumnExpressionFromFields,
} from 'src/engine/workspace-manager/workspace-sync-metadata/utils/get-ts-vector-column-expression.util';
// Import related entities
import { MaterialApprovalWorkspaceEntity } from 'src/modules/material-approval/standard-objects/material-approval.workspace-entity';
import { MaterialGroupWorkspaceEntity } from 'src/modules/material-group/standard-objects/material-group.workspace-entity';
import { MaterialOrderWorkspaceEntity } from 'src/modules/material-order/standard-objects/material-order.workspace-entity';
import { MaterialPriceWorkspaceEntity } from 'src/modules/material-price/standard-objects/material-price.workspace-entity';
import { MaterialPurchaseRequestWorkspaceEntity } from 'src/modules/material-purchase-request/standard-objects/material-purchase-request.workspace-entity';
import { PriceContractWorkspaceEntity } from 'src/modules/price-contract/standard-objects/price-contract.workspace-entity';
import { QuotationWorkspaceEntity } from 'src/modules/quotation/standar-objects/quotation.workspace-entity';
import { TimelineActivityWorkspaceEntity } from 'src/modules/timeline/standard-objects/timeline-activity.workspace-entity';

// Search fields definition
enum SupplierStatus {
  NEW = 'new',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

const SUPPLIER_CODE_FIELD_NAME = 'supplierCode';
const SUPPLIER_NAME_FIELD_NAME = 'supplierName';

export const SEARCH_FIELDS_FOR_SUPPLIER: FieldTypeAndNameMetadata[] = [
  { name: SUPPLIER_CODE_FIELD_NAME, type: FieldMetadataType.TEXT },
  { name: SUPPLIER_NAME_FIELD_NAME, type: FieldMetadataType.TEXT },
];

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.supplier,
  namePlural: 'suppliers',
  labelSingular: msg`Supplier`,
  labelPlural: msg`Suppliers`,
  description: msg`Supplier management`,
  icon: STANDARD_OBJECT_ICONS.supplier,
  shortcut: 'S',
  labelIdentifierStandardId: SUPPLIER_STANDARD_FIELD_IDS.supplierName,
})
@WorkspaceIsSearchable()
export class SupplierWorkspaceEntity extends BaseWorkspaceEntity {
  // Core Business Fields
  @WorkspaceField({
    standardId: SUPPLIER_STANDARD_FIELD_IDS.supplierCode,
    type: FieldMetadataType.TEXT,
    label: msg`Supplier Code`,
    description: msg`Unique identifier for the supplier`,
    icon: 'IconCode',
  })
  supplierCode: string;

  @WorkspaceField({
    standardId: SUPPLIER_STANDARD_FIELD_IDS.supplierName,
    type: FieldMetadataType.TEXT,
    label: msg`Supplier Name`,
    description: msg`Full name of the supplier`,
    icon: 'IconTruck',
  })
  supplierName: string;

  @WorkspaceField({
    standardId: SUPPLIER_STANDARD_FIELD_IDS.supplierShortenedName,
    type: FieldMetadataType.TEXT,
    label: msg`Shortened Name`,
    description: msg`Shortened name of the supplier`,
    icon: 'IconAbc',
  })
  @WorkspaceIsNullable()
  supplierShortenedName: string | null;

  // Legal & Business Information
  @WorkspaceField({
    standardId: SUPPLIER_STANDARD_FIELD_IDS.taxCode,
    type: FieldMetadataType.TEXT,
    label: msg`Tax Code`,
    description: msg`Tax identification number of the supplier`,
    icon: 'IconFileText',
  })
  @WorkspaceIsNullable()
  taxCode: string | null;

  @WorkspaceField({
    standardId: SUPPLIER_STANDARD_FIELD_IDS.businessRegistration,
    type: FieldMetadataType.TEXT,
    label: msg`Business Registration`,
    description: msg`Business registration number`,
    icon: 'IconCertificate',
  })
  @WorkspaceIsNullable()
  businessRegistration: string | null;

  // Banking Information
  @WorkspaceField({
    standardId: SUPPLIER_STANDARD_FIELD_IDS.bankAccountNumber,
    type: FieldMetadataType.TEXT,
    label: msg`Account Number`,
    description: msg`Bank account number`,
    icon: 'IconCreditCard',
  })
  @WorkspaceIsNullable()
  bankAccountNumber: string | null;

  @WorkspaceField({
    standardId: SUPPLIER_STANDARD_FIELD_IDS.bankAccountName,
    type: FieldMetadataType.TEXT,
    label: msg`Account Name`,
    description: msg`Name of the bank account holder`,
    icon: 'IconUser',
  })
  @WorkspaceIsNullable()
  bankAccountName: string | null;

  @WorkspaceField({
    standardId: SUPPLIER_STANDARD_FIELD_IDS.bankName,
    type: FieldMetadataType.TEXT,
    label: msg`Bank`,
    description: msg`Name of the bank`,
    icon: 'IconBuildingBank',
  })
  @WorkspaceIsNullable()
  bankName: string | null;

  // Address & Contact
  @WorkspaceField({
    standardId: SUPPLIER_STANDARD_FIELD_IDS.address,
    type: FieldMetadataType.TEXT,
    label: msg`Address`,
    description: msg`Address of the supplier`,
    icon: 'IconMapPin',
  })
  @WorkspaceIsNullable()
  address: string | null;

  @WorkspaceField({
    standardId: SUPPLIER_STANDARD_FIELD_IDS.contactPerson,
    type: FieldMetadataType.TEXT,
    label: msg`Contact Person`,
    description: msg`Primary contact person name`,
    icon: 'IconUser',
  })
  @WorkspaceIsNullable()
  contactPerson: string | null;

  @WorkspaceField({
    standardId: SUPPLIER_STANDARD_FIELD_IDS.contactPosition,
    type: FieldMetadataType.TEXT,
    label: msg`Contact Position`,
    description: msg`Position of the contact person`,
    icon: 'IconBriefcase',
  })
  @WorkspaceIsNullable()
  contactPosition: string | null;

  @WorkspaceField({
    standardId: SUPPLIER_STANDARD_FIELD_IDS.contactPhone,
    type: FieldMetadataType.TEXT,
    label: msg`Contact Phone`,
    description: msg`Contact phone number`,
    icon: 'IconPhone',
  })
  @WorkspaceIsNullable()
  contactPhone: string | null;

  @WorkspaceField({
    standardId: SUPPLIER_STANDARD_FIELD_IDS.contactEmail,
    type: FieldMetadataType.TEXT,
    label: msg`Contact Email`,
    description: msg`Contact email address`,
    icon: 'IconMail',
  })
  @WorkspaceIsNullable()
  contactEmail: string | null;

  // Business Details
  @WorkspaceField({
    standardId: SUPPLIER_STANDARD_FIELD_IDS.mainMaterials,
    type: FieldMetadataType.TEXT,
    label: msg`Main Materials`,
    description: msg`Main material types supplied by the supplier`,
    icon: 'IconBox',
  })
  @WorkspaceIsNullable()
  mainMaterials: string | null;

  @WorkspaceField({
    standardId: SUPPLIER_STANDARD_FIELD_IDS.catalogueFileId,
    type: FieldMetadataType.TEXT,
    label: msg`Catalogue File ID`,
    description: msg`Material catalogue file ID`,
    icon: 'IconFile',
  })
  @WorkspaceIsNullable()
  catalogueFileId: string | null;

  @WorkspaceField({
    standardId: SUPPLIER_STANDARD_FIELD_IDS.capabilityProfileFileId,
    type: FieldMetadataType.TEXT,
    label: msg`Capability Profile File ID`,
    description: msg`Capability profile file ID`,
    icon: 'IconFileText',
  })
  @WorkspaceIsNullable()
  capabilityProfileFileId: string | null;

  @WorkspaceField({
    standardId: SUPPLIER_STANDARD_FIELD_IDS.status,
    type: FieldMetadataType.SELECT,
    label: msg`Status`,
    description: msg`Status of the supplier`,
    icon: 'IconCircleDot',
    options: [
      {
        value: SupplierStatus.NEW,
        label: 'New',
        position: 0,
        color: 'blue',
      },
      {
        value: SupplierStatus.ACTIVE,
        label: 'Active',
        position: 1,
        color: 'green',
      },
      {
        value: SupplierStatus.INACTIVE,
        label: 'Inactive',
        position: 2,
        color: 'red',
      },
    ],
    defaultValue: `'${SupplierStatus.NEW}'`,
  })
  status: string;

  @WorkspaceField({
    standardId: SUPPLIER_STANDARD_FIELD_IDS.tradeTerms,
    type: FieldMetadataType.TEXT,
    label: msg`Trade Conditions`,
    description: msg`Trade conditions with the supplier`,
    icon: 'IconFileText',
  })
  @WorkspaceIsNullable()
  tradeTerms: string | null;

  @WorkspaceField({
    standardId: SUPPLIER_STANDARD_FIELD_IDS.note,
    type: FieldMetadataType.TEXT,
    label: msg`Note`,
    description: msg`Additional information about the supplier`,
    icon: 'IconNotes',
  })
  @WorkspaceIsNullable()
  note: string | null;

  // Relations
  @WorkspaceRelation({
    standardId: SUPPLIER_STANDARD_FIELD_IDS.materialGroups,
    type: RelationType.ONE_TO_MANY,
    label: msg`Material Groups`,
    description: msg`Material groups supplied by this supplier`,
    icon: 'IconCategory2',
    inverseSideTarget: () => MaterialGroupWorkspaceEntity,
    inverseSideFieldKey: 'supplier',
  })
  materialGroups: Relation<MaterialGroupWorkspaceEntity[]>;

  @WorkspaceRelation({
    standardId: SUPPLIER_STANDARD_FIELD_IDS.quotations,
    type: RelationType.ONE_TO_MANY,
    label: msg`Quotations`,
    description: msg`Quotations provided by this supplier`,
    icon: 'IconQuote',
    inverseSideTarget: () => QuotationWorkspaceEntity,
    inverseSideFieldKey: 'supplier',
  })
  quotations: Relation<QuotationWorkspaceEntity[]>;

  // System Fields
  @WorkspaceField({
    standardId: SUPPLIER_STANDARD_FIELD_IDS.position,
    type: FieldMetadataType.POSITION,
    label: msg`Position`,
    description: msg`Position`,
    icon: 'IconHierarchy2',
  })
  @WorkspaceIsSystem()
  @WorkspaceIsNullable()
  position: number | null;

  @WorkspaceField({
    standardId: SUPPLIER_STANDARD_FIELD_IDS.createdBy,
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
    standardId: SUPPLIER_STANDARD_FIELD_IDS.materialPrices,
    type: RelationType.ONE_TO_MANY,
    label: msg`Material Prices`,
    description: msg`Material prices from this supplier`,
    icon: 'IconCurrencyDollar',
    inverseSideTarget: () => MaterialPriceWorkspaceEntity,
    inverseSideFieldKey: 'supplier',
  })
  @WorkspaceIsNullable()
  materialPrices: Relation<MaterialPriceWorkspaceEntity[]>;

  @WorkspaceRelation({
    standardId: SUPPLIER_STANDARD_FIELD_IDS.priceContracts,
    type: RelationType.ONE_TO_MANY,
    label: msg`Price Contracts`,
    description: msg`Price contracts with this supplier`,
    icon: 'IconFileContract',
    inverseSideTarget: () => PriceContractWorkspaceEntity,
    inverseSideFieldKey: 'supplier',
  })
  @WorkspaceIsNullable()
  priceContracts: Relation<PriceContractWorkspaceEntity[]>;

  @WorkspaceRelation({
    standardId: SUPPLIER_STANDARD_FIELD_IDS.materialApprovals,
    type: RelationType.ONE_TO_MANY,
    label: msg`Material Approvals`,
    description: msg`Material approvals from this supplier`,
    icon: 'IconCircleCheck',
    inverseSideTarget: () => MaterialApprovalWorkspaceEntity,
    inverseSideFieldKey: 'supplier',
  })
  @WorkspaceIsNullable()
  materialApprovals: Relation<MaterialApprovalWorkspaceEntity[]>;

  @WorkspaceRelation({
    standardId: SUPPLIER_STANDARD_FIELD_IDS.timelineActivities,
    type: RelationType.ONE_TO_MANY,
    label: msg`Timeline Activities`,
    description: msg`Timeline Activities linked to the supplier`,
    icon: 'IconTimelineEvent',
    inverseSideTarget: () => TimelineActivityWorkspaceEntity,
    inverseSideFieldKey: 'supplier',
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  timelineActivities: Relation<TimelineActivityWorkspaceEntity[]>;

  @WorkspaceRelation({
    standardId: SUPPLIER_STANDARD_FIELD_IDS.materialPurchaseRequests,
    type: RelationType.ONE_TO_MANY,
    label: msg`Purchase Requests`,
    description: msg`Material purchase requests for this supplier`,
    icon: 'IconShoppingCart',
    inverseSideTarget: () => MaterialPurchaseRequestWorkspaceEntity,
    inverseSideFieldKey: 'supplier',
  })
  materialPurchaseRequests: Relation<MaterialPurchaseRequestWorkspaceEntity[]>;

  @WorkspaceRelation({
    standardId: SUPPLIER_STANDARD_FIELD_IDS.materialOrders,
    type: RelationType.ONE_TO_MANY,
    label: msg`Material Orders`,
    description: msg`Material orders for this supplier`,
    icon: 'IconFileInvoice',
    inverseSideTarget: () => MaterialOrderWorkspaceEntity,
    inverseSideFieldKey: 'supplier',
  })
  materialOrders: Relation<MaterialOrderWorkspaceEntity[]>;

  @WorkspaceField({
    standardId: SUPPLIER_STANDARD_FIELD_IDS.searchVector,
    type: FieldMetadataType.TS_VECTOR,
    label: SEARCH_VECTOR_FIELD.label,
    description: SEARCH_VECTOR_FIELD.description,
    icon: 'IconSearch',
    generatedType: 'STORED',
    asExpression: getTsVectorColumnExpressionFromFields(
      SEARCH_FIELDS_FOR_SUPPLIER,
    ),
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  @WorkspaceFieldIndex({ indexType: IndexType.GIN })
  searchVector: string;
}

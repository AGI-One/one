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
import { WorkspaceIsUnique } from 'src/engine/twenty-orm/decorators/workspace-is-unique.decorator';
import { WorkspaceRelation } from 'src/engine/twenty-orm/decorators/workspace-relation.decorator';
import { PRICE_CONTRACT_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_ICONS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-icons';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';
import {
    type FieldTypeAndNameMetadata,
    getTsVectorColumnExpressionFromFields,
} from 'src/engine/workspace-manager/workspace-sync-metadata/utils/get-ts-vector-column-expression.util';
// Import related entities
import { WorkspaceJoinColumn } from 'src/engine/twenty-orm/decorators/workspace-join-column.decorator';
import { MaterialPriceWorkspaceEntity } from 'src/modules/material-price/standard-objects/material-price.workspace-entity';
import { ProjectWorkspaceEntity } from 'src/modules/project/standard-objects/project.workspace-entity';
import { SupplierWorkspaceEntity } from 'src/modules/supplier/standard-objects/supplier.workspace-entity';
import { TimelineActivityWorkspaceEntity } from 'src/modules/timeline/standard-objects/timeline-activity.workspace-entity';

enum PriceContractStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

// Search fields definition
const CONTRACT_NAME_FIELD_NAME = 'contractName';
const DESCRIPTION_FIELD_NAME = 'description';
const TERMS_AND_CONDITIONS_FIELD_NAME = 'termsAndConditions';

export const SEARCH_FIELDS_FOR_PRICE_CONTRACT: FieldTypeAndNameMetadata[] = [
  { name: CONTRACT_NAME_FIELD_NAME, type: FieldMetadataType.TEXT },
  { name: DESCRIPTION_FIELD_NAME, type: FieldMetadataType.TEXT },
  { name: TERMS_AND_CONDITIONS_FIELD_NAME, type: FieldMetadataType.TEXT },
];

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.priceContract,
  namePlural: 'priceContracts',
  labelSingular: msg`Price Contract`,
  labelPlural: msg`Price Contracts`,
  description: msg`Price contract management`,
  icon: STANDARD_OBJECT_ICONS.priceContract,
  labelIdentifierStandardId: PRICE_CONTRACT_STANDARD_FIELD_IDS.contractName,
})
@WorkspaceIsSearchable()
export class PriceContractWorkspaceEntity extends BaseWorkspaceEntity {
  // Contract Code - Unique
  @WorkspaceField({
    standardId: PRICE_CONTRACT_STANDARD_FIELD_IDS.contractCode,
    type: FieldMetadataType.TEXT,
    label: msg`Contract Code`,
    description: msg`Unique contract code`,
    icon: 'IconTag',
  })
  @WorkspaceIsUnique()
  @WorkspaceIsNullable()
  contractCode: string | null;

  // Relations - Supplier (required)
  @WorkspaceRelation({
    standardId: PRICE_CONTRACT_STANDARD_FIELD_IDS.supplier,
    type: RelationType.MANY_TO_ONE,
    label: msg`Supplier`,
    description: msg`Supplier of the contract`,
    icon: 'IconTruck',
    inverseSideTarget: () => SupplierWorkspaceEntity,
    inverseSideFieldKey: 'priceContracts',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  supplier: Relation<SupplierWorkspaceEntity>;

  @WorkspaceJoinColumn('supplier')
  supplierId: string;

  // Relations - Project (required)
  @WorkspaceRelation({
    standardId: PRICE_CONTRACT_STANDARD_FIELD_IDS.project,
    type: RelationType.MANY_TO_ONE,
    label: msg`Project`,
    description: msg`Project using this contract`,
    icon: 'IconBriefcase',
    inverseSideTarget: () => ProjectWorkspaceEntity,
    inverseSideFieldKey: 'priceContracts',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  project: Relation<ProjectWorkspaceEntity>;

  @WorkspaceJoinColumn('project')
  projectId: string;

  // Contract Information
  @WorkspaceField({
    standardId: PRICE_CONTRACT_STANDARD_FIELD_IDS.contractName,
    type: FieldMetadataType.TEXT,
    label: msg`Contract Name`,
    description: msg`Name of the contract`,
    icon: 'IconFileContract',
  })
  @WorkspaceIsNullable()
  contractName: string | null;

  @WorkspaceField({
    standardId: PRICE_CONTRACT_STANDARD_FIELD_IDS.startDate,
    type: FieldMetadataType.DATE_TIME,
    label: msg`Start Date`,
    description: msg`Contract start date`,
    icon: 'IconCalendar',
  })
  @WorkspaceIsNullable()
  startDate: Date | null;

  @WorkspaceField({
    standardId: PRICE_CONTRACT_STANDARD_FIELD_IDS.endDate,
    type: FieldMetadataType.DATE_TIME,
    label: msg`End Date`,
    description: msg`Contract end date`,
    icon: 'IconCalendar',
  })
  @WorkspaceIsNullable()
  endDate: Date | null;

  @WorkspaceField({
    standardId: PRICE_CONTRACT_STANDARD_FIELD_IDS.status,
    type: FieldMetadataType.SELECT,
    label: msg`Status`,
    description: msg`Contract status`,
    icon: 'IconFlag',
    options: [
      {
        value: PriceContractStatus.DRAFT,
        label: 'Draft',
        position: 0,
        color: 'gray',
      },
      {
        value: PriceContractStatus.ACTIVE,
        label: 'Active',
        position: 1,
        color: 'green',
      },
      {
        value: PriceContractStatus.EXPIRED,
        label: 'Expired',
        position: 2,
        color: 'red',
      },
      {
        value: PriceContractStatus.CANCELLED,
        label: 'Cancelled',
        position: 3,
        color: 'orange',
      },
    ],
    defaultValue: `'${PriceContractStatus.DRAFT}'`,
  })
  @WorkspaceIsNullable()
  status: string | null;

  @WorkspaceField({
    standardId: PRICE_CONTRACT_STANDARD_FIELD_IDS.description,
    type: FieldMetadataType.TEXT,
    label: msg`Description`,
    description: msg`Contract description`,
    icon: 'IconNotes',
  })
  @WorkspaceIsNullable()
  description: string | null;

  // Audit Fields
  @WorkspaceField({
    standardId: PRICE_CONTRACT_STANDARD_FIELD_IDS.approvedBy,
    type: FieldMetadataType.TEXT,
    label: msg`Approved By`,
    description: msg`Person who approved the contract`,
    icon: 'IconUserCheck',
  })
  @WorkspaceIsNullable()
  approvedBy: string | null;

  @WorkspaceField({
    standardId: PRICE_CONTRACT_STANDARD_FIELD_IDS.approvedAt,
    type: FieldMetadataType.DATE_TIME,
    label: msg`Approved At`,
    description: msg`Time of approval`,
    icon: 'IconCalendar',
  })
  @WorkspaceIsNullable()
  approvedAt: Date | null;

  @WorkspaceField({
    standardId: PRICE_CONTRACT_STANDARD_FIELD_IDS.termsAndConditions,
    type: FieldMetadataType.TEXT,
    label: msg`Terms and Conditions`,
    description: msg`Contract terms and conditions`,
    icon: 'IconFileText',
  })
  @WorkspaceIsNullable()
  termsAndConditions: string | null;

  // System Fields - REQUIRED
  @WorkspaceField({
    standardId: PRICE_CONTRACT_STANDARD_FIELD_IDS.position,
    type: FieldMetadataType.POSITION,
    label: msg`Position`,
    description: msg`Price contract record position`,
    icon: 'IconHierarchy2',
    defaultValue: 0,
  })
  @WorkspaceIsSystem()
  position: number;

  @WorkspaceField({
    standardId: PRICE_CONTRACT_STANDARD_FIELD_IDS.createdBy,
    type: FieldMetadataType.ACTOR,
    label: msg`Created by`,
    icon: 'IconCreativeCommonsSa',
    description: msg`The creator of the record`,
  })
  @WorkspaceIsFieldUIReadOnly()
  createdBy: ActorMetadata;

  // Timeline Activities - System field
  @WorkspaceRelation({
    standardId: PRICE_CONTRACT_STANDARD_FIELD_IDS.timelineActivities,
    type: RelationType.ONE_TO_MANY,
    label: msg`Timeline Activities`,
    description: msg`Timeline Activities linked to the price contract`,
    icon: 'IconTimelineEvent',
    inverseSideTarget: () => TimelineActivityWorkspaceEntity,
    inverseSideFieldKey: 'priceContract',
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  timelineActivities: Relation<TimelineActivityWorkspaceEntity[]>;

  // Relations - MaterialPrice (One-to-Many)
  @WorkspaceRelation({
    standardId: PRICE_CONTRACT_STANDARD_FIELD_IDS.materialPrices,
    type: RelationType.ONE_TO_MANY,
    label: msg`Material Prices`,
    description: msg`Material prices in this contract`,
    icon: 'IconCurrencyDollar',
    inverseSideTarget: () => MaterialPriceWorkspaceEntity,
    inverseSideFieldKey: 'priceContract',
  })
  materialPrices: Relation<MaterialPriceWorkspaceEntity[]>;

  // Search Vector - REQUIRED for searchable entities
  @WorkspaceField({
    standardId: PRICE_CONTRACT_STANDARD_FIELD_IDS.searchVector,
    type: FieldMetadataType.TS_VECTOR,
    label: SEARCH_VECTOR_FIELD.label,
    description: SEARCH_VECTOR_FIELD.description,
    icon: 'IconSearch',
    generatedType: 'STORED',
    asExpression: getTsVectorColumnExpressionFromFields(
      SEARCH_FIELDS_FOR_PRICE_CONTRACT,
    ),
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  @WorkspaceFieldIndex({ indexType: IndexType.GIN })
  searchVector: string;
}

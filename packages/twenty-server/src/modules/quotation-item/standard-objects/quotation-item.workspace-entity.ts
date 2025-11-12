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
import { QUOTATION_ITEM_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_ICONS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-icons';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';
import {
  type FieldTypeAndNameMetadata,
  getTsVectorColumnExpressionFromFields,
} from 'src/engine/workspace-manager/workspace-sync-metadata/utils/get-ts-vector-column-expression.util';
// Import related entities
import { WorkspaceJoinColumn } from 'src/engine/twenty-orm/decorators/workspace-join-column.decorator';
import { MaterialPurchaseRequestWorkspaceEntity } from 'src/modules/material-purchase-request/standard-objects/material-purchase-request.workspace-entity';
import { QuotationWorkspaceEntity } from 'src/modules/quotation/standar-objects/quotation.workspace-entity';
import { TimelineActivityWorkspaceEntity } from 'src/modules/timeline/standard-objects/timeline-activity.workspace-entity';

enum QuotationItemStatus {
  PENDING = 'pending',
  UNDER_REVIEW = 'under_review',
  NEGOTIATING = 'negotiating',
  PRICE_ACCEPTED = 'price_accepted',
  SELECTED = 'selected',
  REJECTED = 'rejected',
  NOT_SELECTED = 'not_selected',
}

// Search fields definition
const NAME_FIELD_NAME = 'name';
const NOTE_FIELD_NAME = 'note';
const NEGOTIATION_NOTE_FIELD_NAME = 'negotiationNote';

export const SEARCH_FIELDS_FOR_QUOTATION_ITEM: FieldTypeAndNameMetadata[] = [
  { name: NAME_FIELD_NAME, type: FieldMetadataType.TEXT },
  { name: NOTE_FIELD_NAME, type: FieldMetadataType.TEXT },
  { name: NEGOTIATION_NOTE_FIELD_NAME, type: FieldMetadataType.TEXT },
];

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.quotationItem,
  namePlural: 'quotationItems',
  labelSingular: msg`Quotation Item`,
  labelPlural: msg`Quotation Items`,
  description: msg`Quotation item management`,
  icon: STANDARD_OBJECT_ICONS.quotationItem,
  labelIdentifierStandardId: QUOTATION_ITEM_STANDARD_FIELD_IDS.name,
})
@WorkspaceIsSearchable()
export class QuotationItemWorkspaceEntity extends BaseWorkspaceEntity {
  // Name Field
  @WorkspaceField({
    standardId: QUOTATION_ITEM_STANDARD_FIELD_IDS.name,
    type: FieldMetadataType.TEXT,
    label: msg`Name`,
    description: msg`Name of the quotation item`,
    icon: 'IconTag',
  })
  @WorkspaceIsNullable()
  name: string | null;

  // Core Relations
  @WorkspaceRelation({
    standardId: QUOTATION_ITEM_STANDARD_FIELD_IDS.quotation,
    type: RelationType.MANY_TO_ONE,
    label: msg`Quotation`,
    description: msg`Quotation that this item belongs to`,
    icon: 'IconFileText',
    inverseSideTarget: () => QuotationWorkspaceEntity,
    inverseSideFieldKey: 'quotationItems',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsNullable()
  quotation: Relation<QuotationWorkspaceEntity> | null;

  @WorkspaceJoinColumn('quotation')
  quotationId: string | null;

  // Material Purchase Request Relation
  @WorkspaceRelation({
    standardId: QUOTATION_ITEM_STANDARD_FIELD_IDS.materialPurchaseRequest,
    type: RelationType.MANY_TO_ONE,
    label: msg`Material Purchase Request`,
    description: msg`Material purchase request that this item belongs to`,
    icon: 'IconShoppingCart',
    inverseSideTarget: () => MaterialPurchaseRequestWorkspaceEntity,
    inverseSideFieldKey: 'quotationItems',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  materialPurchaseRequest: Relation<MaterialPurchaseRequestWorkspaceEntity> | null;

  @WorkspaceJoinColumn('materialPurchaseRequest')
  materialPurchaseRequestId: string | null;

  // Pricing Fields
  @WorkspaceField({
    standardId: QUOTATION_ITEM_STANDARD_FIELD_IDS.quantity,
    type: FieldMetadataType.NUMBER,
    label: msg`Quantity`,
    description: msg`Quantity of the item`,
    icon: 'IconHash',
  })
  @WorkspaceIsNullable()
  quantity: number | null;

  @WorkspaceField({
    standardId: QUOTATION_ITEM_STANDARD_FIELD_IDS.unitPrice,
    type: FieldMetadataType.NUMBER,
    label: msg`Unit Price`,
    description: msg`Unit price of the item`,
    icon: 'IconCurrencyDollar',
  })
  @WorkspaceIsNullable()
  unitPrice: number | null;

  @WorkspaceField({
    standardId: QUOTATION_ITEM_STANDARD_FIELD_IDS.totalPrice,
    type: FieldMetadataType.NUMBER,
    label: msg`Total Price`,
    description: msg`Total price (quantity × unit price)`,
    icon: 'IconCurrencyDollar',
  })
  @WorkspaceIsNullable()
  totalPrice: number | null;

  @WorkspaceField({
    standardId: QUOTATION_ITEM_STANDARD_FIELD_IDS.currency,
    type: FieldMetadataType.TEXT,
    label: msg`Currency`,
    description: msg`Currency of the price`,
    icon: 'IconCurrencyDollar',
  })
  @WorkspaceIsNullable()
  currency: string | null;

  // Status
  @WorkspaceField({
    standardId: QUOTATION_ITEM_STANDARD_FIELD_IDS.status,
    type: FieldMetadataType.SELECT,
    label: msg`Status`,
    description: msg`Status of the quotation item`,
    icon: 'IconInfoCircle',
    options: [
      {
        value: QuotationItemStatus.PENDING,
        position: 0,
        color: 'gray',
        label: 'Pending',
      },
      {
        value: QuotationItemStatus.UNDER_REVIEW,
        position: 1,
        color: 'yellow',
        label: 'Under Review',
      },
      {
        value: QuotationItemStatus.NEGOTIATING,
        position: 2,
        color: 'orange',
        label: 'Negotiating',
      },
      {
        value: QuotationItemStatus.PRICE_ACCEPTED,
        position: 3,
        color: 'blue',
        label: 'Price Accepted',
      },
      {
        value: QuotationItemStatus.SELECTED,
        position: 4,
        color: 'green',
        label: 'Selected',
      },
      {
        value: QuotationItemStatus.REJECTED,
        position: 5,
        color: 'red',
        label: 'Rejected',
      },
      {
        value: QuotationItemStatus.NOT_SELECTED,
        position: 6,
        color: 'gray',
        label: 'Not Selected',
      },
    ],
    defaultValue: `'${QuotationItemStatus.PENDING}'`,
  })
  @WorkspaceIsNullable()
  status: QuotationItemStatus | null;

  // Negotiation Fields
  @WorkspaceField({
    standardId: QUOTATION_ITEM_STANDARD_FIELD_IDS.negotiatedUnitPrice,
    type: FieldMetadataType.NUMBER,
    label: msg`Negotiated Unit Price`,
    description: msg`Unit price after negotiation`,
    icon: 'IconCurrencyDollar',
  })
  @WorkspaceIsNullable()
  negotiatedUnitPrice: number | null;

  @WorkspaceField({
    standardId: QUOTATION_ITEM_STANDARD_FIELD_IDS.negotiatedTotalPrice,
    type: FieldMetadataType.NUMBER,
    label: msg`Negotiated Total Price`,
    description: msg`Total price after negotiation`,
    icon: 'IconCurrencyDollar',
  })
  @WorkspaceIsNullable()
  negotiatedTotalPrice: number | null;

  @WorkspaceField({
    standardId: QUOTATION_ITEM_STANDARD_FIELD_IDS.negotiationNote,
    type: FieldMetadataType.TEXT,
    label: msg`Negotiation Note`,
    description: msg`Note regarding the negotiation`,
    icon: 'IconNotes',
  })
  @WorkspaceIsNullable()
  negotiationNote: string | null;

  @WorkspaceField({
    standardId: QUOTATION_ITEM_STANDARD_FIELD_IDS.negotiatedBy,
    type: FieldMetadataType.TEXT,
    label: msg`Negotiated By`,
    description: msg`Person who negotiated the price`,
    icon: 'IconUser',
  })
  @WorkspaceIsNullable()
  negotiatedBy: string | null;

  @WorkspaceField({
    standardId: QUOTATION_ITEM_STANDARD_FIELD_IDS.negotiationDate,
    type: FieldMetadataType.DATE_TIME,
    label: msg`Negotiation Date`,
    description: msg`Date when the negotiation occurred`,
    icon: 'IconCalendar',
  })
  @WorkspaceIsNullable()
  negotiationDate: Date | null;

  // Acceptance Fields
  @WorkspaceField({
    standardId: QUOTATION_ITEM_STANDARD_FIELD_IDS.acceptedBy,
    type: FieldMetadataType.TEXT,
    label: msg`Accepted By`,
    description: msg`Person who accepted the price`,
    icon: 'IconUserCheck',
  })
  @WorkspaceIsNullable()
  acceptedBy: string | null;

  @WorkspaceField({
    standardId: QUOTATION_ITEM_STANDARD_FIELD_IDS.acceptedDate,
    type: FieldMetadataType.DATE_TIME,
    label: msg`Accepted Date`,
    description: msg`Date when the price was accepted`,
    icon: 'IconCalendar',
  })
  @WorkspaceIsNullable()
  acceptedDate: Date | null;

  @WorkspaceField({
    standardId: QUOTATION_ITEM_STANDARD_FIELD_IDS.acceptanceNote,
    type: FieldMetadataType.TEXT,
    label: msg`Acceptance Note`,
    description: msg`Note regarding the acceptance`,
    icon: 'IconNotes',
  })
  @WorkspaceIsNullable()
  acceptanceNote: string | null;

  // Delivery & Warranty
  @WorkspaceField({
    standardId: QUOTATION_ITEM_STANDARD_FIELD_IDS.deliveryTime,
    type: FieldMetadataType.TEXT,
    label: msg`Delivery Time`,
    description: msg`Delivery time for this item`,
    icon: 'IconClock',
  })
  @WorkspaceIsNullable()
  deliveryTime: string | null;

  @WorkspaceField({
    standardId: QUOTATION_ITEM_STANDARD_FIELD_IDS.warrantyPeriod,
    type: FieldMetadataType.TEXT,
    label: msg`Warranty Period`,
    description: msg`Warranty period for this item`,
    icon: 'IconShieldCheck',
  })
  @WorkspaceIsNullable()
  warrantyPeriod: string | null;

  // Note
  @WorkspaceField({
    standardId: QUOTATION_ITEM_STANDARD_FIELD_IDS.note,
    type: FieldMetadataType.TEXT,
    label: msg`Note`,
    description: msg`Additional notes for this item`,
    icon: 'IconNotes',
  })
  @WorkspaceIsNullable()
  note: string | null;

  // System Fields
  @WorkspaceField({
    standardId: QUOTATION_ITEM_STANDARD_FIELD_IDS.position,
    type: FieldMetadataType.POSITION,
    label: msg`Position`,
    description: msg`Position`,
    icon: 'IconHierarchy2',
  })
  @WorkspaceIsSystem()
  @WorkspaceIsNullable()
  position: number | null;

  @WorkspaceField({
    standardId: QUOTATION_ITEM_STANDARD_FIELD_IDS.createdBy,
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
    standardId: QUOTATION_ITEM_STANDARD_FIELD_IDS.timelineActivities,
    type: RelationType.ONE_TO_MANY,
    label: msg`Timeline Activities`,
    description: msg`Timeline Activities linked to the quotation item`,
    icon: 'IconTimelineEvent',
    inverseSideTarget: () => TimelineActivityWorkspaceEntity,
    inverseSideFieldKey: 'quotationItem',
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  timelineActivities: Relation<TimelineActivityWorkspaceEntity[]>;

  @WorkspaceField({
    standardId: QUOTATION_ITEM_STANDARD_FIELD_IDS.searchVector,
    type: FieldMetadataType.TS_VECTOR,
    label: SEARCH_VECTOR_FIELD.label,
    description: SEARCH_VECTOR_FIELD.description,
    icon: 'IconSearch',
    generatedType: 'STORED',
    asExpression: getTsVectorColumnExpressionFromFields(
      SEARCH_FIELDS_FOR_QUOTATION_ITEM,
    ),
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  @WorkspaceFieldIndex({ indexType: IndexType.GIN })
  searchVector: string;
}

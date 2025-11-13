import { msg } from '@lingui/core/macro';
import {
    ActorMetadata,
    FieldMetadataType,
    RelationOnDeleteAction,
    type CurrencyMetadata,
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
import { MATERIAL_PRICE_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_ICONS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-icons';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';
import {
    getTsVectorColumnExpressionFromFields,
    type FieldTypeAndNameMetadata,
} from 'src/engine/workspace-manager/workspace-sync-metadata/utils/get-ts-vector-column-expression.util';
// Import related entities
import { WorkspaceJoinColumn } from 'src/engine/twenty-orm/decorators/workspace-join-column.decorator';
import { ManufacturerWorkspaceEntity } from 'src/modules/manufacturer/standard-objects/manufacturer.workspace-entity';
import { MaterialPriceHistoryWorkspaceEntity } from 'src/modules/material-price-history/standard-objects/material-price-history.workspace-entity';
import { MaterialWorkspaceEntity } from 'src/modules/material/standard-objects/material.workspace-entity';
import { PriceContractWorkspaceEntity } from 'src/modules/price-contract/standard-objects/price-contract.workspace-entity';
import { SupplierWorkspaceEntity } from 'src/modules/supplier/standard-objects/supplier.workspace-entity';
import { TimelineActivityWorkspaceEntity } from 'src/modules/timeline/standard-objects/timeline-activity.workspace-entity';

enum MaterialPriceType {
  CONTRACT = 'contract',
  QUOTATION = 'quotation',
}

// Search fields definition
const NOTE_FIELD_NAME = 'note';
const MODEL_FIELD_NAME = 'model';

export const SEARCH_FIELDS_FOR_MATERIAL_PRICE: FieldTypeAndNameMetadata[] = [
  { name: NOTE_FIELD_NAME, type: FieldMetadataType.TEXT },
  { name: MODEL_FIELD_NAME, type: FieldMetadataType.TEXT },
];

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.materialPrice,
  namePlural: 'materialPrices',
  labelSingular: msg`Material Price`,
  labelPlural: msg`Material Prices`,
  description: msg`Material pricing information`,
  icon: STANDARD_OBJECT_ICONS.materialPrice,
  labelIdentifierStandardId: MATERIAL_PRICE_STANDARD_FIELD_IDS.model,
})
@WorkspaceIsSearchable()
export class MaterialPriceWorkspaceEntity extends BaseWorkspaceEntity {
  // Relations - Material (required)
  @WorkspaceRelation({
    standardId: MATERIAL_PRICE_STANDARD_FIELD_IDS.material,
    type: RelationType.MANY_TO_ONE,
    label: msg`Material`,
    description: msg`Material being priced`,
    icon: 'IconBox',
    inverseSideTarget: () => MaterialWorkspaceEntity,
    inverseSideFieldKey: 'materialPrices',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  material: Relation<MaterialWorkspaceEntity>;

  @WorkspaceJoinColumn('material')
  materialId: string;

  // Relations - Supplier (required)
  @WorkspaceRelation({
    standardId: MATERIAL_PRICE_STANDARD_FIELD_IDS.supplier,
    type: RelationType.MANY_TO_ONE,
    label: msg`Supplier`,
    description: msg`Supplier offering this price`,
    icon: 'IconTruck',
    inverseSideTarget: () => SupplierWorkspaceEntity,
    inverseSideFieldKey: 'materialPrices',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  supplier: Relation<SupplierWorkspaceEntity>;

  @WorkspaceJoinColumn('supplier')
  supplierId: string;

  // Basic Fields
  @WorkspaceField({
    standardId: MATERIAL_PRICE_STANDARD_FIELD_IDS.model,
    type: FieldMetadataType.TEXT,
    label: msg`Model`,
    description: msg`Equipment model`,
    icon: 'IconTag',
  })
  @WorkspaceIsNullable()
  model: string | null;

  @WorkspaceField({
    standardId: MATERIAL_PRICE_STANDARD_FIELD_IDS.unit,
    type: FieldMetadataType.TEXT,
    label: msg`Unit`,
    description: msg`Unit of measurement`,
    icon: 'IconRuler',
  })
  @WorkspaceIsNullable()
  unit: string | null;
  @WorkspaceField({
    standardId: MATERIAL_PRICE_STANDARD_FIELD_IDS.currentPrice,
    type: FieldMetadataType.CURRENCY,
    label: msg`Current Price`,
    description: msg`Current price`,
    icon: 'IconCurrencyDollar',
  })
  @WorkspaceIsNullable()
  currentPrice: CurrencyMetadata | null;

  @WorkspaceField({
    standardId: MATERIAL_PRICE_STANDARD_FIELD_IDS.laborCost,
    type: FieldMetadataType.CURRENCY,
    label: msg`Labor Cost`,
    description: msg`Labor cost`,
    icon: 'IconUserDollar',
  })
  @WorkspaceIsNullable()
  laborCost: CurrencyMetadata | null;

  // Relations - Manufacturer (optional)
  @WorkspaceRelation({
    standardId: MATERIAL_PRICE_STANDARD_FIELD_IDS.manufacturer,
    type: RelationType.MANY_TO_ONE,
    label: msg`Manufacturer`,
    description: msg`Manufacturer of the material`,
    icon: 'IconBuildingFactory2',
    inverseSideTarget: () => ManufacturerWorkspaceEntity,
    inverseSideFieldKey: 'materialPrices',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  manufacturer: Relation<ManufacturerWorkspaceEntity> | null;

  @WorkspaceJoinColumn('manufacturer')
  manufacturerId: string | null;

  // Lead time fields
  @WorkspaceField({
    standardId: MATERIAL_PRICE_STANDARD_FIELD_IDS.leadTimeMinDays,
    type: FieldMetadataType.NUMBER,
    label: msg`Lead Time Min (Days)`,
    description: msg`Minimum delivery time in days`,
    icon: 'IconClock',
  })
  @WorkspaceIsNullable()
  leadTimeMinDays: number | null;

  @WorkspaceField({
    standardId: MATERIAL_PRICE_STANDARD_FIELD_IDS.leadTimeMaxDays,
    type: FieldMetadataType.NUMBER,
    label: msg`Lead Time Max (Days)`,
    description: msg`Maximum delivery time in days`,
    icon: 'IconClock',
  })
  @WorkspaceIsNullable()
  leadTimeMaxDays: number | null;

  @WorkspaceField({
    standardId: MATERIAL_PRICE_STANDARD_FIELD_IDS.priceUpdatedAt,
    type: FieldMetadataType.DATE_TIME,
    label: msg`Price Updated At`,
    description: msg`Date when price was last updated`,
    icon: 'IconCalendar',
  })
  @WorkspaceIsNullable()
  priceUpdatedAt: Date | null;

  @WorkspaceField({
    standardId: MATERIAL_PRICE_STANDARD_FIELD_IDS.discountPercentage,
    type: FieldMetadataType.NUMBER,
    label: msg`Discount Percentage`,
    description: msg`Discount percentage`,
    icon: 'IconPercentage',
  })
  @WorkspaceIsNullable()
  discountPercentage: number | null;

  @WorkspaceField({
    standardId: MATERIAL_PRICE_STANDARD_FIELD_IDS.note,
    type: FieldMetadataType.TEXT,
    label: msg`Note`,
    description: msg`Additional notes`,
    icon: 'IconNotes',
  })
  @WorkspaceIsNullable()
  note: string | null;

  // Relations - PriceContract (optional)
  @WorkspaceRelation({
    standardId: MATERIAL_PRICE_STANDARD_FIELD_IDS.priceContract,
    type: RelationType.MANY_TO_ONE,
    label: msg`Price Contract`,
    description: msg`Related price contract`,
    icon: 'IconFileContract',
    inverseSideTarget: () => PriceContractWorkspaceEntity,
    inverseSideFieldKey: 'materialPrices',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  priceContract: Relation<PriceContractWorkspaceEntity> | null;

  @WorkspaceJoinColumn('priceContract')
  priceContractId: string | null;

  @WorkspaceField({
    standardId: MATERIAL_PRICE_STANDARD_FIELD_IDS.priceType,
    type: FieldMetadataType.SELECT,
    label: msg`Price Type`,
    description: msg`Type of price: contract or quotation`,
    icon: 'IconTag',
    options: [
      {
        value: MaterialPriceType.CONTRACT,
        label: 'Contract',
        position: 0,
        color: 'green',
      },
      {
        value: MaterialPriceType.QUOTATION,
        label: 'Quotation',
        position: 1,
        color: 'blue',
      },
    ],
    defaultValue: `'${MaterialPriceType.QUOTATION}'`,
  })
  @WorkspaceIsNullable()
  priceType: string | null;

  // System Fields - REQUIRED
  @WorkspaceField({
    standardId: MATERIAL_PRICE_STANDARD_FIELD_IDS.position,
    type: FieldMetadataType.POSITION,
    label: msg`Position`,
    description: msg`Material price record position`,
    icon: 'IconHierarchy2',
    defaultValue: 0,
  })
  @WorkspaceIsSystem()
  position: number;

  @WorkspaceField({
    standardId: MATERIAL_PRICE_STANDARD_FIELD_IDS.createdBy,
    type: FieldMetadataType.ACTOR,
    label: msg`Created by`,
    icon: 'IconCreativeCommonsSa',
    description: msg`The creator of the record`,
  })
  @WorkspaceIsFieldUIReadOnly()
  createdBy: ActorMetadata;

  // Timeline Activities - System field
  @WorkspaceRelation({
    standardId: MATERIAL_PRICE_STANDARD_FIELD_IDS.timelineActivities,
    type: RelationType.ONE_TO_MANY,
    label: msg`Timeline Activities`,
    description: msg`Timeline Activities linked to the material price`,
    icon: 'IconTimelineEvent',
    inverseSideTarget: () => TimelineActivityWorkspaceEntity,
    inverseSideFieldKey: 'materialPrice',
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  timelineActivities: Relation<TimelineActivityWorkspaceEntity[]>;

  // Relations - MaterialPriceHistory (One-to-Many)
  @WorkspaceRelation({
    standardId: MATERIAL_PRICE_STANDARD_FIELD_IDS.materialPriceHistories,
    type: RelationType.ONE_TO_MANY,
    label: msg`Price Histories`,
    description: msg`Price change history for this material`,
    icon: 'IconHistory',
    inverseSideTarget: () => MaterialPriceHistoryWorkspaceEntity,
    inverseSideFieldKey: 'materialPrice',
  })
  materialPriceHistories: Relation<MaterialPriceHistoryWorkspaceEntity[]>;

  // Search Vector - REQUIRED for searchable entities
  @WorkspaceField({
    standardId: MATERIAL_PRICE_STANDARD_FIELD_IDS.searchVector,
    type: FieldMetadataType.TS_VECTOR,
    label: SEARCH_VECTOR_FIELD.label,
    description: SEARCH_VECTOR_FIELD.description,
    icon: 'IconSearch',
    generatedType: 'STORED',
    asExpression: getTsVectorColumnExpressionFromFields(
      SEARCH_FIELDS_FOR_MATERIAL_PRICE,
    ),
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  @WorkspaceFieldIndex({ indexType: IndexType.GIN })
  searchVector: string;
}

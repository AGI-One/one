import { msg } from '@lingui/core/macro';
import { FieldMetadataType, RelationOnDeleteAction } from 'twenty-shared/types';

import { RelationType } from 'src/engine/metadata-modules/field-metadata/interfaces/relation-type.interface';
import { Relation } from 'src/engine/workspace-manager/workspace-sync-metadata/interfaces/relation.interface';

import { SEARCH_VECTOR_FIELD } from 'src/engine/metadata-modules/constants/search-vector-field.constants';
import { ActorMetadata } from 'src/engine/metadata-modules/field-metadata/composite-types/actor.composite-type';
import { CurrencyMetadata } from 'src/engine/metadata-modules/field-metadata/composite-types/currency.composite-type';
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
import { PRODUCT_VARIANT_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_ICONS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-icons';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';
import {
  type FieldTypeAndNameMetadata,
  getTsVectorColumnExpressionFromFields,
} from 'src/engine/workspace-manager/workspace-sync-metadata/utils/get-ts-vector-column-expression.util';
import { InventoryWorkspaceEntity } from 'src/modules/inventory/standard-objects/inventory.workspace-entity';
import { ProductVariantOptionValueWorkspaceEntity } from 'src/modules/product-variant-option-value/standard-objects/product-variant-option-value.workspace-entity';
import { ProductWorkspaceEntity } from 'src/modules/product/standard-objects/product.workspace-entity';
import { TimelineActivityWorkspaceEntity } from 'src/modules/timeline/standard-objects/timeline-activity.workspace-entity';

const SKU_FIELD_NAME = 'sku';

export const SEARCH_FIELDS_FOR_PRODUCT_VARIANT: FieldTypeAndNameMetadata[] = [
  { name: SKU_FIELD_NAME, type: FieldMetadataType.TEXT },
];

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.productVariant,
  namePlural: 'productVariants',
  labelSingular: msg`Product Variant`,
  labelPlural: msg`Product Variants`,
  description: msg`A product variant (combination of options)`,
  icon: STANDARD_OBJECT_ICONS.productVariant,
  labelIdentifierStandardId: PRODUCT_VARIANT_STANDARD_FIELD_IDS.sku,
})
@WorkspaceIsSearchable()
export class ProductVariantWorkspaceEntity extends BaseWorkspaceEntity {
  @WorkspaceField({
    standardId: PRODUCT_VARIANT_STANDARD_FIELD_IDS.sku,
    type: FieldMetadataType.TEXT,
    label: msg`SKU`,
    description: msg`Stock Keeping Unit / Internal Reference`,
    icon: 'IconHash',
  })
  @WorkspaceIsNullable()
  sku: string | null;

  @WorkspaceField({
    standardId: PRODUCT_VARIANT_STANDARD_FIELD_IDS.quantity,
    type: FieldMetadataType.NUMBER,
    label: msg`Quantity`,
    description: msg`Available quantity`,
    icon: 'IconBoxMultiple',
    defaultValue: 0,
  })
  quantity: number;

  @WorkspaceField({
    standardId: PRODUCT_VARIANT_STANDARD_FIELD_IDS.enabled,
    type: FieldMetadataType.BOOLEAN,
    label: msg`Enabled`,
    description: msg`Whether the variant is enabled`,
    icon: 'IconToggleRight',
    defaultValue: true,
  })
  enabled: boolean;

  @WorkspaceField({
    standardId: PRODUCT_VARIANT_STANDARD_FIELD_IDS.unitCost,
    type: FieldMetadataType.CURRENCY,
    label: msg`Unit Cost`,
    description: msg`Cost per unit`,
    icon: 'IconCurrencyDollar',
  })
  @WorkspaceIsNullable()
  unitCost: CurrencyMetadata | null;

  @WorkspaceField({
    standardId: PRODUCT_VARIANT_STANDARD_FIELD_IDS.retailPrice,
    type: FieldMetadataType.CURRENCY,
    label: msg`Retail Price`,
    description: msg`Selling price`,
    icon: 'IconMoneybag',
  })
  @WorkspaceIsNullable()
  retailPrice: CurrencyMetadata | null;

  @WorkspaceField({
    standardId: PRODUCT_VARIANT_STANDARD_FIELD_IDS.trackInventory,
    type: FieldMetadataType.BOOLEAN,
    label: msg`Track Inventory`,
    description: msg`Whether to track inventory for this variant`,
    icon: 'IconPackage',
    defaultValue: true,
  })
  trackInventory: boolean;

  @WorkspaceField({
    standardId: PRODUCT_VARIANT_STANDARD_FIELD_IDS.canBeSold,
    type: FieldMetadataType.BOOLEAN,
    label: msg`Can Be Sold`,
    description: msg`Whether this variant can be sold`,
    icon: 'IconShoppingCart',
    defaultValue: true,
  })
  canBeSold: boolean;

  @WorkspaceField({
    standardId: PRODUCT_VARIANT_STANDARD_FIELD_IDS.canBePurchased,
    type: FieldMetadataType.BOOLEAN,
    label: msg`Can Be Purchased`,
    description: msg`Whether this variant can be purchased`,
    icon: 'IconShoppingBag',
    defaultValue: true,
  })
  canBePurchased: boolean;

  @WorkspaceField({
    standardId: PRODUCT_VARIANT_STANDARD_FIELD_IDS.taxes,
    type: FieldMetadataType.NUMBER,
    label: msg`Taxes`,
    description: msg`Tax percentage`,
    icon: 'IconReceipt',
    defaultValue: 0,
  })
  taxes: number;

  @WorkspaceField({
    standardId: PRODUCT_VARIANT_STANDARD_FIELD_IDS.notes,
    type: FieldMetadataType.TEXT,
    label: msg`Notes`,
    description: msg`Internal notes`,
    icon: 'IconNotes',
  })
  @WorkspaceIsNullable()
  notes: string | null;

  @WorkspaceField({
    standardId: PRODUCT_VARIANT_STANDARD_FIELD_IDS.imageUrl,
    type: FieldMetadataType.TEXT,
    label: msg`Image`,
    description: msg`Variant image URL`,
    icon: 'IconPhoto',
  })
  @WorkspaceIsNullable()
  imageUrl: string | null;

  // System fields
  @WorkspaceField({
    standardId: PRODUCT_VARIANT_STANDARD_FIELD_IDS.position,
    type: FieldMetadataType.POSITION,
    label: msg`Position`,
    description: msg`Product variant record position`,
    icon: 'IconHierarchy2',
    defaultValue: 0,
  })
  @WorkspaceIsSystem()
  position: number;

  @WorkspaceField({
    standardId: PRODUCT_VARIANT_STANDARD_FIELD_IDS.createdBy,
    type: FieldMetadataType.ACTOR,
    label: msg`Created by`,
    icon: 'IconCreativeCommonsSa',
    description: msg`The creator of the record`,
  })
  @WorkspaceIsFieldUIReadOnly()
  createdBy: ActorMetadata;

  // Relations - Product
  @WorkspaceRelation({
    standardId: PRODUCT_VARIANT_STANDARD_FIELD_IDS.product,
    type: RelationType.MANY_TO_ONE,
    label: msg`Product`,
    description: msg`The product this variant belongs to`,
    icon: 'IconPackage',
    inverseSideTarget: () => ProductWorkspaceEntity,
    inverseSideFieldKey: 'variants',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsNullable()
  product: Relation<ProductWorkspaceEntity> | null;

  @WorkspaceJoinColumn('product')
  productId: string | null;

  // Relations - ProductVariantOptionValues (junction table storing option selections)
  @WorkspaceRelation({
    standardId: PRODUCT_VARIANT_STANDARD_FIELD_IDS.optionValues,
    type: RelationType.ONE_TO_MANY,
    label: msg`Option Values`,
    description: msg`Option values that define this variant`,
    icon: 'IconList',
    inverseSideTarget: () => ProductVariantOptionValueWorkspaceEntity,
    inverseSideFieldKey: 'variant',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsNullable()
  optionValues: Relation<ProductVariantOptionValueWorkspaceEntity[]>;

  // Relations - Inventories (junction to warehouses)
  @WorkspaceRelation({
    standardId: PRODUCT_VARIANT_STANDARD_FIELD_IDS.inventories,
    type: RelationType.ONE_TO_MANY,
    label: msg`Inventories`,
    description: msg`Warehouse inventory records for this variant`,
    icon: 'IconPackages',
    inverseSideTarget: () => InventoryWorkspaceEntity,
    inverseSideFieldKey: 'variant',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsNullable()
  inventories: Relation<InventoryWorkspaceEntity[]>;

  @WorkspaceRelation({
    standardId: PRODUCT_VARIANT_STANDARD_FIELD_IDS.timelineActivities,
    type: RelationType.ONE_TO_MANY,
    label: msg`Timeline Activities`,
    description: msg`Timeline activities linked to the product variant`,
    icon: 'IconIconTimelineEvent',
    inverseSideTarget: () => TimelineActivityWorkspaceEntity,
    inverseSideFieldKey: 'productVariant',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  timelineActivities: Relation<TimelineActivityWorkspaceEntity[]>;

  @WorkspaceField({
    standardId: PRODUCT_VARIANT_STANDARD_FIELD_IDS.searchVector,
    type: FieldMetadataType.TS_VECTOR,
    label: SEARCH_VECTOR_FIELD.label,
    description: SEARCH_VECTOR_FIELD.description,
    icon: 'IconSearch',
    generatedType: 'STORED',
    asExpression: getTsVectorColumnExpressionFromFields(
      SEARCH_FIELDS_FOR_PRODUCT_VARIANT,
    ),
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  @WorkspaceFieldIndex({ indexType: IndexType.GIN })
  searchVector: string;
}

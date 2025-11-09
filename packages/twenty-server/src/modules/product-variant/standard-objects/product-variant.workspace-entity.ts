import { msg } from '@lingui/core/macro';
import { FieldMetadataType, RelationOnDeleteAction } from 'twenty-shared/types';

import { RelationType } from 'src/engine/metadata-modules/field-metadata/interfaces/relation-type.interface';
import { Relation } from 'src/engine/workspace-manager/workspace-sync-metadata/interfaces/relation.interface';

import { TimelineActivityWorkspaceEntity } from 'src/modules/timeline/standard-objects/timeline-activity.workspace-entity';
import { ActorMetadata } from 'src/engine/metadata-modules/field-metadata/composite-types/actor.composite-type';
import { CurrencyMetadata } from 'src/engine/metadata-modules/field-metadata/composite-types/currency.composite-type';
import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { WorkspaceEntity } from 'src/engine/twenty-orm/decorators/workspace-entity.decorator';
import { WorkspaceField } from 'src/engine/twenty-orm/decorators/workspace-field.decorator';
import { WorkspaceIsFieldUIReadOnly } from 'src/engine/twenty-orm/decorators/workspace-is-field-ui-readonly.decorator';
import { WorkspaceIsNullable } from 'src/engine/twenty-orm/decorators/workspace-is-nullable.decorator';
import { WorkspaceIsSystem } from 'src/engine/twenty-orm/decorators/workspace-is-system.decorator';
import { WorkspaceJoinColumn } from 'src/engine/twenty-orm/decorators/workspace-join-column.decorator';
import { WorkspaceRelation } from 'src/engine/twenty-orm/decorators/workspace-relation.decorator';
import { PRODUCT_VARIANT_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_ICONS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-icons';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';
import { ProductWorkspaceEntity } from 'src/modules/product/standard-objects/product.workspace-entity';
import { ProductVariantOptionWorkspaceEntity } from 'src/modules/product-variant-option/standard-objects/product-variant-option.workspace-entity';
import { WarehouseProductVariantWorkspaceEntity } from 'src/modules/warehouse-product-variant/standard-objects/warehouse-product-variant.workspace-entity';

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.productVariant,
  namePlural: 'productVariants',
  labelSingular: msg`Product Variant`,
  labelPlural: msg`Product Variants`,
  description: msg`A product variant (combination of options)`,
  icon: STANDARD_OBJECT_ICONS.productVariant,
  labelIdentifierStandardId: PRODUCT_VARIANT_STANDARD_FIELD_IDS.sku,
})
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

  // Relations - ProductVariantOptions (OneToMany to junction table)
  @WorkspaceRelation({
    standardId: PRODUCT_VARIANT_STANDARD_FIELD_IDS.productVariantOptions,
    type: RelationType.ONE_TO_MANY,
    label: msg`Variant Options`,
    description: msg`Options that define this variant`,
    icon: 'IconLink',
    inverseSideTarget: () => ProductVariantOptionWorkspaceEntity,
    inverseSideFieldKey: 'productVariant',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsNullable()
  productVariantOptions: Relation<ProductVariantOptionWorkspaceEntity[]>;
  @WorkspaceRelation({
    standardId: PRODUCT_VARIANT_STANDARD_FIELD_IDS.warehouseVariants,
    type: RelationType.ONE_TO_MANY,
    label: msg`Warehouse Variants`,
    description: msg`Warehouse inventory for this variant`,
    icon: 'IconBoxSeam',
    inverseSideTarget: () => WarehouseProductVariantWorkspaceEntity,
    inverseSideFieldKey: 'productVariant',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsNullable()
  warehouseVariants: Relation<WarehouseProductVariantWorkspaceEntity[]>;

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
}

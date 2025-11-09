import { msg } from '@lingui/core/macro';
import { FieldMetadataType, RelationOnDeleteAction } from 'twenty-shared/types';

import { RelationType } from 'src/engine/metadata-modules/field-metadata/interfaces/relation-type.interface';
import type { Relation } from 'src/engine/workspace-manager/workspace-sync-metadata/interfaces/relation.interface';

import { ActorMetadata } from 'src/engine/metadata-modules/field-metadata/composite-types/actor.composite-type';
import { IndexType } from 'src/engine/metadata-modules/index-metadata/types/indexType.types';
import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { WorkspaceEntity } from 'src/engine/twenty-orm/decorators/workspace-entity.decorator';
import { WorkspaceField } from 'src/engine/twenty-orm/decorators/workspace-field.decorator';
import { WorkspaceFieldIndex } from 'src/engine/twenty-orm/decorators/workspace-field-index.decorator';
import { WorkspaceIsFieldUIReadOnly } from 'src/engine/twenty-orm/decorators/workspace-is-field-ui-readonly.decorator';
import { WorkspaceIsNotAuditLogged } from 'src/engine/twenty-orm/decorators/workspace-is-not-audit-logged.decorator';
import { WorkspaceIsNullable } from 'src/engine/twenty-orm/decorators/workspace-is-nullable.decorator';
import { WorkspaceIsSystem } from 'src/engine/twenty-orm/decorators/workspace-is-system.decorator';
import { WorkspaceJoinColumn } from 'src/engine/twenty-orm/decorators/workspace-join-column.decorator';
import { WorkspaceRelation } from 'src/engine/twenty-orm/decorators/workspace-relation.decorator';
import { WAREHOUSE_PRODUCT_VARIANT_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_ICONS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-icons';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';
import { ProductVariantWorkspaceEntity } from 'src/modules/product-variant/standard-objects/product-variant.workspace-entity';
import { WarehouseProductWorkspaceEntity } from 'src/modules/warehouse-product/standard-objects/warehouse-product.workspace-entity';

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.warehouseProductVariant,
  namePlural: 'warehouseProductVariants',
  labelSingular: msg`Warehouse Product Variant`,
  labelPlural: msg`Warehouse Product Variants`,
  description: msg`Junction table for tracking variant quantities in warehouses`,
  icon: STANDARD_OBJECT_ICONS.warehouseProductVariant,
})
@WorkspaceIsSystem()
@WorkspaceIsNotAuditLogged()
export class WarehouseProductVariantWorkspaceEntity extends BaseWorkspaceEntity {
  // WarehouseProduct relation
  @WorkspaceRelation({
    standardId: WAREHOUSE_PRODUCT_VARIANT_STANDARD_FIELD_IDS.warehouseProduct,
    type: RelationType.MANY_TO_ONE,
    label: msg`Warehouse Product`,
    description: msg`Warehouse product for this variant`,
    icon: 'IconPackages',
    inverseSideTarget: () => WarehouseProductWorkspaceEntity,
    inverseSideFieldKey: 'variants',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsNullable()
  warehouseProduct: Relation<WarehouseProductWorkspaceEntity> | null;

  @WorkspaceJoinColumn('warehouseProduct')
  @WorkspaceFieldIndex({ indexType: IndexType.BTREE })
  warehouseProductId: string | null;

  // ProductVariant relation
  @WorkspaceRelation({
    standardId: WAREHOUSE_PRODUCT_VARIANT_STANDARD_FIELD_IDS.productVariant,
    type: RelationType.MANY_TO_ONE,
    label: msg`Product Variant`,
    description: msg`Product variant in warehouse`,
    icon: 'IconVersions',
    inverseSideTarget: () => ProductVariantWorkspaceEntity,
    inverseSideFieldKey: 'warehouseVariants',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsNullable()
  productVariant: Relation<ProductVariantWorkspaceEntity> | null;

  @WorkspaceJoinColumn('productVariant')
  @WorkspaceFieldIndex({ indexType: IndexType.BTREE })
  productVariantId: string | null;

  // Quantity field
  @WorkspaceField({
    standardId: WAREHOUSE_PRODUCT_VARIANT_STANDARD_FIELD_IDS.quantity,
    type: FieldMetadataType.NUMBER,
    label: msg`Quantity`,
    description: msg`Quantity of this variant in warehouse`,
    icon: 'IconHash',
    defaultValue: 0,
  })
  quantity: number;

  // System fields
  @WorkspaceField({
    standardId: WAREHOUSE_PRODUCT_VARIANT_STANDARD_FIELD_IDS.position,
    type: FieldMetadataType.POSITION,
    label: msg`Position`,
    description: msg`Record position`,
    icon: 'IconHierarchy2',
    defaultValue: 0,
  })
  @WorkspaceIsSystem()
  position: number;

  @WorkspaceField({
    standardId: WAREHOUSE_PRODUCT_VARIANT_STANDARD_FIELD_IDS.createdBy,
    type: FieldMetadataType.ACTOR,
    label: msg`Created by`,
    icon: 'IconCreativeCommonsSa',
    description: msg`The creator of the record`,
  })
  @WorkspaceIsFieldUIReadOnly()
  createdBy: ActorMetadata;
}

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
import { WAREHOUSE_PRODUCT_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_ICONS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-icons';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';
import { ProductWorkspaceEntity } from 'src/modules/product/standard-objects/product.workspace-entity';
import { WarehouseWorkspaceEntity } from 'src/modules/warehouse/standard-objects/warehouse.workspace-entity';
import { WarehouseProductVariantWorkspaceEntity } from 'src/modules/warehouse-product-variant/standard-objects/warehouse-product-variant.workspace-entity';

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.warehouseProduct,
  namePlural: 'warehouseProducts',
  labelSingular: msg`Warehouse Product`,
  labelPlural: msg`Warehouse Products`,
  description: msg`Junction table between Warehouse and Product with quantity tracking`,
  icon: STANDARD_OBJECT_ICONS.warehouseProduct,
})
@WorkspaceIsSystem()
@WorkspaceIsNotAuditLogged()
export class WarehouseProductWorkspaceEntity extends BaseWorkspaceEntity {
  // Warehouse relation
  @WorkspaceRelation({
    standardId: WAREHOUSE_PRODUCT_STANDARD_FIELD_IDS.warehouse,
    type: RelationType.MANY_TO_ONE,
    label: msg`Warehouse`,
    description: msg`Warehouse for this product`,
    icon: 'IconBuilding',
    inverseSideTarget: () => WarehouseWorkspaceEntity,
    inverseSideFieldKey: 'products',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsNullable()
  warehouse: Relation<WarehouseWorkspaceEntity> | null;

  @WorkspaceJoinColumn('warehouse')
  @WorkspaceFieldIndex({ indexType: IndexType.BTREE })
  warehouseId: string | null;

  // Product relation
  @WorkspaceRelation({
    standardId: WAREHOUSE_PRODUCT_STANDARD_FIELD_IDS.product,
    type: RelationType.MANY_TO_ONE,
    label: msg`Product`,
    description: msg`Product in this warehouse`,
    icon: 'IconPackage',
    inverseSideTarget: () => ProductWorkspaceEntity,
    inverseSideFieldKey: 'warehouses',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsNullable()
  product: Relation<ProductWorkspaceEntity> | null;

  @WorkspaceJoinColumn('product')
  @WorkspaceFieldIndex({ indexType: IndexType.BTREE })
  productId: string | null;

  // Quantity field
  @WorkspaceField({
    standardId: WAREHOUSE_PRODUCT_STANDARD_FIELD_IDS.quantity,
    type: FieldMetadataType.NUMBER,
    label: msg`Quantity`,
    description: msg`Total quantity of product in warehouse`,
    icon: 'IconHash',
    defaultValue: 0,
  })
  quantity: number;

  // Variants relation
  @WorkspaceRelation({
    standardId: WAREHOUSE_PRODUCT_STANDARD_FIELD_IDS.variants,
    type: RelationType.ONE_TO_MANY,
    label: msg`Variants`,
    description: msg`Product variants in this warehouse`,
    icon: 'IconVersions',
    inverseSideTarget: () => WarehouseProductVariantWorkspaceEntity,
    inverseSideFieldKey: 'warehouseProduct',
  })
  variants: Relation<WarehouseProductVariantWorkspaceEntity[]>;

  // System fields
  @WorkspaceField({
    standardId: WAREHOUSE_PRODUCT_STANDARD_FIELD_IDS.position,
    type: FieldMetadataType.POSITION,
    label: msg`Position`,
    description: msg`Record position`,
    icon: 'IconHierarchy2',
    defaultValue: 0,
  })
  @WorkspaceIsSystem()
  position: number;

  @WorkspaceField({
    standardId: WAREHOUSE_PRODUCT_STANDARD_FIELD_IDS.createdBy,
    type: FieldMetadataType.ACTOR,
    label: msg`Created by`,
    icon: 'IconCreativeCommonsSa',
    description: msg`The creator of the record`,
  })
  @WorkspaceIsFieldUIReadOnly()
  createdBy: ActorMetadata;
}

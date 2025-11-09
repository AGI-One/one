import { msg } from '@lingui/core/macro';
import { RelationOnDeleteAction } from 'twenty-shared/types';

import { RelationType } from 'src/engine/metadata-modules/field-metadata/interfaces/relation-type.interface';
import { type Relation } from 'src/engine/workspace-manager/workspace-sync-metadata/interfaces/relation.interface';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { WorkspaceEntity } from 'src/engine/twenty-orm/decorators/workspace-entity.decorator';
import { WorkspaceIndex } from 'src/engine/twenty-orm/decorators/workspace-index.decorator';
import { WorkspaceIsNotAuditLogged } from 'src/engine/twenty-orm/decorators/workspace-is-not-audit-logged.decorator';
import { WorkspaceIsNullable } from 'src/engine/twenty-orm/decorators/workspace-is-nullable.decorator';
import { WorkspaceIsSystem } from 'src/engine/twenty-orm/decorators/workspace-is-system.decorator';
import { WorkspaceJoinColumn } from 'src/engine/twenty-orm/decorators/workspace-join-column.decorator';
import { WorkspaceRelation } from 'src/engine/twenty-orm/decorators/workspace-relation.decorator';
import { PRODUCT_VARIANT_OPTION_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_ICONS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-icons';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';
import { ProductVariantWorkspaceEntity } from 'src/modules/product-variant/standard-objects/product-variant.workspace-entity';
import { ProductOptionWorkspaceEntity } from 'src/modules/product-option/standard-objects/product-option.workspace-entity';

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.productVariantOption,
  namePlural: 'productVariantOptions',
  labelSingular: msg`Product Variant Option`,
  labelPlural: msg`Product Variant Options`,
  description: msg`Junction table for product variants and options`,
  icon: STANDARD_OBJECT_ICONS.productVariantOption,
})
@WorkspaceIsNotAuditLogged()
@WorkspaceIsSystem()
@WorkspaceIndex(['productVariantId', 'productOptionId'], {
  isUnique: true,
  indexWhereClause: '"deletedAt" IS NULL',
})
export class ProductVariantOptionWorkspaceEntity extends BaseWorkspaceEntity {
  // Relations - ProductVariant
  @WorkspaceRelation({
    standardId: PRODUCT_VARIANT_OPTION_STANDARD_FIELD_IDS.productVariant,
    type: RelationType.MANY_TO_ONE,
    label: msg`Product Variant`,
    description: msg`The product variant`,
    icon: 'IconVersions',
    inverseSideTarget: () => ProductVariantWorkspaceEntity,
    inverseSideFieldKey: 'productVariantOptions',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsNullable()
  productVariant: Relation<ProductVariantWorkspaceEntity> | null;

  @WorkspaceJoinColumn('productVariant')
  productVariantId: string;

  // Relations - ProductOption
  @WorkspaceRelation({
    standardId: PRODUCT_VARIANT_OPTION_STANDARD_FIELD_IDS.productOption,
    type: RelationType.MANY_TO_ONE,
    label: msg`Product Option`,
    description: msg`The product option`,
    icon: 'IconAdjustments',
    inverseSideTarget: () => ProductOptionWorkspaceEntity,
    inverseSideFieldKey: 'productVariantOptions',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsNullable()
  productOption: Relation<ProductOptionWorkspaceEntity> | null;

  @WorkspaceJoinColumn('productOption')
  productOptionId: string;
}

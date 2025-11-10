import { msg } from '@lingui/core/macro';
import { FieldMetadataType, RelationOnDeleteAction } from 'twenty-shared/types';

import { RelationType } from 'src/engine/metadata-modules/field-metadata/interfaces/relation-type.interface';
import { Relation } from 'src/engine/workspace-manager/workspace-sync-metadata/interfaces/relation.interface';

import { ActorMetadata } from 'src/engine/metadata-modules/field-metadata/composite-types/actor.composite-type';
import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { WorkspaceEntity } from 'src/engine/twenty-orm/decorators/workspace-entity.decorator';
import { WorkspaceField } from 'src/engine/twenty-orm/decorators/workspace-field.decorator';
import { WorkspaceIsFieldUIReadOnly } from 'src/engine/twenty-orm/decorators/workspace-is-field-ui-readonly.decorator';
import { WorkspaceIsNotAuditLogged } from 'src/engine/twenty-orm/decorators/workspace-is-not-audit-logged.decorator';
import { WorkspaceIsNullable } from 'src/engine/twenty-orm/decorators/workspace-is-nullable.decorator';
import { WorkspaceIsSystem } from 'src/engine/twenty-orm/decorators/workspace-is-system.decorator';
import { WorkspaceJoinColumn } from 'src/engine/twenty-orm/decorators/workspace-join-column.decorator';
import { WorkspaceRelation } from 'src/engine/twenty-orm/decorators/workspace-relation.decorator';
import { STANDARD_OBJECT_ICONS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-icons';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';
import { ProductOptionGroupWorkspaceEntity } from 'src/modules/product-option-group/standard-objects/product-option-group.workspace-entity';
import { ProductOptionWorkspaceEntity } from 'src/modules/product-option/standard-objects/product-option.workspace-entity';
import { ProductVariantWorkspaceEntity } from 'src/modules/product-variant/standard-objects/product-variant.workspace-entity';

// Field IDs
export const PRODUCT_VARIANT_OPTION_VALUE_STANDARD_FIELD_IDS = {
  variant: 'bcdcfa19-cbcc-4355-a4e2-c9ed94e13f6a',
  optionGroup: '8a0f2ca6-0e4e-470b-92da-d8b1e37efca1',
  option: '0c8e3ce2-8f29-42f1-ad54-c4bd52e19b9a',
  customValue: '72c63e47-d7cd-4fc3-98dd-e4329adfc729',
  createdBy: 'd1e5bb0e-6f18-49e9-90b1-29c4e8b42e8f',
} as const;

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.productVariantOptionValue,
  namePlural: 'productVariantOptionValues',
  labelSingular: msg`Product Variant Option Value`,
  labelPlural: msg`Product Variant Option Values`,
  description: msg`Stores option values for product variants (either from predefined options or custom values)`,
  icon: STANDARD_OBJECT_ICONS.productVariantOptionValue,
})
@WorkspaceIsNotAuditLogged()
@WorkspaceIsSystem()
export class ProductVariantOptionValueWorkspaceEntity extends BaseWorkspaceEntity {
  // ProductVariant relation
  @WorkspaceRelation({
    standardId: PRODUCT_VARIANT_OPTION_VALUE_STANDARD_FIELD_IDS.variant,
    type: RelationType.MANY_TO_ONE,
    label: msg`Variant`,
    description: msg`The product variant`,
    icon: 'IconVersions',
    inverseSideTarget: () => ProductVariantWorkspaceEntity,
    inverseSideFieldKey: 'optionValues',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsNullable()
  variant: Relation<ProductVariantWorkspaceEntity> | null;

  @WorkspaceJoinColumn('variant')
  variantId: string;

  // ProductOptionGroup relation
  @WorkspaceRelation({
    standardId: PRODUCT_VARIANT_OPTION_VALUE_STANDARD_FIELD_IDS.optionGroup,
    type: RelationType.MANY_TO_ONE,
    label: msg`Option Group`,
    description: msg`The option group`,
    icon: 'IconBoxMultiple',
    inverseSideTarget: () => ProductOptionGroupWorkspaceEntity,
    inverseSideFieldKey: 'variantOptionValues',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsNullable()
  optionGroup: Relation<ProductOptionGroupWorkspaceEntity> | null;

  @WorkspaceJoinColumn('optionGroup')
  optionGroupId: string;

  // ProductOption relation (nullable - only for select type)
  @WorkspaceRelation({
    standardId: PRODUCT_VARIANT_OPTION_VALUE_STANDARD_FIELD_IDS.option,
    type: RelationType.MANY_TO_ONE,
    label: msg`Option`,
    description: msg`The selected option (only for select type option groups)`,
    icon: 'IconList',
    inverseSideTarget: () => ProductOptionWorkspaceEntity,
    inverseSideFieldKey: 'variantOptionValues',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsNullable()
  option: Relation<ProductOptionWorkspaceEntity> | null;

  @WorkspaceJoinColumn('option')
  optionId: string | null;

  // Custom value field (nullable - only for text/textarea/number/url types)
  @WorkspaceField({
    standardId: PRODUCT_VARIANT_OPTION_VALUE_STANDARD_FIELD_IDS.customValue,
    type: FieldMetadataType.TEXT,
    label: msg`Custom Value`,
    description: msg`Custom value for text/textarea/number/url type option groups (XOR with option)`,
    icon: 'IconPencil',
  })
  @WorkspaceIsNullable()
  customValue: string | null;

  // System fields
  @WorkspaceField({
    standardId: PRODUCT_VARIANT_OPTION_VALUE_STANDARD_FIELD_IDS.createdBy,
    type: FieldMetadataType.ACTOR,
    label: msg`Created by`,
    icon: 'IconCreativeCommonsSa',
    description: msg`The creator of the record`,
  })
  @WorkspaceIsFieldUIReadOnly()
  createdBy: ActorMetadata;
}

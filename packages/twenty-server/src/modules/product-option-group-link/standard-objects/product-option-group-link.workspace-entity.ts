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
import { ProductWorkspaceEntity } from 'src/modules/product/standard-objects/product.workspace-entity';

// Field IDs
export const PRODUCT_OPTION_GROUP_LINK_STANDARD_FIELD_IDS = {
  product: 'c114c75a-73f1-40f9-a40d-0b95c6f4c6cb',
  optionGroup: '6eae34cd-a3ac-4bce-bb5a-e80ca319eaae',
  required: 'fa1a79cc-d022-4384-82df-402cedc02674',
  position: '628f3925-dc22-4f01-9d86-a48979fbba33',
  customDisplayName: '4caa5f16-a4a0-4e8c-8615-a8fb4fce93db',
  createdBy: 'a07f36c7-ba74-4ab4-85a2-312d79328d6d',
} as const;

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.productOptionGroupLink,
  namePlural: 'productOptionGroupLinks',
  labelSingular: msg`Product Option Group Link`,
  labelPlural: msg`Product Option Group Links`,
  description: msg`Links products to their option groups`,
  icon: STANDARD_OBJECT_ICONS.productOptionGroupLink,
})
@WorkspaceIsNotAuditLogged()
@WorkspaceIsSystem()
export class ProductOptionGroupLinkWorkspaceEntity extends BaseWorkspaceEntity {
  // Product relation
  @WorkspaceRelation({
    standardId: PRODUCT_OPTION_GROUP_LINK_STANDARD_FIELD_IDS.product,
    type: RelationType.MANY_TO_ONE,
    label: msg`Product`,
    description: msg`The product`,
    icon: 'IconPackage',
    inverseSideTarget: () => ProductWorkspaceEntity,
    inverseSideFieldKey: 'optionGroupLinks',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsNullable()
  product: Relation<ProductWorkspaceEntity> | null;

  @WorkspaceJoinColumn('product')
  productId: string;

  // ProductOptionGroup relation
  @WorkspaceRelation({
    standardId: PRODUCT_OPTION_GROUP_LINK_STANDARD_FIELD_IDS.optionGroup,
    type: RelationType.MANY_TO_ONE,
    label: msg`Option Group`,
    description: msg`The option group`,
    icon: 'IconBoxMultiple',
    inverseSideTarget: () => ProductOptionGroupWorkspaceEntity,
    inverseSideFieldKey: 'productLinks',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsNullable()
  optionGroup: Relation<ProductOptionGroupWorkspaceEntity> | null;

  @WorkspaceJoinColumn('optionGroup')
  optionGroupId: string;

  // Configuration fields
  @WorkspaceField({
    standardId: PRODUCT_OPTION_GROUP_LINK_STANDARD_FIELD_IDS.required,
    type: FieldMetadataType.BOOLEAN,
    label: msg`Required`,
    description: msg`Whether this option group is required`,
    icon: 'IconAsterisk',
    defaultValue: false,
  })
  required: boolean;

  @WorkspaceField({
    standardId: PRODUCT_OPTION_GROUP_LINK_STANDARD_FIELD_IDS.position,
    type: FieldMetadataType.POSITION,
    label: msg`Position`,
    description: msg`Display order position`,
    icon: 'IconHierarchy2',
    defaultValue: 0,
  })
  @WorkspaceIsSystem()
  position: number;

  @WorkspaceField({
    standardId: PRODUCT_OPTION_GROUP_LINK_STANDARD_FIELD_IDS.customDisplayName,
    type: FieldMetadataType.TEXT,
    label: msg`Custom Display Name`,
    description: msg`Override the default display name`,
    icon: 'IconTag',
  })
  @WorkspaceIsNullable()
  customDisplayName: string | null;

  // System fields
  @WorkspaceField({
    standardId: PRODUCT_OPTION_GROUP_LINK_STANDARD_FIELD_IDS.createdBy,
    type: FieldMetadataType.ACTOR,
    label: msg`Created by`,
    icon: 'IconCreativeCommonsSa',
    description: msg`The creator of the record`,
  })
  @WorkspaceIsFieldUIReadOnly()
  createdBy: ActorMetadata;
}

import { msg } from '@lingui/core/macro';
import { FieldMetadataType, RelationOnDeleteAction } from 'twenty-shared/types';

import { RelationType } from 'src/engine/metadata-modules/field-metadata/interfaces/relation-type.interface';
import { Relation } from 'src/engine/workspace-manager/workspace-sync-metadata/interfaces/relation.interface';

import { SEARCH_VECTOR_FIELD } from 'src/engine/metadata-modules/constants/search-vector-field.constants';
import { ActorMetadata } from 'src/engine/metadata-modules/field-metadata/composite-types/actor.composite-type';
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
import { PRODUCT_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_ICONS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-icons';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';
import {
  type FieldTypeAndNameMetadata,
  getTsVectorColumnExpressionFromFields,
} from 'src/engine/workspace-manager/workspace-sync-metadata/utils/get-ts-vector-column-expression.util';
import { ProductCategoryWorkspaceEntity } from 'src/modules/product-category/standard-objects/product-category.workspace-entity';
import { ProductOptionGroupLinkWorkspaceEntity } from 'src/modules/product-option-group-link/standard-objects/product-option-group-link.workspace-entity';
import { ProductVariantWorkspaceEntity } from 'src/modules/product-variant/standard-objects/product-variant.workspace-entity';
import { TimelineActivityWorkspaceEntity } from 'src/modules/timeline/standard-objects/timeline-activity.workspace-entity';

const NAME_FIELD_NAME = 'name';
const CODE_FIELD_NAME = 'code';

export const SEARCH_FIELDS_FOR_PRODUCT: FieldTypeAndNameMetadata[] = [
  { name: NAME_FIELD_NAME, type: FieldMetadataType.TEXT },
  { name: CODE_FIELD_NAME, type: FieldMetadataType.TEXT },
];

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.product,
  namePlural: 'products',
  labelSingular: msg`Product`,
  labelPlural: msg`Products`,
  description: msg`A product`,
  icon: STANDARD_OBJECT_ICONS.product,
  shortcut: 'P',
  labelIdentifierStandardId: PRODUCT_STANDARD_FIELD_IDS.name,
})
@WorkspaceIsSearchable()
export class ProductWorkspaceEntity extends BaseWorkspaceEntity {
  @WorkspaceField({
    standardId: PRODUCT_STANDARD_FIELD_IDS.name,
    type: FieldMetadataType.TEXT,
    label: msg`Name`,
    description: msg`The product name`,
    icon: 'IconPackage',
  })
  name: string;

  @WorkspaceField({
    standardId: PRODUCT_STANDARD_FIELD_IDS.code,
    type: FieldMetadataType.TEXT,
    label: msg`Code`,
    description: msg`The product code (SKU)`,
    icon: 'IconHash',
  })
  @WorkspaceIsNullable()
  code: string | null;

  @WorkspaceField({
    standardId: PRODUCT_STANDARD_FIELD_IDS.description,
    type: FieldMetadataType.TEXT,
    label: msg`Description`,
    description: msg`The product description`,
    icon: 'IconFileText',
  })
  @WorkspaceIsNullable()
  description: string | null;

  @WorkspaceField({
    standardId: PRODUCT_STANDARD_FIELD_IDS.enabled,
    type: FieldMetadataType.BOOLEAN,
    label: msg`Enabled`,
    description: msg`Whether the product is enabled`,
    icon: 'IconToggleRight',
    defaultValue: true,
  })
  enabled: boolean;

  @WorkspaceField({
    standardId: PRODUCT_STANDARD_FIELD_IDS.imageUrl,
    type: FieldMetadataType.TEXT,
    label: msg`Image`,
    description: msg`The product image URL`,
    icon: 'IconPhoto',
  })
  @WorkspaceIsNullable()
  imageUrl: string | null;

  // System fields
  @WorkspaceField({
    standardId: PRODUCT_STANDARD_FIELD_IDS.position,
    type: FieldMetadataType.POSITION,
    label: msg`Position`,
    description: msg`Product record position`,
    icon: 'IconHierarchy2',
    defaultValue: 0,
  })
  @WorkspaceIsSystem()
  position: number;

  @WorkspaceField({
    standardId: PRODUCT_STANDARD_FIELD_IDS.createdBy,
    type: FieldMetadataType.ACTOR,
    label: msg`Created by`,
    icon: 'IconCreativeCommonsSa',
    description: msg`The creator of the record`,
  })
  @WorkspaceIsFieldUIReadOnly()
  createdBy: ActorMetadata;

  @WorkspaceField({
    standardId: PRODUCT_STANDARD_FIELD_IDS.searchVector,
    type: FieldMetadataType.TS_VECTOR,
    label: SEARCH_VECTOR_FIELD.label,
    description: SEARCH_VECTOR_FIELD.description,
    icon: 'IconPackage',
    generatedType: 'STORED',
    asExpression: getTsVectorColumnExpressionFromFields(
      SEARCH_FIELDS_FOR_PRODUCT,
    ),
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  @WorkspaceFieldIndex({ indexType: IndexType.GIN })
  searchVector: string;

  // Relations - ProductCategory
  @WorkspaceRelation({
    standardId: PRODUCT_STANDARD_FIELD_IDS.productCategory,
    type: RelationType.MANY_TO_ONE,
    label: msg`Product Category`,
    description: msg`The product category`,
    icon: 'IconCategory',
    inverseSideTarget: () => ProductCategoryWorkspaceEntity,
    inverseSideFieldKey: 'products',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  productCategory: Relation<ProductCategoryWorkspaceEntity> | null;

  @WorkspaceJoinColumn('productCategory')
  productCategoryId: string | null;

  // Relations - ProductOptionGroupLinks (junction to option groups)
  @WorkspaceRelation({
    standardId: PRODUCT_STANDARD_FIELD_IDS.optionGroupLinks,
    type: RelationType.ONE_TO_MANY,
    label: msg`Option Group Links`,
    description: msg`Option groups linked to this product`,
    icon: 'IconBoxMultiple',
    inverseSideTarget: () => ProductOptionGroupLinkWorkspaceEntity,
    inverseSideFieldKey: 'product',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsNullable()
  optionGroupLinks: Relation<ProductOptionGroupLinkWorkspaceEntity[]>;

  // Relations - ProductVariants
  @WorkspaceRelation({
    standardId: PRODUCT_STANDARD_FIELD_IDS.variants,
    type: RelationType.ONE_TO_MANY,
    label: msg`Variants`,
    description: msg`Product variants`,
    icon: 'IconVersions',
    inverseSideTarget: () => ProductVariantWorkspaceEntity,
    inverseSideFieldKey: 'product',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsNullable()
  variants: Relation<ProductVariantWorkspaceEntity[]>;

  @WorkspaceRelation({
    standardId: PRODUCT_STANDARD_FIELD_IDS.timelineActivities,
    type: RelationType.ONE_TO_MANY,
    label: msg`Timeline Activities`,
    description: msg`Timeline activities linked to the product`,
    icon: 'IconIconTimelineEvent',
    inverseSideTarget: () => TimelineActivityWorkspaceEntity,
    inverseSideFieldKey: 'product',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  timelineActivities: Relation<TimelineActivityWorkspaceEntity[]>;
}

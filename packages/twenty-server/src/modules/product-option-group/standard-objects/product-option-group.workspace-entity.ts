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
import { WorkspaceRelation } from 'src/engine/twenty-orm/decorators/workspace-relation.decorator';
import { PRODUCT_OPTION_GROUP_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_ICONS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-icons';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';
import {
  type FieldTypeAndNameMetadata,
  getTsVectorColumnExpressionFromFields,
} from 'src/engine/workspace-manager/workspace-sync-metadata/utils/get-ts-vector-column-expression.util';
import { ProductOptionGroupLinkWorkspaceEntity } from 'src/modules/product-option-group-link/standard-objects/product-option-group-link.workspace-entity';
import { ProductOptionWorkspaceEntity } from 'src/modules/product-option/standard-objects/product-option.workspace-entity';
import { ProductVariantOptionValueWorkspaceEntity } from 'src/modules/product-variant-option-value/standard-objects/product-variant-option-value.workspace-entity';
import { TimelineActivityWorkspaceEntity } from 'src/modules/timeline/standard-objects/timeline-activity.workspace-entity';

const NAME_FIELD_NAME = 'name';

export const SEARCH_FIELDS_FOR_PRODUCT_OPTION_GROUP: FieldTypeAndNameMetadata[] =
  [{ name: NAME_FIELD_NAME, type: FieldMetadataType.TEXT }];

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.productOptionGroup,
  namePlural: 'productOptionGroups',
  labelSingular: msg`Product Option Group`,
  labelPlural: msg`Product Option Groups`,
  description: msg`A global option group (e.g. Color, Size, Material) that can be reused across products`,
  icon: STANDARD_OBJECT_ICONS.productOptionGroup,
  labelIdentifierStandardId: PRODUCT_OPTION_GROUP_STANDARD_FIELD_IDS.name,
})
@WorkspaceIsSearchable()
export class ProductOptionGroupWorkspaceEntity extends BaseWorkspaceEntity {
  @WorkspaceField({
    standardId: PRODUCT_OPTION_GROUP_STANDARD_FIELD_IDS.name,
    type: FieldMetadataType.TEXT,
    label: msg`Name`,
    description: msg`The option group name (e.g. Color, Size, Material)`,
    icon: 'IconBoxMultiple',
  })
  name: string;

  @WorkspaceField({
    standardId: PRODUCT_OPTION_GROUP_STANDARD_FIELD_IDS.isGlobal,
    type: FieldMetadataType.BOOLEAN,
    label: msg`Is Global`,
    description: msg`Whether this option group is globally reusable across products`,
    icon: 'IconWorld',
    defaultValue: true,
  })
  isGlobal: boolean;

  @WorkspaceField({
    standardId: PRODUCT_OPTION_GROUP_STANDARD_FIELD_IDS.inputType,
    type: FieldMetadataType.TEXT,
    label: msg`Input Type`,
    description: msg`Type of input (select, text, textarea, number, url)`,
    icon: 'IconForms',
  })
  inputType: string | null;

  @WorkspaceField({
    standardId: PRODUCT_OPTION_GROUP_STANDARD_FIELD_IDS.validationRules,
    type: FieldMetadataType.RAW_JSON,
    label: msg`Validation Rules`,
    description: msg`JSON validation rules for this option group`,
    icon: 'IconShieldCheck',
  })
  @WorkspaceIsNullable()
  validationRules: object | null;

  // System fields
  @WorkspaceField({
    standardId: PRODUCT_OPTION_GROUP_STANDARD_FIELD_IDS.position,
    type: FieldMetadataType.POSITION,
    label: msg`Position`,
    description: msg`Product option group record position`,
    icon: 'IconHierarchy2',
    defaultValue: 0,
  })
  @WorkspaceIsSystem()
  position: number;

  @WorkspaceField({
    standardId: PRODUCT_OPTION_GROUP_STANDARD_FIELD_IDS.createdBy,
    type: FieldMetadataType.ACTOR,
    label: msg`Created by`,
    icon: 'IconCreativeCommonsSa',
    description: msg`The creator of the record`,
  })
  @WorkspaceIsFieldUIReadOnly()
  createdBy: ActorMetadata;

  @WorkspaceField({
    standardId: PRODUCT_OPTION_GROUP_STANDARD_FIELD_IDS.searchVector,
    type: FieldMetadataType.TS_VECTOR,
    label: SEARCH_VECTOR_FIELD.label,
    description: SEARCH_VECTOR_FIELD.description,
    icon: 'IconBoxMultiple',
    generatedType: 'STORED',
    asExpression: getTsVectorColumnExpressionFromFields(
      SEARCH_FIELDS_FOR_PRODUCT_OPTION_GROUP,
    ),
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  @WorkspaceFieldIndex({ indexType: IndexType.GIN })
  searchVector: string;

  // Relations - ProductOptionGroupLinks (junction to products)
  @WorkspaceRelation({
    standardId: PRODUCT_OPTION_GROUP_STANDARD_FIELD_IDS.productLinks,
    type: RelationType.ONE_TO_MANY,
    label: msg`Product Links`,
    description: msg`Products using this option group`,
    icon: 'IconPackage',
    inverseSideTarget: () => ProductOptionGroupLinkWorkspaceEntity,
    inverseSideFieldKey: 'optionGroup',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsNullable()
  productLinks: Relation<ProductOptionGroupLinkWorkspaceEntity[]>;

  // Relations - ProductOptions
  @WorkspaceRelation({
    standardId: PRODUCT_OPTION_GROUP_STANDARD_FIELD_IDS.options,
    type: RelationType.ONE_TO_MANY,
    label: msg`Options`,
    description: msg`Predefined options in this group (only for select type)`,
    icon: 'IconAdjustments',
    inverseSideTarget: () => ProductOptionWorkspaceEntity,
    inverseSideFieldKey: 'group',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsNullable()
  options: Relation<ProductOptionWorkspaceEntity[]>;

  // Relations - ProductVariantOptionValues
  @WorkspaceRelation({
    standardId: PRODUCT_OPTION_GROUP_STANDARD_FIELD_IDS.variantOptionValues,
    type: RelationType.ONE_TO_MANY,
    label: msg`Variant Option Values`,
    description: msg`Option values assigned to product variants`,
    icon: 'IconList',
    inverseSideTarget: () => ProductVariantOptionValueWorkspaceEntity,
    inverseSideFieldKey: 'optionGroup',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsNullable()
  variantOptionValues: Relation<ProductVariantOptionValueWorkspaceEntity[]>;

  @WorkspaceRelation({
    standardId: PRODUCT_OPTION_GROUP_STANDARD_FIELD_IDS.timelineActivities,
    type: RelationType.ONE_TO_MANY,
    label: msg`Timeline Activities`,
    description: msg`Timeline activities linked to the product option group`,
    icon: 'IconIconTimelineEvent',
    inverseSideTarget: () => TimelineActivityWorkspaceEntity,
    inverseSideFieldKey: 'productOptionGroup',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  timelineActivities: Relation<TimelineActivityWorkspaceEntity[]>;
}

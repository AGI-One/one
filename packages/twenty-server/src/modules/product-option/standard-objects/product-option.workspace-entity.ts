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
import { PRODUCT_OPTION_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_ICONS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-icons';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';
import {
  type FieldTypeAndNameMetadata,
  getTsVectorColumnExpressionFromFields,
} from 'src/engine/workspace-manager/workspace-sync-metadata/utils/get-ts-vector-column-expression.util';
import { ProductOptionGroupWorkspaceEntity } from 'src/modules/product-option-group/standard-objects/product-option-group.workspace-entity';
import { ProductVariantOptionValueWorkspaceEntity } from 'src/modules/product-variant-option-value/standard-objects/product-variant-option-value.workspace-entity';
import { TimelineActivityWorkspaceEntity } from 'src/modules/timeline/standard-objects/timeline-activity.workspace-entity';

const NAME_FIELD_NAME = 'name';
const CODE_FIELD_NAME = 'code';

export const SEARCH_FIELDS_FOR_PRODUCT_OPTION: FieldTypeAndNameMetadata[] = [
  { name: NAME_FIELD_NAME, type: FieldMetadataType.TEXT },
  { name: CODE_FIELD_NAME, type: FieldMetadataType.TEXT },
];

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.productOption,
  namePlural: 'productOptions',
  labelSingular: msg`Product Option`,
  labelPlural: msg`Product Options`,
  description: msg`A product option (e.g. Red, Blue, Small, Large)`,
  icon: STANDARD_OBJECT_ICONS.productOption,
  labelIdentifierStandardId: PRODUCT_OPTION_STANDARD_FIELD_IDS.name,
})
@WorkspaceIsSearchable()
export class ProductOptionWorkspaceEntity extends BaseWorkspaceEntity {
  @WorkspaceField({
    standardId: PRODUCT_OPTION_STANDARD_FIELD_IDS.name,
    type: FieldMetadataType.TEXT,
    label: msg`Name`,
    description: msg`The option name (e.g. Red, Small, Cotton)`,
    icon: 'IconAdjustments',
  })
  name: string;

  @WorkspaceField({
    standardId: PRODUCT_OPTION_STANDARD_FIELD_IDS.code,
    type: FieldMetadataType.TEXT,
    label: msg`Code`,
    description: msg`The option code`,
    icon: 'IconHash',
  })
  @WorkspaceIsNullable()
  code: string | null;

  // System fields
  @WorkspaceField({
    standardId: PRODUCT_OPTION_STANDARD_FIELD_IDS.position,
    type: FieldMetadataType.POSITION,
    label: msg`Position`,
    description: msg`Product option record position`,
    icon: 'IconHierarchy2',
    defaultValue: 0,
  })
  @WorkspaceIsSystem()
  position: number;

  @WorkspaceField({
    standardId: PRODUCT_OPTION_STANDARD_FIELD_IDS.createdBy,
    type: FieldMetadataType.ACTOR,
    label: msg`Created by`,
    icon: 'IconCreativeCommonsSa',
    description: msg`The creator of the record`,
  })
  @WorkspaceIsFieldUIReadOnly()
  createdBy: ActorMetadata;

  @WorkspaceField({
    standardId: PRODUCT_OPTION_STANDARD_FIELD_IDS.searchVector,
    type: FieldMetadataType.TS_VECTOR,
    label: SEARCH_VECTOR_FIELD.label,
    description: SEARCH_VECTOR_FIELD.description,
    icon: 'IconAdjustments',
    generatedType: 'STORED',
    asExpression: getTsVectorColumnExpressionFromFields(
      SEARCH_FIELDS_FOR_PRODUCT_OPTION,
    ),
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  @WorkspaceFieldIndex({ indexType: IndexType.GIN })
  searchVector: string;

  // Relations - ProductOptionGroup
  @WorkspaceRelation({
    standardId: PRODUCT_OPTION_STANDARD_FIELD_IDS.group,
    type: RelationType.MANY_TO_ONE,
    label: msg`Option Group`,
    description: msg`The option group this option belongs to`,
    icon: 'IconBoxMultiple',
    inverseSideTarget: () => ProductOptionGroupWorkspaceEntity,
    inverseSideFieldKey: 'options',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsNullable()
  group: Relation<ProductOptionGroupWorkspaceEntity> | null;

  @WorkspaceJoinColumn('group')
  groupId: string | null;

  // Relations - ProductVariantOptionValues
  @WorkspaceRelation({
    standardId: PRODUCT_OPTION_STANDARD_FIELD_IDS.variantOptionValues,
    type: RelationType.ONE_TO_MANY,
    label: msg`Variant Option Values`,
    description: msg`Values assigned to product variants using this option`,
    icon: 'IconList',
    inverseSideTarget: () => ProductVariantOptionValueWorkspaceEntity,
    inverseSideFieldKey: 'option',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsNullable()
  variantOptionValues: Relation<ProductVariantOptionValueWorkspaceEntity[]>;

  @WorkspaceRelation({
    standardId: PRODUCT_OPTION_STANDARD_FIELD_IDS.timelineActivities,
    type: RelationType.ONE_TO_MANY,
    label: msg`Timeline Activities`,
    description: msg`Timeline activities linked to the product option`,
    icon: 'IconIconTimelineEvent',
    inverseSideTarget: () => TimelineActivityWorkspaceEntity,
    inverseSideFieldKey: 'productOption',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  timelineActivities: Relation<TimelineActivityWorkspaceEntity[]>;
}

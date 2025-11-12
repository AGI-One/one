import { msg } from '@lingui/core/macro';
import {
    ActorMetadata,
    FieldMetadataType,
    RelationOnDeleteAction,
    type CurrencyMetadata,
} from 'twenty-shared/types';

import { RelationType } from 'src/engine/metadata-modules/field-metadata/interfaces/relation-type.interface';
import { Relation } from 'src/engine/workspace-manager/workspace-sync-metadata/interfaces/relation.interface';

import { SEARCH_VECTOR_FIELD } from 'src/engine/metadata-modules/constants/search-vector-field.constants';
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
import { MATERIAL_PRICE_HISTORY_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_ICONS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-icons';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';
import {
    getTsVectorColumnExpressionFromFields,
    type FieldTypeAndNameMetadata,
} from 'src/engine/workspace-manager/workspace-sync-metadata/utils/get-ts-vector-column-expression.util';
// Import related entities
import { WorkspaceJoinColumn } from 'src/engine/twenty-orm/decorators/workspace-join-column.decorator';
import { MaterialPriceWorkspaceEntity } from 'src/modules/material-price/standard-objects/material-price.workspace-entity';
import { TimelineActivityWorkspaceEntity } from 'src/modules/timeline/standard-objects/timeline-activity.workspace-entity';

// Search fields definition
const REASON_FIELD_NAME = 'reason';
const CHANGED_BY_FIELD_NAME = 'changedBy';

export const SEARCH_FIELDS_FOR_MATERIAL_PRICE_HISTORY: FieldTypeAndNameMetadata[] =
  [
    { name: REASON_FIELD_NAME, type: FieldMetadataType.TEXT },
    { name: CHANGED_BY_FIELD_NAME, type: FieldMetadataType.TEXT },
  ];

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.materialPriceHistory,
  namePlural: 'materialPriceHistories',
  labelSingular: msg`Material Price History`,
  labelPlural: msg`Material Price Histories`,
  description: msg`Material price change history`,
  icon: STANDARD_OBJECT_ICONS.materialPriceHistory,
  labelIdentifierStandardId:
    MATERIAL_PRICE_HISTORY_STANDARD_FIELD_IDS.changedBy,
})
@WorkspaceIsSearchable()
export class MaterialPriceHistoryWorkspaceEntity extends BaseWorkspaceEntity {
  // Relations - MaterialPrice (required)
  @WorkspaceRelation({
    standardId: MATERIAL_PRICE_HISTORY_STANDARD_FIELD_IDS.materialPrice,
    type: RelationType.MANY_TO_ONE,
    label: msg`Material Price`,
    description: msg`Material price being tracked`,
    icon: 'IconCurrencyDollar',
    inverseSideTarget: () => MaterialPriceWorkspaceEntity,
    inverseSideFieldKey: 'materialPriceHistories',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  materialPrice: Relation<MaterialPriceWorkspaceEntity>;

  @WorkspaceJoinColumn('materialPrice')
  materialPriceId: string;
  // Price Change Fields
  @WorkspaceField({
    standardId: MATERIAL_PRICE_HISTORY_STANDARD_FIELD_IDS.oldPrice,
    type: FieldMetadataType.CURRENCY,
    label: msg`Old Price`,
    description: msg`Previous price`,
    icon: 'IconCurrencyDollar',
  })
  @WorkspaceIsNullable()
  oldPrice: CurrencyMetadata | null;

  @WorkspaceField({
    standardId: MATERIAL_PRICE_HISTORY_STANDARD_FIELD_IDS.newPrice,
    type: FieldMetadataType.CURRENCY,
    label: msg`New Price`,
    description: msg`New price`,
    icon: 'IconCurrencyDollar',
  })
  @WorkspaceIsNullable()
  newPrice: CurrencyMetadata | null;

  // Audit Fields
  @WorkspaceField({
    standardId: MATERIAL_PRICE_HISTORY_STANDARD_FIELD_IDS.changedAt,
    type: FieldMetadataType.DATE_TIME,
    label: msg`Changed At`,
    description: msg`Time of price change`,
    icon: 'IconCalendar',
  })
  @WorkspaceIsNullable()
  changedAt: Date | null;

  @WorkspaceField({
    standardId: MATERIAL_PRICE_HISTORY_STANDARD_FIELD_IDS.changedBy,
    type: FieldMetadataType.TEXT,
    label: msg`Changed By`,
    description: msg`Person who changed the price`,
    icon: 'IconUser',
  })
  @WorkspaceIsNullable()
  changedBy: string | null;

  @WorkspaceField({
    standardId: MATERIAL_PRICE_HISTORY_STANDARD_FIELD_IDS.fileId,
    type: FieldMetadataType.TEXT,
    label: msg`File ID`,
    description: msg`Related file ID`,
    icon: 'IconFile',
  })
  @WorkspaceIsNullable()
  fileId: string | null;

  @WorkspaceField({
    standardId: MATERIAL_PRICE_HISTORY_STANDARD_FIELD_IDS.reason,
    type: FieldMetadataType.TEXT,
    label: msg`Reason`,
    description: msg`Reason for price change`,
    icon: 'IconNotes',
  })
  @WorkspaceIsNullable()
  reason: string | null;

  // System Fields - REQUIRED
  @WorkspaceField({
    standardId: MATERIAL_PRICE_HISTORY_STANDARD_FIELD_IDS.position,
    type: FieldMetadataType.POSITION,
    label: msg`Position`,
    description: msg`Material price history record position`,
    icon: 'IconHierarchy2',
    defaultValue: 0,
  })
  @WorkspaceIsSystem()
  position: number;

  @WorkspaceField({
    standardId: MATERIAL_PRICE_HISTORY_STANDARD_FIELD_IDS.createdBy,
    type: FieldMetadataType.ACTOR,
    label: msg`Created by`,
    icon: 'IconCreativeCommonsSa',
    description: msg`The creator of the record`,
  })
  @WorkspaceIsFieldUIReadOnly()
  createdBy: ActorMetadata;

  // Timeline Activities - System field
  @WorkspaceRelation({
    standardId: MATERIAL_PRICE_HISTORY_STANDARD_FIELD_IDS.timelineActivities,
    type: RelationType.ONE_TO_MANY,
    label: msg`Timeline Activities`,
    description: msg`Timeline Activities linked to the price history`,
    icon: 'IconTimelineEvent',
    inverseSideTarget: () => TimelineActivityWorkspaceEntity,
    inverseSideFieldKey: 'materialPriceHistory',
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  timelineActivities: Relation<TimelineActivityWorkspaceEntity[]>;

  // Search Vector - REQUIRED for searchable entities
  @WorkspaceField({
    standardId: MATERIAL_PRICE_HISTORY_STANDARD_FIELD_IDS.searchVector,
    type: FieldMetadataType.TS_VECTOR,
    label: SEARCH_VECTOR_FIELD.label,
    description: SEARCH_VECTOR_FIELD.description,
    icon: 'IconSearch',
    generatedType: 'STORED',
    asExpression: getTsVectorColumnExpressionFromFields(
      SEARCH_FIELDS_FOR_MATERIAL_PRICE_HISTORY,
    ),
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  @WorkspaceFieldIndex({ indexType: IndexType.GIN })
  searchVector: string;
}

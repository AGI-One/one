import { msg } from '@lingui/core/macro';
import { ActorMetadata, FieldMetadataType } from 'twenty-shared/types';

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
import { MANUFACTURER_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_ICONS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-icons';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';
import {
    type FieldTypeAndNameMetadata,
    getTsVectorColumnExpressionFromFields,
} from 'src/engine/workspace-manager/workspace-sync-metadata/utils/get-ts-vector-column-expression.util';
// Import related entities
import { BoQWorkspaceEntity } from 'src/modules/boq/standard-objects/boq.workspace-entity';
import { MaterialApprovalWorkspaceEntity } from 'src/modules/material-approval/standard-objects/material-approval.workspace-entity';
import { MaterialGroupWorkspaceEntity } from 'src/modules/material-group/standard-objects/material-group.workspace-entity';
import { MaterialPriceWorkspaceEntity } from 'src/modules/material-price/standard-objects/material-price.workspace-entity';
import { MaterialRequestWorkspaceEntity } from 'src/modules/material-request/standard-objects/material-request.workspace-entity';
import { TimelineActivityWorkspaceEntity } from 'src/modules/timeline/standard-objects/timeline-activity.workspace-entity';

// Search fields definition
const MANUFACTURER_CODE_FIELD_NAME = 'manufacturerCode';
const MANUFACTURER_NAME_FIELD_NAME = 'manufacturerName';

export const SEARCH_FIELDS_FOR_MANUFACTURER: FieldTypeAndNameMetadata[] = [
  { name: MANUFACTURER_CODE_FIELD_NAME, type: FieldMetadataType.TEXT },
  { name: MANUFACTURER_NAME_FIELD_NAME, type: FieldMetadataType.TEXT },
];

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.manufacturer,
  namePlural: 'manufacturers',
  labelSingular: msg`Manufacturer`,
  labelPlural: msg`Manufacturers`,
  description: msg`Manufacturer management`,
  icon: STANDARD_OBJECT_ICONS.manufacturer,
  shortcut: 'M',
  labelIdentifierStandardId: MANUFACTURER_STANDARD_FIELD_IDS.manufacturerName,
})
@WorkspaceIsSearchable()
export class ManufacturerWorkspaceEntity extends BaseWorkspaceEntity {
  // Business Fields
  @WorkspaceField({
    standardId: MANUFACTURER_STANDARD_FIELD_IDS.manufacturerCode,
    type: FieldMetadataType.TEXT,
    label: msg`Manufacturer Code`,
    description: msg`Unique identifier for the manufacturer`,
    icon: 'IconCode',
  })
  manufacturerCode: string;

  @WorkspaceField({
    standardId: MANUFACTURER_STANDARD_FIELD_IDS.manufacturerName,
    type: FieldMetadataType.TEXT,
    label: msg`Manufacturer Name`,
    description: msg`Full name of the manufacturer`,
    icon: 'IconBuildingFactory2',
  })
  manufacturerName: string;

  @WorkspaceField({
    standardId: MANUFACTURER_STANDARD_FIELD_IDS.materialName,
    type: FieldMetadataType.TEXT,
    label: msg`Material Name`,
    description: msg`Main material name provided by the manufacturer`,
    icon: 'IconBox',
  })
  @WorkspaceIsNullable()
  materialName: string | null;

  @WorkspaceField({
    standardId: MANUFACTURER_STANDARD_FIELD_IDS.note,
    type: FieldMetadataType.TEXT,
    label: msg`Note`,
    description: msg`Additional information about the manufacturer`,
    icon: 'IconNotes',
  })
  @WorkspaceIsNullable()
  note: string | null;

  // Relations
  @WorkspaceRelation({
    standardId: MANUFACTURER_STANDARD_FIELD_IDS.materialGroups,
    type: RelationType.ONE_TO_MANY,
    label: msg`Material Groups`,
    description: msg`Material groups produced by this manufacturer`,
    icon: 'IconCategory2',
    inverseSideTarget: () => MaterialGroupWorkspaceEntity,
    inverseSideFieldKey: 'manufacturer',
  })
  materialGroups: Relation<MaterialGroupWorkspaceEntity[]>;

  // System Fields
  @WorkspaceField({
    standardId: MANUFACTURER_STANDARD_FIELD_IDS.position,
    type: FieldMetadataType.POSITION,
    label: msg`Position`,
    description: msg`Position`,
    icon: 'IconHierarchy2',
  })
  @WorkspaceIsSystem()
  @WorkspaceIsNullable()
  position: number | null;

  @WorkspaceField({
    standardId: MANUFACTURER_STANDARD_FIELD_IDS.createdBy,
    type: FieldMetadataType.ACTOR,
    label: msg`Created by`,
    icon: 'IconCreativeCommonsSa',
    description: msg`The creator of the record`,
  })
  @WorkspaceIsSystem()
  @WorkspaceIsNullable()
  @WorkspaceIsFieldUIReadOnly()
  createdBy: ActorMetadata | null;

  @WorkspaceRelation({
    standardId: MANUFACTURER_STANDARD_FIELD_IDS.materialPrices,
    type: RelationType.ONE_TO_MANY,
    label: msg`Material Prices`,
    description: msg`Material prices from this manufacturer`,
    icon: 'IconCurrencyDollar',
    inverseSideTarget: () => MaterialPriceWorkspaceEntity,
    inverseSideFieldKey: 'manufacturer',
  })
  @WorkspaceIsNullable()
  materialPrices: Relation<MaterialPriceWorkspaceEntity[]>;

  @WorkspaceRelation({
    standardId: MANUFACTURER_STANDARD_FIELD_IDS.materialRequests,
    type: RelationType.ONE_TO_MANY,
    label: msg`Material Requests`,
    description: msg`Material requests for this manufacturer`,
    icon: 'IconFileText',
    inverseSideTarget: () => MaterialRequestWorkspaceEntity,
    inverseSideFieldKey: 'manufacturer',
  })
  @WorkspaceIsNullable()
  materialRequests: Relation<MaterialRequestWorkspaceEntity[]>;

  @WorkspaceRelation({
    standardId: MANUFACTURER_STANDARD_FIELD_IDS.materialApprovals,
    type: RelationType.ONE_TO_MANY,
    label: msg`Material Approvals`,
    description: msg`Material approvals for this manufacturer`,
    icon: 'IconCircleCheck',
    inverseSideTarget: () => MaterialApprovalWorkspaceEntity,
    inverseSideFieldKey: 'manufacturer',
  })
  @WorkspaceIsNullable()
  materialApprovals: Relation<MaterialApprovalWorkspaceEntity[]>;

  @WorkspaceRelation({
    standardId: MANUFACTURER_STANDARD_FIELD_IDS.boqs,
    type: RelationType.ONE_TO_MANY,
    label: msg`BoQs`,
    description: msg`Bills of quantities for this manufacturer`,
    icon: 'IconListNumbers',
    inverseSideTarget: () => BoQWorkspaceEntity,
    inverseSideFieldKey: 'manufacturer',
  })
  @WorkspaceIsNullable()
  boqs: Relation<BoQWorkspaceEntity[]>;

  @WorkspaceRelation({
    standardId: MANUFACTURER_STANDARD_FIELD_IDS.timelineActivities,
    type: RelationType.ONE_TO_MANY,
    label: msg`Timeline Activities`,
    description: msg`Timeline Activities linked to the manufacturer`,
    icon: 'IconTimelineEvent',
    inverseSideTarget: () => TimelineActivityWorkspaceEntity,
    inverseSideFieldKey: 'manufacturer',
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  timelineActivities: Relation<TimelineActivityWorkspaceEntity[]>;

  @WorkspaceField({
    standardId: MANUFACTURER_STANDARD_FIELD_IDS.searchVector,
    type: FieldMetadataType.TS_VECTOR,
    label: SEARCH_VECTOR_FIELD.label,
    description: SEARCH_VECTOR_FIELD.description,
    icon: 'IconSearch',
    generatedType: 'STORED',
    asExpression: getTsVectorColumnExpressionFromFields(
      SEARCH_FIELDS_FOR_MANUFACTURER,
    ),
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  @WorkspaceFieldIndex({ indexType: IndexType.GIN })
  searchVector: string;
}

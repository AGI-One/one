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
import { BOQ_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_ICONS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-icons';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';
import {
  getTsVectorColumnExpressionFromFields,
  type FieldTypeAndNameMetadata,
} from 'src/engine/workspace-manager/workspace-sync-metadata/utils/get-ts-vector-column-expression.util';
// Import related entities
import { WorkspaceJoinColumn } from 'src/engine/twenty-orm/decorators/workspace-join-column.decorator';
import { ManufacturerWorkspaceEntity } from 'src/modules/manufacturer/standard-objects/manufacturer.workspace-entity';
import { MaterialWorkspaceEntity } from 'src/modules/material/standard-objects/material.workspace-entity';
import { ProjectWorkspaceEntity } from 'src/modules/project/standard-objects/project.workspace-entity';
import { TimelineActivityWorkspaceEntity } from 'src/modules/timeline/standard-objects/timeline-activity.workspace-entity';

enum BOQType {
  DRAFT = 'draft',
  ACTUAL = 'actual',
  TENDER = 'tender',
}

// Search fields definition
const TITLE_FIELD_NAME = 'title';
const DESCRIPTION_FIELD_NAME = 'description';
const NOTE_FIELD_NAME = 'note';

export const SEARCH_FIELDS_FOR_BOQ: FieldTypeAndNameMetadata[] = [
  { name: TITLE_FIELD_NAME, type: FieldMetadataType.TEXT },
  { name: DESCRIPTION_FIELD_NAME, type: FieldMetadataType.TEXT },
  { name: NOTE_FIELD_NAME, type: FieldMetadataType.TEXT },
];

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.boq,
  namePlural: 'boqs',
  labelSingular: msg`BoQ`,
  labelPlural: msg`BoQs`,
  description: msg`Bill of Quantities management`,
  icon: STANDARD_OBJECT_ICONS.boq,
  labelIdentifierStandardId: BOQ_STANDARD_FIELD_IDS.title,
})
@WorkspaceIsSearchable()
export class BoQWorkspaceEntity extends BaseWorkspaceEntity {
  // Basic Information
  @WorkspaceField({
    standardId: BOQ_STANDARD_FIELD_IDS.classification,
    type: FieldMetadataType.TEXT,
    label: msg`Classification`,
    description: msg`BoQ classification`,
    icon: 'IconCategory',
    defaultValue: "''",
  })
  @WorkspaceIsNullable()
  classification: string | null;

  @WorkspaceField({
    standardId: BOQ_STANDARD_FIELD_IDS.type,
    type: FieldMetadataType.SELECT,
    label: msg`Type`,
    description: msg`BoQ type: draft/actual/tender`,
    icon: 'IconTag',
    options: [
      { value: BOQType.DRAFT, label: 'Draft', position: 0, color: 'gray' },
      { value: BOQType.ACTUAL, label: 'Actual', position: 1, color: 'green' },
      { value: BOQType.TENDER, label: 'Tender', position: 2, color: 'blue' },
    ],
    defaultValue: `'${BOQType.ACTUAL}'`,
  })
  @WorkspaceIsNullable()
  type: string | null;

  // Relations - Material (optional)
  @WorkspaceRelation({
    standardId: BOQ_STANDARD_FIELD_IDS.material,
    type: RelationType.MANY_TO_ONE,
    label: msg`Material`,
    description: msg`Material in BoQ`,
    icon: 'IconBox',
    inverseSideTarget: () => MaterialWorkspaceEntity,
    inverseSideFieldKey: 'boqs',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  material: Relation<MaterialWorkspaceEntity> | null;

  @WorkspaceJoinColumn('material')
  materialId: string | null;

  // Relations - Project (required)
  @WorkspaceRelation({
    standardId: BOQ_STANDARD_FIELD_IDS.project,
    type: RelationType.MANY_TO_ONE,
    label: msg`Project`,
    description: msg`Project for this BoQ`,
    icon: 'IconBriefcase',
    inverseSideTarget: () => ProjectWorkspaceEntity,
    inverseSideFieldKey: 'boqs',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  project: Relation<ProjectWorkspaceEntity>;

  @WorkspaceJoinColumn('project')
  projectId: string;

  @WorkspaceField({
    standardId: BOQ_STANDARD_FIELD_IDS.description,
    type: FieldMetadataType.TEXT,
    label: msg`Description`,
    description: msg`Description`,
    icon: 'IconNotes',
  })
  @WorkspaceIsNullable()
  description: string | null;

  @WorkspaceField({
    standardId: BOQ_STANDARD_FIELD_IDS.technicalSpecs,
    type: FieldMetadataType.TEXT,
    label: msg`Technical Specs`,
    description: msg`Technical specifications`,
    icon: 'IconFileText',
  })
  @WorkspaceIsNullable()
  technicalSpecs: string | null;

  @WorkspaceField({
    standardId: BOQ_STANDARD_FIELD_IDS.model,
    type: FieldMetadataType.TEXT,
    label: msg`Model`,
    description: msg`Model`,
    icon: 'IconTag',
  })
  @WorkspaceIsNullable()
  model: string | null;

  @WorkspaceField({
    standardId: BOQ_STANDARD_FIELD_IDS.image,
    type: FieldMetadataType.TEXT,
    label: msg`Image`,
    description: msg`Image URL`,
    icon: 'IconPhoto',
  })
  @WorkspaceIsNullable()
  image: string | null;

  @WorkspaceField({
    standardId: BOQ_STANDARD_FIELD_IDS.unit,
    type: FieldMetadataType.TEXT,
    label: msg`Unit`,
    description: msg`Unit of measurement`,
    icon: 'IconRuler',
  })
  @WorkspaceIsNullable()
  unit: string | null;

  // Relations - Manufacturer (optional)
  @WorkspaceRelation({
    standardId: BOQ_STANDARD_FIELD_IDS.manufacturer,
    type: RelationType.MANY_TO_ONE,
    label: msg`Manufacturer`,
    description: msg`Manufacturer`,
    icon: 'IconBuildingFactory2',
    inverseSideTarget: () => ManufacturerWorkspaceEntity,
    inverseSideFieldKey: 'boqs',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  manufacturer: Relation<ManufacturerWorkspaceEntity> | null;

  @WorkspaceJoinColumn('manufacturer')
  manufacturerId: string | null;

  @WorkspaceField({
    standardId: BOQ_STANDARD_FIELD_IDS.origin,
    type: FieldMetadataType.TEXT,
    label: msg`Origin`,
    description: msg`Origin`,
    icon: 'IconWorld',
  })
  @WorkspaceIsNullable()
  origin: string | null;

  // Quantity and Pricing
  @WorkspaceField({
    standardId: BOQ_STANDARD_FIELD_IDS.quantity,
    type: FieldMetadataType.NUMBER,
    label: msg`Quantity`,
    description: msg`Quantity`,
    icon: 'IconNumber',
    defaultValue: 0,
  })
  @WorkspaceIsNullable()
  quantity: number | null;

  @WorkspaceField({
    standardId: BOQ_STANDARD_FIELD_IDS.unitPrice,
    type: FieldMetadataType.CURRENCY,
    label: msg`Unit Price`,
    description: msg`Unit price`,
    icon: 'IconCurrencyDollar',
  })
  @WorkspaceIsNullable()
  unitPrice: CurrencyMetadata | null;

  @WorkspaceField({
    standardId: BOQ_STANDARD_FIELD_IDS.laborCost,
    type: FieldMetadataType.CURRENCY,
    label: msg`Labor Cost`,
    description: msg`Labor cost`,
    icon: 'IconUserDollar',
  })
  @WorkspaceIsNullable()
  laborCost: CurrencyMetadata | null;

  @WorkspaceField({
    standardId: BOQ_STANDARD_FIELD_IDS.materialTotalPrice,
    type: FieldMetadataType.CURRENCY,
    label: msg`Material Total Price`,
    description: msg`Material total price`,
    icon: 'IconCurrencyDollar',
  })
  @WorkspaceIsNullable()
  materialTotalPrice: CurrencyMetadata | null;

  @WorkspaceField({
    standardId: BOQ_STANDARD_FIELD_IDS.laborTotalPrice,
    type: FieldMetadataType.CURRENCY,
    label: msg`Labor Total Price`,
    description: msg`Labor total price`,
    icon: 'IconUserDollar',
  })
  @WorkspaceIsNullable()
  laborTotalPrice: CurrencyMetadata | null;

  @WorkspaceField({
    standardId: BOQ_STANDARD_FIELD_IDS.totalPrice,
    type: FieldMetadataType.CURRENCY,
    label: msg`Total Price`,
    description: msg`Total price`,
    icon: 'IconCurrencyDollar',
  })
  @WorkspaceIsNullable()
  totalPrice: CurrencyMetadata | null;

  @WorkspaceField({
    standardId: BOQ_STANDARD_FIELD_IDS.amount,
    type: FieldMetadataType.CURRENCY,
    label: msg`Amount`,
    description: msg`Amount`,
    icon: 'IconCurrencyDollar',
  })
  @WorkspaceIsNullable()
  amount: CurrencyMetadata | null;

  @WorkspaceField({
    standardId: BOQ_STANDARD_FIELD_IDS.note,
    type: FieldMetadataType.TEXT,
    label: msg`Note`,
    description: msg`Notes`,
    icon: 'IconNotes',
  })
  @WorkspaceIsNullable()
  note: string | null;

  @WorkspaceField({
    standardId: BOQ_STANDARD_FIELD_IDS.title,
    type: FieldMetadataType.TEXT,
    label: msg`Title`,
    description: msg`Title`,
    icon: 'IconFileText',
  })
  @WorkspaceIsNullable()
  title: string | null;

  @WorkspaceField({
    standardId: BOQ_STANDARD_FIELD_IDS.brand,
    type: FieldMetadataType.TEXT,
    label: msg`Brand`,
    description: msg`Brand`,
    icon: 'IconTag',
  })
  @WorkspaceIsNullable()
  brand: string | null;

  @WorkspaceField({
    standardId: BOQ_STANDARD_FIELD_IDS.parentId,
    type: FieldMetadataType.TEXT,
    label: msg`Parent ID`,
    description: msg`Parent BoQ item ID for manual hierarchy handling`,
    icon: 'IconHierarchy',
  })
  @WorkspaceIsNullable()
  parentId: string | null;

  // System Fields - REQUIRED
  @WorkspaceField({
    standardId: BOQ_STANDARD_FIELD_IDS.position,
    type: FieldMetadataType.POSITION,
    label: msg`Position`,
    description: msg`BoQ record position`,
    icon: 'IconHierarchy2',
    defaultValue: 0,
  })
  @WorkspaceIsSystem()
  position: number;

  @WorkspaceField({
    standardId: BOQ_STANDARD_FIELD_IDS.createdBy,
    type: FieldMetadataType.ACTOR,
    label: msg`Created by`,
    icon: 'IconCreativeCommonsSa',
    description: msg`The creator of the record`,
  })
  @WorkspaceIsFieldUIReadOnly()
  createdBy: ActorMetadata;

  // Timeline Activities - System field
  @WorkspaceRelation({
    standardId: BOQ_STANDARD_FIELD_IDS.timelineActivities,
    type: RelationType.ONE_TO_MANY,
    label: msg`Timeline Activities`,
    description: msg`Timeline Activities linked to the BoQ`,
    icon: 'IconTimelineEvent',
    inverseSideTarget: () => TimelineActivityWorkspaceEntity,
    inverseSideFieldKey: 'boq',
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  timelineActivities: Relation<TimelineActivityWorkspaceEntity[]>;

  // Search Vector - REQUIRED for searchable entities
  @WorkspaceField({
    standardId: BOQ_STANDARD_FIELD_IDS.searchVector,
    type: FieldMetadataType.TS_VECTOR,
    label: SEARCH_VECTOR_FIELD.label,
    description: SEARCH_VECTOR_FIELD.description,
    icon: 'IconSearch',
    generatedType: 'STORED',
    asExpression: getTsVectorColumnExpressionFromFields(SEARCH_FIELDS_FOR_BOQ),
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  @WorkspaceFieldIndex({ indexType: IndexType.GIN })
  searchVector: string;
}

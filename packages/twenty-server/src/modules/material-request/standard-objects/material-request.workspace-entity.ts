import { msg } from '@lingui/core/macro';
import {
    ActorMetadata,
    FieldMetadataType,
    RelationOnDeleteAction,
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
import { MATERIAL_REQUEST_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_ICONS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-icons';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';
import {
    type FieldTypeAndNameMetadata,
    getTsVectorColumnExpressionFromFields,
} from 'src/engine/workspace-manager/workspace-sync-metadata/utils/get-ts-vector-column-expression.util';
// Import related entities
import { WorkspaceJoinColumn } from 'src/engine/twenty-orm/decorators/workspace-join-column.decorator';
import { ManufacturerWorkspaceEntity } from 'src/modules/manufacturer/standard-objects/manufacturer.workspace-entity';
import { MaterialPurchaseRequestWorkspaceEntity } from 'src/modules/material-purchase-request/standard-objects/material-purchase-request.workspace-entity';
import { MaterialWorkspaceEntity } from 'src/modules/material/standard-objects/material.workspace-entity';
import { ProjectWorkspaceEntity } from 'src/modules/project/standard-objects/project.workspace-entity';
import { TimelineActivityWorkspaceEntity } from 'src/modules/timeline/standard-objects/timeline-activity.workspace-entity';

enum MaterialRequestStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

// Search fields definition
const MATERIAL_REQUEST_CODE_FIELD_NAME = 'materialRequestCode';
const REQUEST_NAME_FIELD_NAME = 'requestName';
const MATERIAL_NAME_FIELD_NAME = 'materialName';
const NOTE_FIELD_NAME = 'note';

export const SEARCH_FIELDS_FOR_MATERIAL_REQUEST: FieldTypeAndNameMetadata[] = [
  { name: MATERIAL_REQUEST_CODE_FIELD_NAME, type: FieldMetadataType.TEXT },
  { name: REQUEST_NAME_FIELD_NAME, type: FieldMetadataType.TEXT },
  { name: MATERIAL_NAME_FIELD_NAME, type: FieldMetadataType.TEXT },
  { name: NOTE_FIELD_NAME, type: FieldMetadataType.TEXT },
];

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.materialRequest,
  namePlural: 'materialRequests',
  labelSingular: msg`Material Request`,
  labelPlural: msg`Material Requests`,
  description: msg`Material request management`,
  icon: STANDARD_OBJECT_ICONS.materialRequest,
  labelIdentifierStandardId: MATERIAL_REQUEST_STANDARD_FIELD_IDS.requestName,
})
@WorkspaceIsSearchable()
export class MaterialRequestWorkspaceEntity extends BaseWorkspaceEntity {
  // Basic Information
  @WorkspaceField({
    standardId: MATERIAL_REQUEST_STANDARD_FIELD_IDS.materialRequestCode,
    type: FieldMetadataType.TEXT,
    label: msg`Material Request Code`,
    description: msg`Code of the material request`,
    icon: 'IconTag',
  })
  @WorkspaceIsNullable()
  materialRequestCode: string | null;

  // Relations - Material (optional)
  @WorkspaceRelation({
    standardId: MATERIAL_REQUEST_STANDARD_FIELD_IDS.material,
    type: RelationType.MANY_TO_ONE,
    label: msg`Material`,
    description: msg`Material being requested`,
    icon: 'IconBox',
    inverseSideTarget: () => MaterialWorkspaceEntity,
    inverseSideFieldKey: 'materialRequests',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  material: Relation<MaterialWorkspaceEntity> | null;

  @WorkspaceJoinColumn('material')
  materialId: string | null;

  @WorkspaceField({
    standardId: MATERIAL_REQUEST_STANDARD_FIELD_IDS.materialCode,
    type: FieldMetadataType.TEXT,
    label: msg`Material Code`,
    description: msg`Code of the material`,
    icon: 'IconTag',
  })
  @WorkspaceIsNullable()
  materialCode: string | null;

  @WorkspaceField({
    standardId: MATERIAL_REQUEST_STANDARD_FIELD_IDS.materialName,
    type: FieldMetadataType.TEXT,
    label: msg`Material Name`,
    description: msg`Name of the material`,
    icon: 'IconBox',
  })
  @WorkspaceIsNullable()
  materialName: string | null;

  @WorkspaceField({
    standardId: MATERIAL_REQUEST_STANDARD_FIELD_IDS.specification,
    type: FieldMetadataType.TEXT,
    label: msg`Specification`,
    description: msg`Technical specifications`,
    icon: 'IconFileText',
  })
  @WorkspaceIsNullable()
  specification: string | null;

  @WorkspaceField({
    standardId: MATERIAL_REQUEST_STANDARD_FIELD_IDS.unit,
    type: FieldMetadataType.TEXT,
    label: msg`Unit`,
    description: msg`Unit of measurement`,
    icon: 'IconRuler',
  })
  @WorkspaceIsNullable()
  unit: string | null;

  // Relations - Project (required)
  @WorkspaceRelation({
    standardId: MATERIAL_REQUEST_STANDARD_FIELD_IDS.project,
    type: RelationType.MANY_TO_ONE,
    label: msg`Project`,
    description: msg`Project for this request`,
    icon: 'IconBriefcase',
    inverseSideTarget: () => ProjectWorkspaceEntity,
    inverseSideFieldKey: 'materialRequests',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  project: Relation<ProjectWorkspaceEntity>;

  @WorkspaceJoinColumn('project')
  projectId: string;

  @WorkspaceField({
    standardId: MATERIAL_REQUEST_STANDARD_FIELD_IDS.quantity,
    type: FieldMetadataType.NUMBER,
    label: msg`Quantity`,
    description: msg`Requested quantity`,
    icon: 'IconNumber',
  })
  @WorkspaceIsNullable()
  quantity: number | null;

  @WorkspaceField({
    standardId: MATERIAL_REQUEST_STANDARD_FIELD_IDS.requestedDate,
    type: FieldMetadataType.DATE_TIME,
    label: msg`Requested Date`,
    description: msg`Date of request`,
    icon: 'IconCalendar',
  })
  @WorkspaceIsNullable()
  requestedDate: Date | null;

  @WorkspaceField({
    standardId: MATERIAL_REQUEST_STANDARD_FIELD_IDS.requiredDate,
    type: FieldMetadataType.DATE_TIME,
    label: msg`Required Date`,
    description: msg`Required delivery date`,
    icon: 'IconCalendar',
  })
  @WorkspaceIsNullable()
  requiredDate: Date | null;

  @WorkspaceField({
    standardId: MATERIAL_REQUEST_STANDARD_FIELD_IDS.status,
    type: FieldMetadataType.SELECT,
    label: msg`Status`,
    description: msg`Request status`,
    icon: 'IconFlag',
    options: [
      {
        value: MaterialRequestStatus.PENDING,
        label: 'Pending',
        position: 0,
        color: 'yellow',
      },
      {
        value: MaterialRequestStatus.IN_PROGRESS,
        label: 'In Progress',
        position: 1,
        color: 'blue',
      },
      {
        value: MaterialRequestStatus.COMPLETED,
        label: 'Completed',
        position: 2,
        color: 'green',
      },
    ],
    defaultValue: `'${MaterialRequestStatus.PENDING}'`,
  })
  @WorkspaceIsNullable()
  status: string | null;

  @WorkspaceField({
    standardId: MATERIAL_REQUEST_STANDARD_FIELD_IDS.requestName,
    type: FieldMetadataType.TEXT,
    label: msg`Request Name`,
    description: msg`Name of the request`,
    icon: 'IconFileText',
  })
  @WorkspaceIsNullable()
  requestName: string | null;

  @WorkspaceField({
    standardId: MATERIAL_REQUEST_STANDARD_FIELD_IDS.category,
    type: FieldMetadataType.TEXT,
    label: msg`Category`,
    description: msg`Category of request`,
    icon: 'IconCategory',
  })
  @WorkspaceIsNullable()
  category: string | null;

  @WorkspaceField({
    standardId: MATERIAL_REQUEST_STANDARD_FIELD_IDS.requestedBy,
    type: FieldMetadataType.TEXT,
    label: msg`Requested By`,
    description: msg`Person who requested`,
    icon: 'IconUser',
  })
  @WorkspaceIsNullable()
  requestedBy: string | null;

  @WorkspaceField({
    standardId: MATERIAL_REQUEST_STANDARD_FIELD_IDS.image,
    type: FieldMetadataType.TEXT,
    label: msg`Image`,
    description: msg`Image URL`,
    icon: 'IconPhoto',
  })
  @WorkspaceIsNullable()
  image: string | null;

  // Relations - Manufacturer (optional)
  @WorkspaceRelation({
    standardId: MATERIAL_REQUEST_STANDARD_FIELD_IDS.manufacturer,
    type: RelationType.MANY_TO_ONE,
    label: msg`Manufacturer`,
    description: msg`Manufacturer of the material`,
    icon: 'IconBuildingFactory2',
    inverseSideTarget: () => ManufacturerWorkspaceEntity,
    inverseSideFieldKey: 'materialRequests',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  manufacturer: Relation<ManufacturerWorkspaceEntity> | null;

  @WorkspaceJoinColumn('manufacturer')
  manufacturerId: string | null;

  @WorkspaceField({
    standardId: MATERIAL_REQUEST_STANDARD_FIELD_IDS.manufacturerName,
    type: FieldMetadataType.TEXT,
    label: msg`Manufacturer Name`,
    description: msg`Name of manufacturer`,
    icon: 'IconBuildingFactory2',
  })
  @WorkspaceIsNullable()
  manufacturerName: string | null;

  @WorkspaceField({
    standardId: MATERIAL_REQUEST_STANDARD_FIELD_IDS.note,
    type: FieldMetadataType.TEXT,
    label: msg`Note`,
    description: msg`Additional notes`,
    icon: 'IconNotes',
  })
  @WorkspaceIsNullable()
  note: string | null;

  // System Fields - REQUIRED
  @WorkspaceField({
    standardId: MATERIAL_REQUEST_STANDARD_FIELD_IDS.position,
    type: FieldMetadataType.POSITION,
    label: msg`Position`,
    description: msg`Material request record position`,
    icon: 'IconHierarchy2',
    defaultValue: 0,
  })
  @WorkspaceIsSystem()
  position: number;

  @WorkspaceField({
    standardId: MATERIAL_REQUEST_STANDARD_FIELD_IDS.createdBy,
    type: FieldMetadataType.ACTOR,
    label: msg`Created by`,
    icon: 'IconCreativeCommonsSa',
    description: msg`The creator of the record`,
  })
  @WorkspaceIsFieldUIReadOnly()
  createdBy: ActorMetadata;

  // Timeline Activities - System field
  @WorkspaceRelation({
    standardId: MATERIAL_REQUEST_STANDARD_FIELD_IDS.timelineActivities,
    type: RelationType.ONE_TO_MANY,
    label: msg`Timeline Activities`,
    description: msg`Timeline Activities linked to the material request`,
    icon: 'IconTimelineEvent',
    inverseSideTarget: () => TimelineActivityWorkspaceEntity,
    inverseSideFieldKey: 'materialRequest',
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  timelineActivities: Relation<TimelineActivityWorkspaceEntity[]>;

  // Relations - MaterialPurchaseRequest (One-to-Many)
  @WorkspaceRelation({
    standardId: MATERIAL_REQUEST_STANDARD_FIELD_IDS.materialPurchaseRequests,
    type: RelationType.ONE_TO_MANY,
    label: msg`Material Purchase Requests`,
    description: msg`Purchase requests for this material request`,
    icon: 'IconShoppingCart',
    inverseSideTarget: () => MaterialPurchaseRequestWorkspaceEntity,
    inverseSideFieldKey: 'materialRequest',
  })
  materialPurchaseRequests: Relation<MaterialPurchaseRequestWorkspaceEntity[]>;

  // Search Vector - REQUIRED for searchable entities
  @WorkspaceField({
    standardId: MATERIAL_REQUEST_STANDARD_FIELD_IDS.searchVector,
    type: FieldMetadataType.TS_VECTOR,
    label: SEARCH_VECTOR_FIELD.label,
    description: SEARCH_VECTOR_FIELD.description,
    icon: 'IconSearch',
    generatedType: 'STORED',
    asExpression: getTsVectorColumnExpressionFromFields(
      SEARCH_FIELDS_FOR_MATERIAL_REQUEST,
    ),
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  @WorkspaceFieldIndex({ indexType: IndexType.GIN })
  searchVector: string;
}

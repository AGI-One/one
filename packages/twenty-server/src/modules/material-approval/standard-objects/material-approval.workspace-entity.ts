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
import { MATERIAL_APPROVAL_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_ICONS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-icons';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';
import {
    type FieldTypeAndNameMetadata,
    getTsVectorColumnExpressionFromFields,
} from 'src/engine/workspace-manager/workspace-sync-metadata/utils/get-ts-vector-column-expression.util';
// Import related entities
import { WorkspaceJoinColumn } from 'src/engine/twenty-orm/decorators/workspace-join-column.decorator';
import { ManufacturerWorkspaceEntity } from 'src/modules/manufacturer/standard-objects/manufacturer.workspace-entity';
import { MaterialWorkspaceEntity } from 'src/modules/material/standard-objects/material.workspace-entity';
import { ProjectWorkspaceEntity } from 'src/modules/project/standard-objects/project.workspace-entity';
import { SupplierWorkspaceEntity } from 'src/modules/supplier/standard-objects/supplier.workspace-entity';
import { TimelineActivityWorkspaceEntity } from 'src/modules/timeline/standard-objects/timeline-activity.workspace-entity';

enum MaterialApprovalStatus {
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PENDING = 'pending',
}

// Search fields definition
const MATERIAL_APPROVAL_NAME_FIELD_NAME = 'materialApprovalName';
const NOTE_FIELD_NAME = 'note';

export const SEARCH_FIELDS_FOR_MATERIAL_APPROVAL: FieldTypeAndNameMetadata[] = [
  { name: MATERIAL_APPROVAL_NAME_FIELD_NAME, type: FieldMetadataType.TEXT },
  { name: NOTE_FIELD_NAME, type: FieldMetadataType.TEXT },
];

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.materialApproval,
  namePlural: 'materialApprovals',
  labelSingular: msg`Material Approval`,
  labelPlural: msg`Material Approvals`,
  description: msg`Material approval management`,
  icon: STANDARD_OBJECT_ICONS.materialApproval,
  labelIdentifierStandardId:
    MATERIAL_APPROVAL_STANDARD_FIELD_IDS.materialApprovalName,
})
@WorkspaceIsSearchable()
export class MaterialApprovalWorkspaceEntity extends BaseWorkspaceEntity {
  // Basic Information
  @WorkspaceField({
    standardId: MATERIAL_APPROVAL_STANDARD_FIELD_IDS.materialApprovalCode,
    type: FieldMetadataType.TEXT,
    label: msg`Material Approval Code`,
    description: msg`Code of the material approval`,
    icon: 'IconTag',
  })
  @WorkspaceIsNullable()
  materialApprovalCode: string | null;

  @WorkspaceField({
    standardId: MATERIAL_APPROVAL_STANDARD_FIELD_IDS.materialApprovalName,
    type: FieldMetadataType.TEXT,
    label: msg`Material Approval Name`,
    description: msg`Name of the material approval`,
    icon: 'IconCircleCheck',
  })
  @WorkspaceIsNullable()
  materialApprovalName: string | null;

  // Relations - Material (required)
  @WorkspaceRelation({
    standardId: MATERIAL_APPROVAL_STANDARD_FIELD_IDS.material,
    type: RelationType.MANY_TO_ONE,
    label: msg`Material`,
    description: msg`Material being approved`,
    icon: 'IconBox',
    inverseSideTarget: () => MaterialWorkspaceEntity,
    inverseSideFieldKey: 'materialApprovals',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  material: Relation<MaterialWorkspaceEntity>;

  @WorkspaceJoinColumn('material')
  materialId: string;

  // Relations - Project (required)
  @WorkspaceRelation({
    standardId: MATERIAL_APPROVAL_STANDARD_FIELD_IDS.project,
    type: RelationType.MANY_TO_ONE,
    label: msg`Project`,
    description: msg`Project for this approval`,
    icon: 'IconBriefcase',
    inverseSideTarget: () => ProjectWorkspaceEntity,
    inverseSideFieldKey: 'materialApprovals',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  project: Relation<ProjectWorkspaceEntity>;

  @WorkspaceJoinColumn('project')
  projectId: string;

  @WorkspaceField({
    standardId: MATERIAL_APPROVAL_STANDARD_FIELD_IDS.status,
    type: FieldMetadataType.SELECT,
    label: msg`Status`,
    description: msg`Approval status`,
    icon: 'IconFlag',
    options: [
      {
        value: MaterialApprovalStatus.APPROVED,
        label: 'Approved',
        position: 0,
        color: 'green',
      },
      {
        value: MaterialApprovalStatus.REJECTED,
        label: 'Rejected',
        position: 1,
        color: 'red',
      },
      {
        value: MaterialApprovalStatus.PENDING,
        label: 'Pending',
        position: 2,
        color: 'yellow',
      },
    ],
    defaultValue: `'${MaterialApprovalStatus.PENDING}'`,
  })
  @WorkspaceIsNullable()
  status: string | null;

  @WorkspaceField({
    standardId: MATERIAL_APPROVAL_STANDARD_FIELD_IDS.approvedDate,
    type: FieldMetadataType.DATE_TIME,
    label: msg`Approved Date`,
    description: msg`Date of approval`,
    icon: 'IconCalendar',
  })
  @WorkspaceIsNullable()
  approvedDate: Date | null;

  @WorkspaceField({
    standardId: MATERIAL_APPROVAL_STANDARD_FIELD_IDS.attachment,
    type: FieldMetadataType.TEXT,
    label: msg`Attachment`,
    description: msg`Attachment file`,
    icon: 'IconPaperclip',
  })
  @WorkspaceIsNullable()
  attachment: string | null;

  // Relations - Supplier (optional)
  @WorkspaceRelation({
    standardId: MATERIAL_APPROVAL_STANDARD_FIELD_IDS.supplier,
    type: RelationType.MANY_TO_ONE,
    label: msg`Supplier`,
    description: msg`Supplier for this approval`,
    icon: 'IconTruck',
    inverseSideTarget: () => SupplierWorkspaceEntity,
    inverseSideFieldKey: 'materialApprovals',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  supplier: Relation<SupplierWorkspaceEntity> | null;

  @WorkspaceJoinColumn('supplier')
  supplierId: string | null;

  // Relations - Manufacturer (optional)
  @WorkspaceRelation({
    standardId: MATERIAL_APPROVAL_STANDARD_FIELD_IDS.manufacturer,
    type: RelationType.MANY_TO_ONE,
    label: msg`Manufacturer`,
    description: msg`Manufacturer for this approval`,
    icon: 'IconBuildingFactory2',
    inverseSideTarget: () => ManufacturerWorkspaceEntity,
    inverseSideFieldKey: 'materialApprovals',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  manufacturer: Relation<ManufacturerWorkspaceEntity> | null;

  @WorkspaceJoinColumn('manufacturer')
  manufacturerId: string | null;

  @WorkspaceField({
    standardId: MATERIAL_APPROVAL_STANDARD_FIELD_IDS.note,
    type: FieldMetadataType.TEXT,
    label: msg`Note`,
    description: msg`Additional notes`,
    icon: 'IconNotes',
  })
  @WorkspaceIsNullable()
  note: string | null;

  // System Fields - REQUIRED
  @WorkspaceField({
    standardId: MATERIAL_APPROVAL_STANDARD_FIELD_IDS.position,
    type: FieldMetadataType.POSITION,
    label: msg`Position`,
    description: msg`Material approval record position`,
    icon: 'IconHierarchy2',
    defaultValue: 0,
  })
  @WorkspaceIsSystem()
  position: number;

  @WorkspaceField({
    standardId: MATERIAL_APPROVAL_STANDARD_FIELD_IDS.createdBy,
    type: FieldMetadataType.ACTOR,
    label: msg`Created by`,
    icon: 'IconCreativeCommonsSa',
    description: msg`The creator of the record`,
  })
  @WorkspaceIsFieldUIReadOnly()
  createdBy: ActorMetadata;

  // Timeline Activities - System field
  @WorkspaceRelation({
    standardId: MATERIAL_APPROVAL_STANDARD_FIELD_IDS.timelineActivities,
    type: RelationType.ONE_TO_MANY,
    label: msg`Timeline Activities`,
    description: msg`Timeline Activities linked to the material approval`,
    icon: 'IconTimelineEvent',
    inverseSideTarget: () => TimelineActivityWorkspaceEntity,
    inverseSideFieldKey: 'materialApproval',
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  timelineActivities: Relation<TimelineActivityWorkspaceEntity[]>;

  // Search Vector - REQUIRED for searchable entities
  @WorkspaceField({
    standardId: MATERIAL_APPROVAL_STANDARD_FIELD_IDS.searchVector,
    type: FieldMetadataType.TS_VECTOR,
    label: SEARCH_VECTOR_FIELD.label,
    description: SEARCH_VECTOR_FIELD.description,
    icon: 'IconSearch',
    generatedType: 'STORED',
    asExpression: getTsVectorColumnExpressionFromFields(
      SEARCH_FIELDS_FOR_MATERIAL_APPROVAL,
    ),
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  @WorkspaceFieldIndex({ indexType: IndexType.GIN })
  searchVector: string;
}

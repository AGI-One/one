import { msg } from '@lingui/core/macro';
import { FieldMetadataType, RelationOnDeleteAction } from 'twenty-shared/types';

import { RelationType } from 'src/engine/metadata-modules/field-metadata/interfaces/relation-type.interface';
import { Relation } from 'src/engine/workspace-manager/workspace-sync-metadata/interfaces/relation.interface';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { CustomWorkspaceEntity } from 'src/engine/twenty-orm/custom.workspace-entity';
import { WorkspaceDynamicRelation } from 'src/engine/twenty-orm/decorators/workspace-dynamic-relation.decorator';
import { WorkspaceEntity } from 'src/engine/twenty-orm/decorators/workspace-entity.decorator';
import { WorkspaceField } from 'src/engine/twenty-orm/decorators/workspace-field.decorator';
import { WorkspaceIsNotAuditLogged } from 'src/engine/twenty-orm/decorators/workspace-is-not-audit-logged.decorator';
import { WorkspaceIsNullable } from 'src/engine/twenty-orm/decorators/workspace-is-nullable.decorator';
import { WorkspaceIsSystem } from 'src/engine/twenty-orm/decorators/workspace-is-system.decorator';
import { WorkspaceJoinColumn } from 'src/engine/twenty-orm/decorators/workspace-join-column.decorator';
import { WorkspaceRelation } from 'src/engine/twenty-orm/decorators/workspace-relation.decorator';
import { TIMELINE_ACTIVITY_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_ICONS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-icons';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';
import { CompanyWorkspaceEntity } from 'src/modules/company/standard-objects/company.workspace-entity';
import { DashboardWorkspaceEntity } from 'src/modules/dashboard/standard-objects/dashboard.workspace-entity';
import { InventoryWorkspaceEntity } from 'src/modules/inventory/standard-objects/inventory.workspace-entity';
import { JobTitleWorkspaceEntity } from 'src/modules/job-title/standard-objects/job-title.workspace-entity';
import { ManufacturerWorkspaceEntity } from 'src/modules/manufacturer/standard-objects/manufacturer.workspace-entity';
import { MaterialCategoryWorkspaceEntity } from 'src/modules/material-category/standard-objects/material-category.workspace-entity';
import { MaterialGroupWorkspaceEntity } from 'src/modules/material-group/standard-objects/material-group.workspace-entity';
import { MaterialWorkspaceEntity } from 'src/modules/material/standard-objects/material.workspace-entity';
import { NoteWorkspaceEntity } from 'src/modules/note/standard-objects/note.workspace-entity';
import { OpportunityWorkspaceEntity } from 'src/modules/opportunity/standard-objects/opportunity.workspace-entity';
import { PermissionWorkspaceEntity } from 'src/modules/permission/standard-objects/permission.workspace-entity';
import { PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';
import { ProjectUserWorkspaceEntity } from 'src/modules/project-user/standard-objects/project-user.workspace-entity';
import { ProjectWorkspaceEntity } from 'src/modules/project/standard-objects/project.workspace-entity';
import { QuotationItemWorkspaceEntity } from 'src/modules/quotation-item/standard-objects/quotation-item.workspace-entity';
import { QuotationWorkspaceEntity } from 'src/modules/quotation/standar-objects/quotation.workspace-entity';
import { RoleWorkspaceEntity } from 'src/modules/role/standard-objects/role.workspace-entity';
import { SupplierWorkspaceEntity } from 'src/modules/supplier/standard-objects/supplier.workspace-entity';
import { TaskWorkspaceEntity } from 'src/modules/task/standard-objects/task.workspace-entity';
import { AppUserWorkspaceEntity } from 'src/modules/user/standard-objects/user.workspace-entity';
import { WarehouseWorkspaceEntity } from 'src/modules/warehouse/standard-objects/warehouse.workspace-entity';
import { WorkflowRunWorkspaceEntity } from 'src/modules/workflow/common/standard-objects/workflow-run.workspace-entity';
import { WorkflowVersionWorkspaceEntity } from 'src/modules/workflow/common/standard-objects/workflow-version.workspace-entity';
import { WorkflowWorkspaceEntity } from 'src/modules/workflow/common/standard-objects/workflow.workspace-entity';
import { WorkspaceMemberWorkspaceEntity } from 'src/modules/workspace-member/standard-objects/workspace-member.workspace-entity';

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.timelineActivity,

  namePlural: 'timelineActivities',
  labelSingular: msg`Timeline Activity`,
  labelPlural: msg`Timeline Activities`,
  description: msg`Aggregated / filtered event to be displayed on the timeline`,
  icon: STANDARD_OBJECT_ICONS.timelineActivity,
})
@WorkspaceIsSystem()
@WorkspaceIsNotAuditLogged()
export class TimelineActivityWorkspaceEntity extends BaseWorkspaceEntity {
  @WorkspaceField({
    standardId: TIMELINE_ACTIVITY_STANDARD_FIELD_IDS.happensAt,
    type: FieldMetadataType.DATE_TIME,
    label: msg`Creation date`,
    description: msg`Creation date`,
    icon: 'IconCalendar',
    defaultValue: 'now',
  })
  happensAt: Date;

  @WorkspaceField({
    standardId: TIMELINE_ACTIVITY_STANDARD_FIELD_IDS.name,
    type: FieldMetadataType.TEXT,
    label: msg`Event name`,
    description: msg`Event name`,
    icon: 'IconAbc',
  })
  name: string;

  @WorkspaceField({
    standardId: TIMELINE_ACTIVITY_STANDARD_FIELD_IDS.properties,
    type: FieldMetadataType.RAW_JSON,
    label: msg`Event details`,
    description: msg`Json value for event details`,
    icon: 'IconListDetails',
  })
  @WorkspaceIsNullable()
  properties: JSON | null;

  // Special objects that don't have their own timeline and are 'link' to the main object
  @WorkspaceField({
    standardId: TIMELINE_ACTIVITY_STANDARD_FIELD_IDS.linkedRecordCachedName,
    type: FieldMetadataType.TEXT,
    label: msg`Linked Record cached name`,
    description: msg`Cached record name`,
    icon: 'IconAbc',
  })
  linkedRecordCachedName: string;

  @WorkspaceField({
    standardId: TIMELINE_ACTIVITY_STANDARD_FIELD_IDS.linkedRecordId,
    type: FieldMetadataType.UUID,
    label: msg`Linked Record id`,
    description: msg`Linked Record id`,
    icon: 'IconAbc',
  })
  @WorkspaceIsNullable()
  linkedRecordId: string | null;

  @WorkspaceField({
    standardId: TIMELINE_ACTIVITY_STANDARD_FIELD_IDS.linkedObjectMetadataId,
    type: FieldMetadataType.UUID,
    label: msg`Linked Object Metadata Id`,
    description: msg`Linked Object Metadata Id`,
    icon: 'IconAbc',
  })
  @WorkspaceIsNullable()
  linkedObjectMetadataId: string | null;

  // Who made the action
  @WorkspaceRelation({
    standardId: TIMELINE_ACTIVITY_STANDARD_FIELD_IDS.workspaceMember,
    type: RelationType.MANY_TO_ONE,
    label: msg`Workspace Member`,
    description: msg`Event workspace member`,
    icon: 'IconCircleUser',
    inverseSideTarget: () => WorkspaceMemberWorkspaceEntity,
    inverseSideFieldKey: 'timelineActivities',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsNullable()
  workspaceMember: Relation<WorkspaceMemberWorkspaceEntity> | null;

  @WorkspaceJoinColumn('workspaceMember')
  workspaceMemberId: string | null;

  @WorkspaceRelation({
    standardId: TIMELINE_ACTIVITY_STANDARD_FIELD_IDS.person,
    type: RelationType.MANY_TO_ONE,
    label: msg`Person`,
    description: msg`Event person`,
    icon: 'IconUser',
    inverseSideTarget: () => PersonWorkspaceEntity,
    inverseSideFieldKey: 'timelineActivities',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsNullable()
  person: Relation<PersonWorkspaceEntity> | null;

  @WorkspaceJoinColumn('person')
  personId: string | null;

  @WorkspaceRelation({
    standardId: TIMELINE_ACTIVITY_STANDARD_FIELD_IDS.company,
    type: RelationType.MANY_TO_ONE,
    label: msg`Company`,
    description: msg`Event company`,
    icon: 'IconBuildingSkyscraper',
    inverseSideTarget: () => CompanyWorkspaceEntity,
    inverseSideFieldKey: 'timelineActivities',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsNullable()
  company: Relation<CompanyWorkspaceEntity> | null;

  @WorkspaceJoinColumn('company')
  companyId: string | null;

  @WorkspaceRelation({
    standardId: TIMELINE_ACTIVITY_STANDARD_FIELD_IDS.opportunity,
    type: RelationType.MANY_TO_ONE,
    label: msg`Opportunity`,
    description: msg`Event opportunity`,
    icon: 'IconTargetArrow',
    inverseSideTarget: () => OpportunityWorkspaceEntity,
    inverseSideFieldKey: 'timelineActivities',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  opportunity: Relation<OpportunityWorkspaceEntity> | null;

  @WorkspaceJoinColumn('opportunity')
  opportunityId: string | null;

  @WorkspaceRelation({
    standardId: TIMELINE_ACTIVITY_STANDARD_FIELD_IDS.note,
    type: RelationType.MANY_TO_ONE,
    label: msg`Note`,
    description: msg`Event note`,
    icon: 'IconTargetArrow',
    inverseSideTarget: () => NoteWorkspaceEntity,
    inverseSideFieldKey: 'timelineActivities',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  note: Relation<NoteWorkspaceEntity> | null;

  @WorkspaceJoinColumn('note')
  noteId: string | null;

  @WorkspaceRelation({
    standardId: TIMELINE_ACTIVITY_STANDARD_FIELD_IDS.task,
    type: RelationType.MANY_TO_ONE,
    label: msg`Task`,
    description: msg`Event task`,
    icon: 'IconTargetArrow',
    inverseSideTarget: () => TaskWorkspaceEntity,
    inverseSideFieldKey: 'timelineActivities',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  task: Relation<TaskWorkspaceEntity> | null;

  @WorkspaceJoinColumn('task')
  taskId: string | null;

  @WorkspaceRelation({
    standardId: TIMELINE_ACTIVITY_STANDARD_FIELD_IDS.workflow,
    type: RelationType.MANY_TO_ONE,
    label: msg`Workflow`,
    description: msg`Event workflow`,
    icon: 'IconTargetArrow',
    inverseSideTarget: () => WorkflowWorkspaceEntity,
    inverseSideFieldKey: 'timelineActivities',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsNullable()
  workflow: Relation<WorkflowWorkspaceEntity> | null;

  @WorkspaceJoinColumn('workflow')
  workflowId: string | null;

  @WorkspaceRelation({
    standardId: TIMELINE_ACTIVITY_STANDARD_FIELD_IDS.workflowVersion,
    type: RelationType.MANY_TO_ONE,
    label: msg`WorkflowVersion`,
    description: msg`Event workflow version`,
    icon: 'IconTargetArrow',
    inverseSideTarget: () => WorkflowVersionWorkspaceEntity,
    inverseSideFieldKey: 'timelineActivities',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsNullable()
  workflowVersion: Relation<WorkflowVersionWorkspaceEntity> | null;

  @WorkspaceJoinColumn('workflowVersion')
  workflowVersionId: string | null;

  @WorkspaceRelation({
    standardId: TIMELINE_ACTIVITY_STANDARD_FIELD_IDS.workflowRun,
    type: RelationType.MANY_TO_ONE,
    label: msg`Workflow Run`,
    description: msg`Event workflow run`,
    icon: 'IconTargetArrow',
    inverseSideTarget: () => WorkflowRunWorkspaceEntity,
    inverseSideFieldKey: 'timelineActivities',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsNullable()
  workflowRun: Relation<WorkflowRunWorkspaceEntity> | null;

  @WorkspaceJoinColumn('workflowRun')
  workflowRunId: string | null;

  @WorkspaceRelation({
    standardId: TIMELINE_ACTIVITY_STANDARD_FIELD_IDS.dashboard,
    type: RelationType.MANY_TO_ONE,
    label: msg`Dashboard`,
    description: msg`Event dashboard`,
    icon: 'IconTargetArrow',
    inverseSideTarget: () => DashboardWorkspaceEntity,
    inverseSideFieldKey: 'timelineActivities',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  dashboard: Relation<DashboardWorkspaceEntity> | null;

  @WorkspaceJoinColumn('dashboard')
  dashboardId: string | null;

  @WorkspaceRelation({
    standardId: TIMELINE_ACTIVITY_STANDARD_FIELD_IDS.warehouse,
    type: RelationType.MANY_TO_ONE,
    label: msg`Warehouse`,
    description: msg`Event warehouse`,
    icon: 'IconWarehouse',
    inverseSideTarget: () => WarehouseWorkspaceEntity,
    inverseSideFieldKey: 'timelineActivities',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  warehouse: Relation<WarehouseWorkspaceEntity> | null;

  @WorkspaceJoinColumn('warehouse')
  warehouseId: string | null;

  @WorkspaceRelation({
    standardId: TIMELINE_ACTIVITY_STANDARD_FIELD_IDS.inventory,
    type: RelationType.MANY_TO_ONE,
    label: msg`Inventory`,
    description: msg`Event inventory`,
    icon: 'IconPackage',
    inverseSideTarget: () => InventoryWorkspaceEntity,
    inverseSideFieldKey: 'timelineActivities',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  inventory: Relation<InventoryWorkspaceEntity> | null;

  @WorkspaceJoinColumn('inventory')
  inventoryId: string | null;

  @WorkspaceRelation({
    standardId: TIMELINE_ACTIVITY_STANDARD_FIELD_IDS.material,
    type: RelationType.MANY_TO_ONE,
    label: msg`Material`,
    description: msg`Event material`,
    icon: 'IconPackage',
    inverseSideTarget: () => MaterialWorkspaceEntity,
    inverseSideFieldKey: 'timelineActivities',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  material: Relation<MaterialWorkspaceEntity> | null;

  @WorkspaceJoinColumn('material')
  materialId: string | null;

  @WorkspaceRelation({
    standardId: TIMELINE_ACTIVITY_STANDARD_FIELD_IDS.materialCategory,
    type: RelationType.MANY_TO_ONE,
    label: msg`Material Category`,
    description: msg`Event material category`,
    icon: 'IconCategory',
    inverseSideTarget: () => MaterialCategoryWorkspaceEntity,
    inverseSideFieldKey: 'timelineActivities',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  materialCategory: Relation<MaterialCategoryWorkspaceEntity> | null;

  @WorkspaceJoinColumn('materialCategory')
  materialCategoryId: string | null;

  @WorkspaceRelation({
    standardId: TIMELINE_ACTIVITY_STANDARD_FIELD_IDS.quotation,
    type: RelationType.MANY_TO_ONE,
    label: msg`Quotation`,
    description: msg`Event quotation`,
    icon: 'IconFileText',
    inverseSideTarget: () => QuotationWorkspaceEntity,
    inverseSideFieldKey: 'timelineActivities',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  quotation: Relation<QuotationWorkspaceEntity> | null;

  @WorkspaceJoinColumn('quotation')
  quotationId: string | null;

  @WorkspaceRelation({
    standardId: TIMELINE_ACTIVITY_STANDARD_FIELD_IDS.quotationItem,
    type: RelationType.MANY_TO_ONE,
    label: msg`Quotation Item`,
    description: msg`Event quotation item`,
    icon: 'IconListDetails',
    inverseSideTarget: () => QuotationItemWorkspaceEntity,
    inverseSideFieldKey: 'timelineActivities',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  quotationItem: Relation<QuotationItemWorkspaceEntity> | null;

  @WorkspaceJoinColumn('quotationItem')
  quotationItemId: string | null;

  @WorkspaceRelation({
    standardId: TIMELINE_ACTIVITY_STANDARD_FIELD_IDS.supplier,
    type: RelationType.MANY_TO_ONE,
    label: msg`Supplier`,
    description: msg`Event supplier`,
    icon: 'IconTruck',
    inverseSideTarget: () => SupplierWorkspaceEntity,
    inverseSideFieldKey: 'timelineActivities',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  supplier: Relation<SupplierWorkspaceEntity> | null;

  @WorkspaceJoinColumn('supplier')
  supplierId: string | null;

  @WorkspaceRelation({
    standardId: TIMELINE_ACTIVITY_STANDARD_FIELD_IDS.manufacturer,
    type: RelationType.MANY_TO_ONE,
    label: msg`Manufacturer`,
    description: msg`Event manufacturer`,
    icon: 'IconFactory',
    inverseSideTarget: () => ManufacturerWorkspaceEntity,
    inverseSideFieldKey: 'timelineActivities',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  manufacturer: Relation<ManufacturerWorkspaceEntity> | null;

  @WorkspaceJoinColumn('manufacturer')
  manufacturerId: string | null;

  @WorkspaceRelation({
    standardId: TIMELINE_ACTIVITY_STANDARD_FIELD_IDS.materialGroup,
    type: RelationType.MANY_TO_ONE,
    label: msg`Material Group`,
    description: msg`Event material group`,
    icon: 'IconCategory',
    inverseSideTarget: () => MaterialGroupWorkspaceEntity,
    inverseSideFieldKey: 'timelineActivities',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  materialGroup: Relation<MaterialGroupWorkspaceEntity> | null;

  @WorkspaceJoinColumn('materialGroup')
  materialGroupId: string | null;

  @WorkspaceRelation({
    standardId: TIMELINE_ACTIVITY_STANDARD_FIELD_IDS.role,
    type: RelationType.MANY_TO_ONE,
    label: msg`Role`,
    description: msg`Event role`,
    icon: 'IconUsers',
    inverseSideTarget: () => RoleWorkspaceEntity,
    inverseSideFieldKey: 'timelineActivities',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  role: Relation<RoleWorkspaceEntity> | null;

  @WorkspaceJoinColumn('role')
  roleId: string | null;

  @WorkspaceRelation({
    standardId: TIMELINE_ACTIVITY_STANDARD_FIELD_IDS.appUser,
    type: RelationType.MANY_TO_ONE,
    label: msg`App User`,
    description: msg`Event app user`,
    icon: 'IconUser',
    inverseSideTarget: () => AppUserWorkspaceEntity,
    inverseSideFieldKey: 'timelineActivities',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  appUser: Relation<AppUserWorkspaceEntity> | null;

  @WorkspaceJoinColumn('appUser')
  appUserId: string | null;

  @WorkspaceRelation({
    standardId: TIMELINE_ACTIVITY_STANDARD_FIELD_IDS.permission,
    type: RelationType.MANY_TO_ONE,
    label: msg`Permission`,
    description: msg`Event permission`,
    icon: 'IconShield',
    inverseSideTarget: () => PermissionWorkspaceEntity,
    inverseSideFieldKey: 'timelineActivities',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  permission: Relation<PermissionWorkspaceEntity> | null;

  @WorkspaceJoinColumn('permission')
  permissionId: string | null;

  @WorkspaceRelation({
    standardId: TIMELINE_ACTIVITY_STANDARD_FIELD_IDS.jobTitle,
    type: RelationType.MANY_TO_ONE,
    label: msg`Job Title`,
    description: msg`Event job title`,
    icon: 'IconBriefcase',
    inverseSideTarget: () => JobTitleWorkspaceEntity,
    inverseSideFieldKey: 'timelineActivities',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  jobTitle: Relation<JobTitleWorkspaceEntity> | null;
  @WorkspaceJoinColumn('jobTitle')
  jobTitleId: string | null;

  @WorkspaceRelation({
    standardId: TIMELINE_ACTIVITY_STANDARD_FIELD_IDS.project,
    type: RelationType.MANY_TO_ONE,
    label: msg`Project`,
    description: msg`Event project`,
    icon: 'IconBriefcase',
    inverseSideTarget: () => ProjectWorkspaceEntity,
    inverseSideFieldKey: 'timelineActivities',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  project: Relation<ProjectWorkspaceEntity> | null;

  @WorkspaceJoinColumn('project')
  projectId: string | null;

  @WorkspaceRelation({
    standardId: TIMELINE_ACTIVITY_STANDARD_FIELD_IDS.projectUser,
    type: RelationType.MANY_TO_ONE,
    label: msg`Project User`,
    description: msg`Event project user`,
    icon: 'IconUserPlus',
    inverseSideTarget: () => ProjectUserWorkspaceEntity,
    inverseSideFieldKey: 'timelineActivities',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  projectUser: Relation<ProjectUserWorkspaceEntity> | null;

  @WorkspaceJoinColumn('projectUser')
  projectUserId: string | null;

  @WorkspaceDynamicRelation({
    type: RelationType.MANY_TO_ONE,
    argsFactory: (oppositeObjectMetadata) => ({
      standardId: TIMELINE_ACTIVITY_STANDARD_FIELD_IDS.custom,
      name: oppositeObjectMetadata.nameSingular,
      label: oppositeObjectMetadata.labelSingular,
      description: `Timeline Activity ${oppositeObjectMetadata.labelSingular}`,
      joinColumn: `${oppositeObjectMetadata.nameSingular}Id`,
      icon: 'IconTimeline',
    }),
    inverseSideTarget: () => CustomWorkspaceEntity,
    inverseSideFieldKey: 'timelineActivities',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  custom: Relation<CustomWorkspaceEntity>;
}

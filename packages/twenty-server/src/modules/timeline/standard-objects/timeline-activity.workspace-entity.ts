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
import { DepartmentWorkspaceEntity } from 'src/modules/department/standard-objects/department.workspace-entity';
import { EmployeeAwardWorkspaceEntity } from 'src/modules/employee-award/standard-objects/employee-award.workspace-entity';
import { EmployeeLevelWorkspaceEntity } from 'src/modules/employee-level/standard-objects/employee-level.workspace-entity';
import { EmployeeWorkspaceEntity } from 'src/modules/employee/standard-objects/employee.workspace-entity';
import { EmploymentTypeWorkspaceEntity } from 'src/modules/employment-type/standard-objects/employment-type.workspace-entity';
import { NoteWorkspaceEntity } from 'src/modules/note/standard-objects/note.workspace-entity';
import { OpportunityWorkspaceEntity } from 'src/modules/opportunity/standard-objects/opportunity.workspace-entity';
import { PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';
import { OrganizationPositionWorkspaceEntity } from 'src/modules/position/standard-objects/position.workspace-entity';
import { ProductCategoryWorkspaceEntity } from 'src/modules/product-category/standard-objects/product-category.workspace-entity';
import { ProductOptionGroupWorkspaceEntity } from 'src/modules/product-option-group/standard-objects/product-option-group.workspace-entity';
import { ProductOptionWorkspaceEntity } from 'src/modules/product-option/standard-objects/product-option.workspace-entity';
import { ProductTypeWorkspaceEntity } from 'src/modules/product-type/standard-objects/product-type.workspace-entity';
import { ProductVariantWorkspaceEntity } from 'src/modules/product-variant/standard-objects/product-variant.workspace-entity';
import { ProductWorkspaceEntity } from 'src/modules/product/standard-objects/product.workspace-entity';
import { TaskWorkspaceEntity } from 'src/modules/task/standard-objects/task.workspace-entity';
import { TeamWorkspaceEntity } from 'src/modules/team/standard-objects/team.workspace-entity';
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
    standardId: TIMELINE_ACTIVITY_STANDARD_FIELD_IDS.productType,
    type: RelationType.MANY_TO_ONE,
    label: msg`Product Type`,
    description: msg`Event product type`,
    icon: 'IconTag',
    inverseSideTarget: () => ProductTypeWorkspaceEntity,
    inverseSideFieldKey: 'timelineActivities',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  productType: Relation<ProductTypeWorkspaceEntity> | null;

  @WorkspaceJoinColumn('productType')
  productTypeId: string | null;

  @WorkspaceRelation({
    standardId: TIMELINE_ACTIVITY_STANDARD_FIELD_IDS.productCategory,
    type: RelationType.MANY_TO_ONE,
    label: msg`Product Category`,
    description: msg`Event product category`,
    icon: 'IconCategory',
    inverseSideTarget: () => ProductCategoryWorkspaceEntity,
    inverseSideFieldKey: 'timelineActivities',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  productCategory: Relation<ProductCategoryWorkspaceEntity> | null;

  @WorkspaceJoinColumn('productCategory')
  productCategoryId: string | null;

  @WorkspaceRelation({
    standardId: TIMELINE_ACTIVITY_STANDARD_FIELD_IDS.product,
    type: RelationType.MANY_TO_ONE,
    label: msg`Product`,
    description: msg`Event product`,
    icon: 'IconPackage',
    inverseSideTarget: () => ProductWorkspaceEntity,
    inverseSideFieldKey: 'timelineActivities',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  product: Relation<ProductWorkspaceEntity> | null;

  @WorkspaceJoinColumn('product')
  productId: string | null;

  @WorkspaceRelation({
    standardId: TIMELINE_ACTIVITY_STANDARD_FIELD_IDS.productVariant,
    type: RelationType.MANY_TO_ONE,
    label: msg`Product Variant`,
    description: msg`Event product variant`,
    icon: 'IconVersions',
    inverseSideTarget: () => ProductVariantWorkspaceEntity,
    inverseSideFieldKey: 'timelineActivities',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  productVariant: Relation<ProductVariantWorkspaceEntity> | null;

  @WorkspaceJoinColumn('productVariant')
  productVariantId: string | null;

  @WorkspaceRelation({
    standardId: TIMELINE_ACTIVITY_STANDARD_FIELD_IDS.productOption,
    type: RelationType.MANY_TO_ONE,
    label: msg`Product Option`,
    description: msg`Event product option`,
    icon: 'IconListDetails',
    inverseSideTarget: () => ProductOptionWorkspaceEntity,
    inverseSideFieldKey: 'timelineActivities',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  productOption: Relation<ProductOptionWorkspaceEntity> | null;

  @WorkspaceJoinColumn('productOption')
  productOptionId: string | null;

  @WorkspaceRelation({
    standardId: TIMELINE_ACTIVITY_STANDARD_FIELD_IDS.productOptionGroup,
    type: RelationType.MANY_TO_ONE,
    label: msg`Product Option Group`,
    description: msg`Event product option group`,
    icon: 'IconCategory2',
    inverseSideTarget: () => ProductOptionGroupWorkspaceEntity,
    inverseSideFieldKey: 'timelineActivities',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  productOptionGroup: Relation<ProductOptionGroupWorkspaceEntity> | null;

  @WorkspaceJoinColumn('productOptionGroup')
  productOptionGroupId: string | null;

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
    standardId: TIMELINE_ACTIVITY_STANDARD_FIELD_IDS.department,
    type: RelationType.MANY_TO_ONE,
    label: msg`Department`,
    description: msg`Event department`,
    icon: 'IconHierarchy',
    inverseSideTarget: () => DepartmentWorkspaceEntity,
    inverseSideFieldKey: 'timelineActivities',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  department: Relation<DepartmentWorkspaceEntity> | null;

  @WorkspaceJoinColumn('department')
  departmentId: string | null;

  @WorkspaceRelation({
    standardId: TIMELINE_ACTIVITY_STANDARD_FIELD_IDS.employee,
    type: RelationType.MANY_TO_ONE,
    label: msg`Employee`,
    description: msg`Event employee`,
    icon: 'IconUser',
    inverseSideTarget: () => EmployeeWorkspaceEntity,
    inverseSideFieldKey: 'timelineActivities',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  employee: Relation<EmployeeWorkspaceEntity> | null;

  @WorkspaceJoinColumn('employee')
  employeeId: string | null;

  @WorkspaceRelation({
    standardId: TIMELINE_ACTIVITY_STANDARD_FIELD_IDS.employeeAward,
    type: RelationType.MANY_TO_ONE,
    label: msg`Employee Award`,
    description: msg`Event employee award`,
    icon: 'IconAward',
    inverseSideTarget: () => EmployeeAwardWorkspaceEntity,
    inverseSideFieldKey: 'timelineActivities',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  employeeAward: Relation<EmployeeAwardWorkspaceEntity> | null;

  @WorkspaceJoinColumn('employeeAward')
  employeeAwardId: string | null;

  @WorkspaceRelation({
    standardId: TIMELINE_ACTIVITY_STANDARD_FIELD_IDS.employeeLevel,
    type: RelationType.MANY_TO_ONE,
    label: msg`Employee Level`,
    description: msg`Event employee level`,
    icon: 'IconStairs',
    inverseSideTarget: () => EmployeeLevelWorkspaceEntity,
    inverseSideFieldKey: 'timelineActivities',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  employeeLevel: Relation<EmployeeLevelWorkspaceEntity> | null;

  @WorkspaceJoinColumn('employeeLevel')
  employeeLevelId: string | null;

  @WorkspaceRelation({
    standardId: TIMELINE_ACTIVITY_STANDARD_FIELD_IDS.employmentType,
    type: RelationType.MANY_TO_ONE,
    label: msg`Employment Type`,
    description: msg`Event employment type`,
    icon: 'IconBriefcase',
    inverseSideTarget: () => EmploymentTypeWorkspaceEntity,
    inverseSideFieldKey: 'timelineActivities',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  employmentType: Relation<EmploymentTypeWorkspaceEntity> | null;

  @WorkspaceJoinColumn('employmentType')
  employmentTypeId: string | null;

  @WorkspaceRelation({
    standardId: TIMELINE_ACTIVITY_STANDARD_FIELD_IDS.organizationPosition,
    type: RelationType.MANY_TO_ONE,
    label: msg`Position`,
    description: msg`Event position`,
    icon: 'IconTarget',
    inverseSideTarget: () => OrganizationPositionWorkspaceEntity,
    inverseSideFieldKey: 'timelineActivities',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  organizationPosition: Relation<OrganizationPositionWorkspaceEntity> | null;

  @WorkspaceJoinColumn('organizationPosition')
  organizationPositionId: string | null;

  @WorkspaceRelation({
    standardId: TIMELINE_ACTIVITY_STANDARD_FIELD_IDS.team,
    type: RelationType.MANY_TO_ONE,
    label: msg`Team`,
    description: msg`Event team`,
    icon: 'IconUsers',
    inverseSideTarget: () => TeamWorkspaceEntity,
    inverseSideFieldKey: 'timelineActivities',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  team: Relation<TeamWorkspaceEntity> | null;

  @WorkspaceJoinColumn('team')
  teamId: string | null;

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

import { AttachmentWorkspaceEntity } from 'src/modules/attachment/standard-objects/attachment.workspace-entity';
import { BlocklistWorkspaceEntity } from 'src/modules/blocklist/standard-objects/blocklist.workspace-entity';
import { BoQWorkspaceEntity } from 'src/modules/boq/standard-objects/boq.workspace-entity';
import { CalendarChannelEventAssociationWorkspaceEntity } from 'src/modules/calendar/common/standard-objects/calendar-channel-event-association.workspace-entity';
import { CalendarChannelWorkspaceEntity } from 'src/modules/calendar/common/standard-objects/calendar-channel.workspace-entity';
import { CalendarEventParticipantWorkspaceEntity } from 'src/modules/calendar/common/standard-objects/calendar-event-participant.workspace-entity';
import { CalendarEventWorkspaceEntity } from 'src/modules/calendar/common/standard-objects/calendar-event.workspace-entity';
import { CompanyWorkspaceEntity } from 'src/modules/company/standard-objects/company.workspace-entity';
import { ConnectedAccountWorkspaceEntity } from 'src/modules/connected-account/standard-objects/connected-account.workspace-entity';
import { DashboardWorkspaceEntity } from 'src/modules/dashboard/standard-objects/dashboard.workspace-entity';
import { FavoriteFolderWorkspaceEntity } from 'src/modules/favorite-folder/standard-objects/favorite-folder.workspace-entity';
import { FavoriteWorkspaceEntity } from 'src/modules/favorite/standard-objects/favorite.workspace-entity';
import { InventoryWorkspaceEntity } from 'src/modules/inventory/standard-objects/inventory.workspace-entity';
import { JobTitleWorkspaceEntity } from 'src/modules/job-title/standard-objects/job-title.workspace-entity';
import { ManufacturerWorkspaceEntity } from 'src/modules/manufacturer/standard-objects/manufacturer.workspace-entity';
import { MaterialApprovalWorkspaceEntity } from 'src/modules/material-approval/standard-objects/material-approval.workspace-entity';
import { MaterialCategoryWorkspaceEntity } from 'src/modules/material-category/standard-objects/material-category.workspace-entity';
import { MaterialGroupWorkspaceEntity } from 'src/modules/material-group/standard-objects/material-group.workspace-entity';
import { MaterialOrderWorkspaceEntity } from 'src/modules/material-order/standard-objects/material-order.workspace-entity';
import { MaterialPriceHistoryWorkspaceEntity } from 'src/modules/material-price-history/standard-objects/material-price-history.workspace-entity';
import { MaterialPriceWorkspaceEntity } from 'src/modules/material-price/standard-objects/material-price.workspace-entity';
import { MaterialPurchaseRequestWorkspaceEntity } from 'src/modules/material-purchase-request/standard-objects/material-purchase-request.workspace-entity';
import { MaterialRequestWorkspaceEntity } from 'src/modules/material-request/standard-objects/material-request.workspace-entity';
import { MaterialWorkspaceEntity } from 'src/modules/material/standard-objects/material.workspace-entity';
import { MessageChannelMessageAssociationWorkspaceEntity } from 'src/modules/messaging/common/standard-objects/message-channel-message-association.workspace-entity';
import { MessageChannelWorkspaceEntity } from 'src/modules/messaging/common/standard-objects/message-channel.workspace-entity';
import { MessageFolderWorkspaceEntity } from 'src/modules/messaging/common/standard-objects/message-folder.workspace-entity';
import { MessageParticipantWorkspaceEntity } from 'src/modules/messaging/common/standard-objects/message-participant.workspace-entity';
import { MessageThreadWorkspaceEntity } from 'src/modules/messaging/common/standard-objects/message-thread.workspace-entity';
import { MessageWorkspaceEntity } from 'src/modules/messaging/common/standard-objects/message.workspace-entity';
import { NoteTargetWorkspaceEntity } from 'src/modules/note/standard-objects/note-target.workspace-entity';
import { NoteWorkspaceEntity } from 'src/modules/note/standard-objects/note.workspace-entity';
import { OpportunityWorkspaceEntity } from 'src/modules/opportunity/standard-objects/opportunity.workspace-entity';
import { PermissionWorkspaceEntity } from 'src/modules/permission/standard-objects/permission.workspace-entity';
import { PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';
import { PriceContractWorkspaceEntity } from 'src/modules/price-contract/standard-objects/price-contract.workspace-entity';
import { ProjectUserWorkspaceEntity } from 'src/modules/project-user/standard-objects/project-user.workspace-entity';
import { ProjectWorkspaceEntity } from 'src/modules/project/standard-objects/project.workspace-entity';
import { QuotationItemWorkspaceEntity } from 'src/modules/quotation-item/standard-objects/quotation-item.workspace-entity';
import { QuotationWorkspaceEntity } from 'src/modules/quotation/standar-objects/quotation.workspace-entity';
import { RoleWorkspaceEntity } from 'src/modules/role/standard-objects/role.workspace-entity';
import { SupplierWorkspaceEntity } from 'src/modules/supplier/standard-objects/supplier.workspace-entity';
import { TaskTargetWorkspaceEntity } from 'src/modules/task/standard-objects/task-target.workspace-entity';
import { TaskWorkspaceEntity } from 'src/modules/task/standard-objects/task.workspace-entity';
import { TimelineActivityWorkspaceEntity } from 'src/modules/timeline/standard-objects/timeline-activity.workspace-entity';
import { AppUserWorkspaceEntity } from 'src/modules/user/standard-objects/user.workspace-entity';
import { WarehouseWorkspaceEntity } from 'src/modules/warehouse/standard-objects/warehouse.workspace-entity';
import { WorkflowAutomatedTriggerWorkspaceEntity } from 'src/modules/workflow/common/standard-objects/workflow-automated-trigger.workspace-entity';
import { WorkflowRunWorkspaceEntity } from 'src/modules/workflow/common/standard-objects/workflow-run.workspace-entity';
import { WorkflowVersionWorkspaceEntity } from 'src/modules/workflow/common/standard-objects/workflow-version.workspace-entity';
import { WorkflowWorkspaceEntity } from 'src/modules/workflow/common/standard-objects/workflow.workspace-entity';
import { WorkspaceMemberWorkspaceEntity } from 'src/modules/workspace-member/standard-objects/workspace-member.workspace-entity';

// TODO: Maybe we should automate this with the DiscoverService of Nest.JS
export const standardObjectMetadataDefinitions = [
  AttachmentWorkspaceEntity,
  BlocklistWorkspaceEntity,
  CalendarEventWorkspaceEntity,
  CalendarChannelWorkspaceEntity,
  CalendarChannelEventAssociationWorkspaceEntity,
  CalendarEventParticipantWorkspaceEntity,
  CompanyWorkspaceEntity,
  ConnectedAccountWorkspaceEntity,
  DashboardWorkspaceEntity,
  FavoriteWorkspaceEntity,
  FavoriteFolderWorkspaceEntity,
  TimelineActivityWorkspaceEntity,
  WorkflowWorkspaceEntity,
  WorkflowVersionWorkspaceEntity,
  WorkflowRunWorkspaceEntity,
  WorkflowAutomatedTriggerWorkspaceEntity,
  WorkspaceMemberWorkspaceEntity,
  MessageThreadWorkspaceEntity,
  MessageWorkspaceEntity,
  MessageChannelWorkspaceEntity,
  MessageParticipantWorkspaceEntity,
  MessageFolderWorkspaceEntity,
  MessageChannelMessageAssociationWorkspaceEntity,
  NoteWorkspaceEntity,
  NoteTargetWorkspaceEntity,
  OpportunityWorkspaceEntity,
  PermissionWorkspaceEntity,
  PersonWorkspaceEntity,
  ProjectWorkspaceEntity,
  ProjectUserWorkspaceEntity,
  RoleWorkspaceEntity,
  TaskWorkspaceEntity,
  TaskTargetWorkspaceEntity,
  SupplierWorkspaceEntity,
  AppUserWorkspaceEntity,
  WarehouseWorkspaceEntity,
  InventoryWorkspaceEntity,
  JobTitleWorkspaceEntity,
  ManufacturerWorkspaceEntity,
  MaterialWorkspaceEntity,
  MaterialCategoryWorkspaceEntity,
  MaterialGroupWorkspaceEntity,
  MaterialOrderWorkspaceEntity,
  MaterialPurchaseRequestWorkspaceEntity,
  MaterialPriceWorkspaceEntity,
  MaterialPriceHistoryWorkspaceEntity,
  PriceContractWorkspaceEntity,
  MaterialRequestWorkspaceEntity,
  MaterialApprovalWorkspaceEntity,
  BoQWorkspaceEntity,
  QuotationWorkspaceEntity,
  QuotationItemWorkspaceEntity,
];

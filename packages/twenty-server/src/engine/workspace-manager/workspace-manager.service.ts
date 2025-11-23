import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

import { DataSource, Repository } from 'typeorm';

import { ApplicationService } from 'src/engine/core-modules/application/application.service';
import { FeatureFlagService } from 'src/engine/core-modules/feature-flag/services/feature-flag.service';
import { SharePointWorkspaceInitService } from 'src/engine/core-modules/sharepoint/sharepoint-workspace-init.service';
import { SharePointService } from 'src/engine/core-modules/sharepoint/sharepoint.service';
import { UserWorkspaceEntity } from 'src/engine/core-modules/user-workspace/user-workspace.entity';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import {
  type DataSourceEntity,
  DataSourceTypeEnum,
} from 'src/engine/metadata-modules/data-source/data-source.entity';
import { DataSourceService } from 'src/engine/metadata-modules/data-source/data-source.service';
import { ObjectMetadataServiceV2 } from 'src/engine/metadata-modules/object-metadata/object-metadata-v2.service';
import { RoleTargetsEntity } from 'src/engine/metadata-modules/role/role-targets.entity';
import { RoleEntity } from 'src/engine/metadata-modules/role/role.entity';
import { RoleService } from 'src/engine/metadata-modules/role/role.service';
import { UserRoleService } from 'src/engine/metadata-modules/user-role/user-role.service';
import { WorkspaceMigrationService } from 'src/engine/metadata-modules/workspace-migration/workspace-migration.service';
import { TwentyORMGlobalManager } from 'src/engine/twenty-orm/twenty-orm-global.manager';
import { WorkspaceDataSourceService } from 'src/engine/workspace-datasource/workspace-datasource.service';
import { prefillCoreViews } from 'src/engine/workspace-manager/standard-objects-prefill-data/prefill-core-views';
import { standardObjectsPrefillData } from 'src/engine/workspace-manager/standard-objects-prefill-data/standard-objects-prefill-data';
import { ADMIN_ROLE } from 'src/engine/workspace-manager/workspace-sync-metadata/standard-roles/roles/admin-role';
import { WorkspaceSyncMetadataService } from 'src/engine/workspace-manager/workspace-sync-metadata/workspace-sync-metadata.service';

@Injectable()
export class WorkspaceManagerService {
  private readonly logger = new Logger(WorkspaceManagerService.name);

  constructor(
    @InjectDataSource()
    private readonly coreDataSource: DataSource,
    private readonly workspaceDataSourceService: WorkspaceDataSourceService,
    private readonly workspaceMigrationService: WorkspaceMigrationService,
    private readonly objectMetadataServiceV2: ObjectMetadataServiceV2,
    private readonly dataSourceService: DataSourceService,
    private readonly workspaceSyncMetadataService: WorkspaceSyncMetadataService,
    @InjectRepository(UserWorkspaceEntity)
    private readonly userWorkspaceRepository: Repository<UserWorkspaceEntity>,
    private readonly roleService: RoleService,
    private readonly userRoleService: UserRoleService,
    private readonly featureFlagService: FeatureFlagService,
    @InjectRepository(WorkspaceEntity)
    private readonly workspaceRepository: Repository<WorkspaceEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    @InjectRepository(RoleTargetsEntity)
    private readonly roleTargetsRepository: Repository<RoleTargetsEntity>,
    protected readonly twentyORMGlobalManager: TwentyORMGlobalManager,
    private readonly applicationService: ApplicationService,
    private readonly sharePointService: SharePointService,
    private readonly sharePointWorkspaceInitService: SharePointWorkspaceInitService,
  ) {}

  public async init({
    workspace,
    userId,
  }: {
    workspace: WorkspaceEntity;
    userId: string;
  }): Promise<void> {
    const workspaceId = workspace.id;

    // Determine datasource type from ENV
    const datasourceType =
      process.env.WORKSPACE_DATASOURCE === 'sharepoint'
        ? DataSourceTypeEnum.SHAREPOINT
        : DataSourceTypeEnum.POSTGRES;

    let schemaName: string;

    if (datasourceType === DataSourceTypeEnum.SHAREPOINT) {
      // ====== SharePoint Initialization ======
      const tenantId = process.env.WORKSPACE_TENANT_ID;

      if (!tenantId) {
        throw new Error(
          'WORKSPACE_TENANT_ID must be set when WORKSPACE_DATASOURCE=sharepoint',
        );
      }

      this.logger.log('Initializing SharePoint workspace...');

      // Step 1: Get or create SharePoint site
      const site = await this.sharePointService.getTwentySiteForTenant(
        tenantId,
        workspace.displayName || workspace.subdomain,
      );

      // Step 2: Save siteId to workspace
      await this.workspaceRepository.update(workspaceId, {
        sharePointSiteId: site.id,
      });

      // Reload workspace to get updated sharePointSiteId
      workspace = await this.workspaceRepository.findOneBy({
        id: workspaceId,
      });

      if (!workspace) {
        throw new Error(`Workspace ${workspaceId} not found after update`);
      }

      schemaName = 'sharepoint'; // Placeholder

      this.logger.log(`SharePoint site created/found: ${site.id}`);
    } else {
      // ====== PostgreSQL Initialization ======
      const schemaCreationStart = performance.now();

      schemaName =
        await this.workspaceDataSourceService.createWorkspaceDBSchema(
          workspaceId,
        );

      const schemaCreationEnd = performance.now();

      this.logger.log(
        `Schema creation took ${schemaCreationEnd - schemaCreationStart}ms`,
      );
    }

    const dataSourceMetadataCreationStart = performance.now();
    const dataSourceMetadata =
      await this.dataSourceService.createDataSourceMetadata(
        workspaceId,
        schemaName,
        datasourceType, // Pass datasource type
      );

    const featureFlags =
      await this.featureFlagService.getWorkspaceFeatureFlagsMap(workspaceId);

    await this.applicationService.createTwentyStandardApplication({
      workspaceId,
    });

    // TODO later replace by twenty-standard installation aka workspaceMigration run
    await this.workspaceSyncMetadataService.synchronize({
      workspaceId,
      dataSourceId: dataSourceMetadata.id,
      featureFlags,
    });

    const dataSourceMetadataCreationEnd = performance.now();

    this.logger.log(
      `Metadata creation took ${dataSourceMetadataCreationEnd - dataSourceMetadataCreationStart}ms`,
    );

    await this.setupDefaultRoles(workspaceId, userId);

    // SharePoint-specific: Create Lists after ObjectMetadata synced
    if (datasourceType === DataSourceTypeEnum.SHAREPOINT) {
      const tenantId = process.env.WORKSPACE_TENANT_ID!;
      const siteId = workspace.sharePointSiteId!;

      this.logger.log('Initializing SharePoint Lists...');

      // Get synced ObjectMetadata
      const objectMetadataCollection =
        await this.objectMetadataServiceV2.findManyWithinWorkspace(workspaceId);

      // Initialize SharePoint Lists
      await this.sharePointWorkspaceInitService.initializeWorkspace(
        workspaceId,
        tenantId,
        siteId,
        objectMetadataCollection,
      );

      this.logger.log('SharePoint Lists initialization completed');

      // Skip prefill for SharePoint - prefill uses raw SQL which doesn't work with SharePoint
      // TODO: Refactor prefill to use repository methods instead of raw SQL
      this.logger.log(
        'Skipping prefill for SharePoint (requires repository-based implementation)',
      );
    } else {
      // PostgreSQL: Prefill data
      const prefillStandardObjectsStart = performance.now();

      await this.prefillWorkspaceWithStandardObjectsRecords(
        dataSourceMetadata,
        workspaceId,
        featureFlags,
      );

      const prefillStandardObjectsEnd = performance.now();

      this.logger.log(
        `Prefill standard objects took ${prefillStandardObjectsEnd - prefillStandardObjectsStart}ms`,
      );
    }
  }

  private async prefillWorkspaceWithStandardObjectsRecords(
    dataSourceMetadata: DataSourceEntity,
    workspaceId: string,
    featureFlags: Record<string, boolean>,
  ) {
    const createdObjectMetadata =
      await this.objectMetadataServiceV2.findManyWithinWorkspace(workspaceId);

    await standardObjectsPrefillData(
      this.coreDataSource,
      dataSourceMetadata.schema,
      createdObjectMetadata,
    );

    await prefillCoreViews({
      coreDataSource: this.coreDataSource,
      workspaceId,
      objectMetadataItems: createdObjectMetadata,
      workspaceSchemaName: dataSourceMetadata.schema,
      featureFlags,
    });
  }

  // TODO investigate why some entities are not on cascade delete
  // Are foreign keys correctly applied ?
  public async delete(workspaceId: string): Promise<void> {
    await this.roleTargetsRepository.delete({
      workspaceId,
    });
    await this.roleRepository.delete({
      workspaceId,
    });

    await this.objectMetadataServiceV2.deleteWorkspaceAllObjectMetadata({
      workspaceId,
    });

    await this.workspaceMigrationService.deleteAllWithinWorkspace(workspaceId);
    await this.dataSourceService.delete(workspaceId);
    await this.workspaceDataSourceService.deleteWorkspaceDBSchema(workspaceId);
  }

  private async setupDefaultRoles(
    workspaceId: string,
    userId: string,
  ): Promise<void> {
    const adminRole = await this.roleRepository.findOne({
      where: {
        standardId: ADMIN_ROLE.standardId,
        workspaceId,
      },
    });

    if (adminRole) {
      const userWorkspace = await this.userWorkspaceRepository.findOneOrFail({
        where: { workspaceId, userId },
      });

      await this.userRoleService.assignRoleToUserWorkspace({
        workspaceId,
        userWorkspaceId: userWorkspace.id,
        roleId: adminRole.id,
      });
    }

    const memberRole = await this.roleService.createMemberRole({
      workspaceId,
    });

    await this.workspaceRepository.update(workspaceId, {
      defaultRoleId: memberRole.id,
    });
  }
}

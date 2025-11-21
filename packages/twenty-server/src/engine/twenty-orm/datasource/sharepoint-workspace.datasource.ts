import { type ObjectsPermissionsByRoleId } from 'twenty-shared/types';
import {
    type DataSourceOptions,
    type EntityTarget,
    type ObjectLiteral,
} from 'typeorm';

import { type FeatureFlagMap } from 'src/engine/core-modules/feature-flag/interfaces/feature-flag-map.interface';
import { type WorkspaceInternalContext } from 'src/engine/twenty-orm/interfaces/workspace-internal-context.interface';

import { type AuthContext } from 'src/engine/core-modules/auth/types/auth-context.type';
import { type SharePointService } from 'src/engine/core-modules/sharepoint/sharepoint.service';
import { WorkspaceDataSource } from 'src/engine/twenty-orm/datasource/workspace.datasource';
import { SharePointRepository } from 'src/engine/twenty-orm/repository/sharepoint.repository';
import { type RolePermissionConfig } from 'src/engine/twenty-orm/types/role-permission-config';

export interface SharePointDataSourceOptions {
  workspaceId: string;
  tenantId: string;
  siteId: string;
  siteName?: string;
}

export class SharePointWorkspaceDataSource extends WorkspaceDataSource {
  private readonly sharePointService: SharePointService;
  private readonly sharePointOptions: SharePointDataSourceOptions;

  constructor(
    internalContext: WorkspaceInternalContext,
    options: DataSourceOptions,
    featureFlagMapVersion: string,
    featureFlagMap: FeatureFlagMap,
    rolesPermissionsVersion: string,
    permissionsPerRoleId: ObjectsPermissionsByRoleId,
    isPoolSharingEnabled: boolean,
    sharePointService: SharePointService,
    sharePointOptions: SharePointDataSourceOptions,
  ) {
    // Pass minimal options to parent, actual data comes from SharePoint
    super(
      internalContext,
      {
        type: 'postgres',
        host: 'localhost', // Dummy values - won't be used
        port: 5432,
        username: 'sharepoint',
        password: 'sharepoint',
        database: 'sharepoint',
      },
      featureFlagMapVersion,
      featureFlagMap,
      rolesPermissionsVersion,
      permissionsPerRoleId,
      isPoolSharingEnabled,
    );

    this.sharePointService = sharePointService;
    this.sharePointOptions = sharePointOptions;
  }

  override getRepository<Entity extends ObjectLiteral>(
    target: EntityTarget<Entity>,
    permissionOptions?: RolePermissionConfig,
    authContext?: AuthContext,
  ): SharePointRepository<Entity> {
    // Get the object metadata for this entity
    const entityName = this.getEntityName(target);
    const objectMetadataId =
      this.internalContext.objectMetadataMaps.idByNameSingular[entityName];

    if (!objectMetadataId) {
      throw new Error(`Object metadata ID not found for entity: ${entityName}`);
    }

    const objectMetadata =
      this.internalContext.objectMetadataMaps.byId[objectMetadataId];

    if (!objectMetadata) {
      throw new Error(`Object metadata not found for entity: ${entityName}`);
    }

    // Extract permission settings
    const shouldBypassPermissionChecks =
      permissionOptions && 'shouldBypassPermissionChecks' in permissionOptions
        ? permissionOptions.shouldBypassPermissionChecks
        : false;

    // Create and return a SharePoint repository
    return new SharePointRepository<Entity>(
      this.sharePointService,
      this.sharePointOptions.siteId,
      objectMetadata.namePlural, // Use plural name as SharePoint List name
      this.sharePointOptions.tenantId,
      this.internalContext,
      target,
      this.manager,
      this.featureFlagMap,
      undefined, // queryRunner not available in SharePoint mode
      undefined, // objectRecordsPermissions not applicable
      shouldBypassPermissionChecks,
      authContext,
    );
  }

  private getEntityName(target: EntityTarget<unknown>): string {
    if (typeof target === 'function') {
      return target.name;
    }

    if (typeof target === 'string') {
      return target;
    }

    // EntitySchema case
    if ('options' in target && target.options.name) {
      return target.options.name;
    }

    throw new Error('Unable to determine entity name from target');
  }

  override async initialize(): Promise<this> {
    // For SharePoint, we don't need to initialize a database connection
    // Just verify the SharePoint site exists and we can access it
    try {
      const token = await this.sharePointService.getAppOnlyToken(
        this.sharePointOptions.tenantId,
      );

      await this.sharePointService.getSiteLists(
        this.sharePointOptions.siteId,
        token,
      );
    } catch (error) {
      throw new Error(
        `Failed to initialize SharePoint workspace datasource: ${error.message}`,
      );
    }

    return this;
  }

  override async destroy(): Promise<void> {
    // SharePoint doesn't require connection cleanup like PostgreSQL
    // Just call parent to handle any cleanup logic
    return Promise.resolve();
  }
}

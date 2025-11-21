import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import axios, { AxiosInstance } from 'axios';

import {
    SharePointAuthToken,
    SharePointTenantInfo,
} from 'src/engine/core-modules/sharepoint/types/sharepoint-auth.type';
import {
    SharePointList,
    SharePointListCreationRequest,
    SharePointListItem,
} from 'src/engine/core-modules/sharepoint/types/sharepoint-list.type';
import { SharePointQueryOptions } from 'src/engine/core-modules/sharepoint/types/sharepoint-query-options.type';
import {
    SharePointSite,
    SharePointSiteCreationRequest,
} from 'src/engine/core-modules/sharepoint/types/sharepoint-site.type';

@Injectable()
export class SharePointService {
  private readonly logger = new Logger(SharePointService.name);
  private readonly httpClient: AxiosInstance;
  private readonly tokenCache = new Map<string, SharePointAuthToken>();

  constructor(private readonly configService: ConfigService) {
    this.httpClient = axios.create({
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Initialize SharePoint for a user - main entry point
   */
  async initializeForUser(
    userEmail: string,
    tenantName?: string,
  ): Promise<SharePointSite> {
    this.logger.log(
      `Initializing SharePoint for user: ${userEmail}, tenant: ${tenantName}`,
    );

    const tenantInfo = await this.extractTenantInfo(userEmail);
    const token = await this.getAppOnlyToken(tenantInfo.tenantId);

    return this.getTwentySiteForTenant(
      tenantInfo.tenantId,
      tenantName || tenantInfo.tenantName,
      token,
    );
  }

  /**
   * Extract tenant information from user email
   */
  private async extractTenantInfo(
    userEmail: string,
  ): Promise<SharePointTenantInfo> {
    const domain = userEmail.split('@')[1];

    if (!domain) {
      throw new Error(`Invalid email format: ${userEmail}`);
    }

    // In production, this would use Microsoft Graph API to get tenant details
    // For now, we'll construct basic tenant info
    const tenantId = await this.resolveTenantId(domain);

    return {
      tenantId,
      tenantDomain: domain,
      tenantName: domain.split('.')[0], // Simple extraction, e.g., "acme" from "acme.com"
    };
  }

  /**
   * Resolve tenant ID from domain using Microsoft OpenID configuration
   */
  private async resolveTenantId(domain: string): Promise<string> {
    try {
      const loginBaseUrl = this.configService.get<string>(
        'sharepoint.loginBaseUrl',
      );
      const response = await this.httpClient.get(
        `${loginBaseUrl}/${domain}/.well-known/openid-configuration`,
      );

      const issuer = response.data.issuer;
      const tenantId = issuer.split('/')[3];

      return tenantId;
    } catch (error) {
      this.logger.error(`Failed to resolve tenant ID for domain ${domain}`, {
        error,
      });
      throw new Error(`Could not resolve tenant for domain: ${domain}`);
    }
  }

  /**
   * Get app-only access token using client credentials flow
   */
  async getAppOnlyToken(tenantId: string): Promise<string> {
    const cacheKey = `token_${tenantId}`;
    const cached = this.tokenCache.get(cacheKey);

    // Return cached token if valid
    if (cached && cached.expiresAt > new Date()) {
      this.logger.debug(`Using cached token for tenant: ${tenantId}`);

      return cached.accessToken;
    }

    this.logger.log(`Acquiring new app-only token for tenant: ${tenantId}`);

    const clientId = this.configService.get<string>('sharepoint.clientId');
    const clientSecret = this.configService.get<string>(
      'sharepoint.clientSecret',
    );
    const scope = this.configService.get<string>('sharepoint.defaultScope');
    const loginBaseUrl = this.configService.get<string>(
      'sharepoint.loginBaseUrl',
    );

    try {
      const params = new URLSearchParams();

      params.append('client_id', clientId || '');
      params.append('client_secret', clientSecret || '');
      params.append('scope', scope || '');
      params.append('grant_type', 'client_credentials');

      const response = await this.httpClient.post(
        `${loginBaseUrl}/${tenantId}/oauth2/v2.0/token`,
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      const tokenData = response.data;
      const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000);

      const token: SharePointAuthToken = {
        accessToken: tokenData.access_token,
        tokenType: tokenData.token_type,
        expiresIn: tokenData.expires_in,
        expiresAt,
        scope: tokenData.scope,
      };

      // Cache the token
      this.tokenCache.set(cacheKey, token);

      return token.accessToken;
    } catch (error) {
      this.logger.error(`Failed to acquire token for tenant ${tenantId}`, {
        error,
      });
      throw new Error(`Authentication failed for tenant: ${tenantId}`);
    }
  }

  /**
   * Get or create the Twenty site for a tenant
   */
  async getTwentySiteForTenant(
    tenantId: string,
    tenantName?: string,
    token?: string,
  ): Promise<SharePointSite> {
    const accessToken = token || (await this.getAppOnlyToken(tenantId));
    const siteName = `Twenty - ${tenantName || 'Default'}`;

    // Try to find existing site
    const existingSite = await this.findTwentySite(siteName, accessToken);

    if (existingSite) {
      this.logger.log(
        `Found existing Twenty site: ${existingSite.displayName}`,
      );

      return existingSite;
    }

    // Create new site
    this.logger.log(`Creating new Twenty site: ${siteName}`);

    return this.createTwentySite(
      siteName,
      tenantName || 'Default',
      accessToken,
    );
  }

  /**
   * Find a Twenty site by name
   */
  async findTwentySite(
    siteName: string,
    token: string,
  ): Promise<SharePointSite | null> {
    const graphApiBaseUrl = this.configService.get<string>(
      'sharepoint.graphApiBaseUrl',
    );

    try {
      const response = await this.httpClient.get(
        `${graphApiBaseUrl}/sites?search=${encodeURIComponent(siteName)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const sites = response.data.value as SharePointSite[];
      const foundSite = sites.find(
        (site) => site.displayName === siteName || site.name.includes('Twenty'),
      );

      return foundSite || null;
    } catch (error) {
      this.logger.error(`Error searching for site: ${siteName}`, { error });

      return null;
    }
  }

  /**
   * Create a new Twenty SharePoint site
   */
  async createTwentySite(
    siteName: string,
    tenantName: string,
    token: string,
  ): Promise<SharePointSite> {
    const graphApiBaseUrl = this.configService.get<string>(
      'sharepoint.graphApiBaseUrl',
    );

    const siteRequest: SharePointSiteCreationRequest = {
      displayName: siteName,
      name: `twenty-${tenantName.toLowerCase().replace(/\s+/g, '-')}`,
      description: `Twenty CRM workspace for ${tenantName}`,
    };

    try {
      const response = await this.httpClient.post(
        `${graphApiBaseUrl}/sites/root/sites`,
        siteRequest,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      this.logger.log(`Created SharePoint site: ${siteName}`);

      return response.data as SharePointSite;
    } catch (error) {
      this.logger.error(`Failed to create site: ${siteName}`, { error });
      throw new Error(`Could not create SharePoint site: ${siteName}`);
    }
  }

  /**
   * Get all lists in a site
   */
  async getSiteLists(siteId: string, token: string): Promise<SharePointList[]> {
    const graphApiBaseUrl = this.configService.get<string>(
      'sharepoint.graphApiBaseUrl',
    );

    try {
      const response = await this.httpClient.get(
        `${graphApiBaseUrl}/sites/${siteId}/lists`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data.value as SharePointList[];
    } catch (error) {
      this.logger.error(`Failed to get lists for site: ${siteId}`, { error });
      throw new Error(`Could not retrieve lists for site: ${siteId}`);
    }
  }

  /**
   * Get all columns in a SharePoint list
   */
  async getListColumns(
    siteId: string,
    listId: string,
    token: string,
  ): Promise<any[]> {
    const graphApiBaseUrl = this.configService.get<string>(
      'sharepoint.graphApiBaseUrl',
    );

    try {
      const response = await this.httpClient.get(
        `${graphApiBaseUrl}/sites/${siteId}/lists/${listId}/columns`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data.value as any[];
    } catch (error) {
      this.logger.error(`Failed to get columns for list: ${listId}`, { error });
      throw new Error(`Could not retrieve columns for list: ${listId}`);
    }
  }

  /**
   * Create a new list in a site
   */
  async createList(
    siteId: string,
    listRequest: SharePointListCreationRequest,
    token: string,
  ): Promise<SharePointList> {
    const graphApiBaseUrl = this.configService.get<string>(
      'sharepoint.graphApiBaseUrl',
    );

    try {
      const response = await this.httpClient.post(
        `${graphApiBaseUrl}/sites/${siteId}/lists`,
        {
          displayName: listRequest.displayName,
          description: listRequest.description,
          list: {
            template: listRequest.template || 'genericList',
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      this.logger.log(`Created list: ${listRequest.displayName}`);

      return response.data as SharePointList;
    } catch (error) {
      this.logger.error(`Failed to create list: ${listRequest.displayName}`, {
        error,
      });
      throw new Error(`Could not create list: ${listRequest.displayName}`);
    }
  }

  /**
   * Get list items with optional query parameters
   */
  async getListItems(
    siteId: string,
    listId: string,
    options?: SharePointQueryOptions,
    token?: string,
  ): Promise<SharePointListItem[]> {
    if (!token) {
      throw new Error('Access token is required');
    }

    const graphApiBaseUrl = this.configService.get<string>(
      'sharepoint.graphApiBaseUrl',
    );

    const queryParams = this.buildQueryString(options);
    const url = `${graphApiBaseUrl}/sites/${siteId}/lists/${listId}/items?${queryParams}&expand=fields`;

    try {
      const response = await this.httpClient.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.value as SharePointListItem[];
    } catch (error) {
      this.logger.error(`Failed to get items from list: ${listId}`, { error });
      throw new Error(`Could not retrieve items from list: ${listId}`);
    }
  }

  /**
   * Create a new list item
   */
  async createListItem(
    siteId: string,
    listId: string,
    data: Record<string, unknown>,
    token: string,
  ): Promise<SharePointListItem> {
    const graphApiBaseUrl = this.configService.get<string>(
      'sharepoint.graphApiBaseUrl',
    );

    try {
      const response = await this.httpClient.post(
        `${graphApiBaseUrl}/sites/${siteId}/lists/${listId}/items`,
        {
          fields: data,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data as SharePointListItem;
    } catch (error) {
      this.logger.error(`Failed to create item in list: ${listId}`, { error });
      throw new Error(`Could not create item in list: ${listId}`);
    }
  }

  /**
   * Update an existing list item
   */
  async updateListItem(
    siteId: string,
    listId: string,
    itemId: string,
    data: Record<string, unknown>,
    token: string,
  ): Promise<SharePointListItem> {
    const graphApiBaseUrl = this.configService.get<string>(
      'sharepoint.graphApiBaseUrl',
    );

    try {
      const response = await this.httpClient.patch(
        `${graphApiBaseUrl}/sites/${siteId}/lists/${listId}/items/${itemId}`,
        {
          fields: data,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data as SharePointListItem;
    } catch (error) {
      this.logger.error(`Failed to update item ${itemId} in list: ${listId}`, {
        error,
      });
      throw new Error(`Could not update item ${itemId} in list: ${listId}`);
    }
  }

  /**
   * Delete a list item
   */
  async deleteListItem(
    siteId: string,
    listId: string,
    itemId: string,
    token: string,
  ): Promise<void> {
    const graphApiBaseUrl = this.configService.get<string>(
      'sharepoint.graphApiBaseUrl',
    );

    try {
      await this.httpClient.delete(
        `${graphApiBaseUrl}/sites/${siteId}/lists/${listId}/items/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      this.logger.debug(`Deleted item ${itemId} from list: ${listId}`);
    } catch (error) {
      this.logger.error(
        `Failed to delete item ${itemId} from list: ${listId}`,
        { error },
      );
      throw new Error(`Could not delete item ${itemId} from list: ${listId}`);
    }
  }

  /**
   * Get count of list items using SharePoint $count endpoint
   * This is more efficient than fetching all items and counting client-side
   */
  async getListItemCount(
    siteId: string,
    listId: string,
    filter?: string,
    token?: string,
  ): Promise<number> {
    if (!token) {
      throw new Error('Access token is required');
    }

    const graphApiBaseUrl = this.configService.get<string>(
      'sharepoint.graphApiBaseUrl',
    );

    // Build query with $count=true and $top=0 to get only the count
    let url = `${graphApiBaseUrl}/sites/${siteId}/lists/${listId}/items?$count=true&$top=0`;

    if (filter) {
      url += `&$filter=${encodeURIComponent(filter)}`;
    }

    try {
      const response = await this.httpClient.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // SharePoint returns count in @odata.count field
      return response.data['@odata.count'] || 0;
    } catch (error) {
      this.logger.error(`Failed to get count from list: ${listId}`, { error });
      throw new Error(`Could not get count from list: ${listId}`);
    }
  }

  /**
   * Get aggregation result from SharePoint list using $apply
   * Supports: sum, average, min, max
   */
  async getListAggregation(
    siteId: string,
    listId: string,
    columnName: string,
    operation: 'sum' | 'average' | 'min' | 'max',
    filter?: string,
    token?: string,
  ): Promise<number | null> {
    if (!token) {
      throw new Error('Access token is required');
    }

    const graphApiBaseUrl = this.configService.get<string>(
      'sharepoint.graphApiBaseUrl',
    );

    // Map operation to SharePoint aggregate function
    const aggregateFunc = operation === 'average' ? 'average' : operation;

    // Build $apply query
    let applyQuery = `aggregate(fields/${columnName} with ${aggregateFunc} as Result)`;

    // If filter exists, add it before aggregation
    if (filter) {
      applyQuery = `filter(${filter})/${applyQuery}`;
    }

    const url = `${graphApiBaseUrl}/sites/${siteId}/lists/${listId}/items?$apply=${encodeURIComponent(applyQuery)}`;

    try {
      const response = await this.httpClient.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // SharePoint returns result in value array
      const result = response.data.value?.[0]?.Result;

      return result !== undefined && result !== null ? Number(result) : null;
    } catch (error) {
      this.logger.error(
        `Failed to get ${operation} aggregation for column ${columnName} in list: ${listId}`,
        { error },
      );

      // Fallback: Return null if aggregation not supported
      return null;
    }
  }

  /**
   * Build OData query string from options
   */
  private buildQueryString(options?: SharePointQueryOptions): string {
    if (!options) {
      return '';
    }

    const params: string[] = [];

    if (options.filter) {
      params.push(`$filter=${encodeURIComponent(options.filter)}`);
    }

    if (options.select && options.select.length > 0) {
      params.push(`$select=${options.select.join(',')}`);
    }

    if (options.expand && options.expand.length > 0) {
      params.push(`$expand=${options.expand.join(',')}`);
    }

    if (options.orderby) {
      params.push(`$orderby=${encodeURIComponent(options.orderby)}`);
    }

    if (options.top !== undefined) {
      params.push(`$top=${options.top}`);
    }

    if (options.skip !== undefined) {
      params.push(`$skip=${options.skip}`);
    }

    return params.join('&');
  }

  // ========================================================================
  // FILE STORAGE METHODS (Document Library Operations)
  // ========================================================================

  /**
   * Get the default drive (Document Library) for a SharePoint site
   */
  async getDefaultDrive(siteId: string, token: string): Promise<string> {
    try {
      const response = await this.httpClient.get(
        `https://graph.microsoft.com/v1.0/sites/${siteId}/drive`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      return response.data.id;
    } catch (error) {
      this.logger.error(`Failed to get default drive for site: ${siteId}`, {
        error,
      });
      throw error;
    }
  }

  /**
   * Upload a file to SharePoint Document Library
   * Uses PUT for small files (<4MB) and createUploadSession for large files
   */
  async uploadFile(
    siteId: string,
    driveId: string,
    itemPath: string,
    fileContent: Buffer | Uint8Array,
    mimeType: string | undefined,
    token: string,
  ): Promise<any> {
    try {
      const cleanPath = itemPath.startsWith('/') ? itemPath.slice(1) : itemPath;

      // For files < 4MB, use simple upload
      if (fileContent.byteLength < 4 * 1024 * 1024) {
        const response = await this.httpClient.put(
          `https://graph.microsoft.com/v1.0/sites/${siteId}/drives/${driveId}/root:/${cleanPath}:/content`,
          fileContent,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': mimeType || 'application/octet-stream',
            },
          },
        );

        return response.data;
      } else {
        // For large files, use upload session (future enhancement)
        throw new Error(
          'Large file uploads (>4MB) not yet supported. Use upload session.',
        );
      }
    } catch (error) {
      this.logger.error(
        `Failed to upload file to drive ${driveId}, path: ${itemPath}`,
        { error },
      );
      throw error;
    }
  }

  /**
   * Download a file from SharePoint Document Library
   * Returns a readable stream
   */
  async downloadFile(
    siteId: string,
    driveId: string,
    itemPath: string,
    token: string,
  ): Promise<any> {
    try {
      const cleanPath = itemPath.startsWith('/') ? itemPath.slice(1) : itemPath;

      const response = await this.httpClient.get(
        `https://graph.microsoft.com/v1.0/sites/${siteId}/drives/${driveId}/root:/${cleanPath}:/content`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'stream',
        },
      );

      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to download file from drive ${driveId}, path: ${itemPath}`,
        { error },
      );
      throw error;
    }
  }

  /**
   * Delete a file or folder from SharePoint Document Library
   */
  async deleteFile(
    siteId: string,
    driveId: string,
    itemPath: string,
    token: string,
  ): Promise<void> {
    try {
      const cleanPath = itemPath.startsWith('/') ? itemPath.slice(1) : itemPath;

      await this.httpClient.delete(
        `https://graph.microsoft.com/v1.0/sites/${siteId}/drives/${driveId}/root:/${cleanPath}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      this.logger.debug(
        `Deleted file/folder from drive ${driveId}: ${itemPath}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to delete file from drive ${driveId}, path: ${itemPath}`,
        { error },
      );
      throw error;
    }
  }

  /**
   * Move a file or folder within SharePoint Document Library
   */
  async moveFile(
    siteId: string,
    driveId: string,
    fromPath: string,
    toPath: string,
    token: string,
  ): Promise<any> {
    try {
      const cleanFromPath = fromPath.startsWith('/')
        ? fromPath.slice(1)
        : fromPath;
      const cleanToPath = toPath.startsWith('/') ? toPath.slice(1) : toPath;

      // Extract parent folder and new name from toPath
      const lastSlashIndex = cleanToPath.lastIndexOf('/');
      const newName =
        lastSlashIndex >= 0
          ? cleanToPath.substring(lastSlashIndex + 1)
          : cleanToPath;
      const newParentPath =
        lastSlashIndex >= 0 ? cleanToPath.substring(0, lastSlashIndex) : '';

      // Get parent folder reference
      const parentReference = newParentPath
        ? { path: `/drives/${driveId}/root:/${newParentPath}` }
        : { path: `/drives/${driveId}/root` };

      const response = await this.httpClient.patch(
        `https://graph.microsoft.com/v1.0/sites/${siteId}/drives/${driveId}/root:/${cleanFromPath}`,
        {
          parentReference,
          name: newName,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Failed to move file from ${fromPath} to ${toPath}`, {
        error,
      });
      throw error;
    }
  }

  /**
   * Copy a file or folder within SharePoint Document Library
   */
  async copyFile(
    siteId: string,
    driveId: string,
    fromPath: string,
    toPath: string,
    token: string,
  ): Promise<any> {
    try {
      const cleanFromPath = fromPath.startsWith('/')
        ? fromPath.slice(1)
        : fromPath;
      const cleanToPath = toPath.startsWith('/') ? toPath.slice(1) : toPath;

      // Extract parent folder and new name from toPath
      const lastSlashIndex = cleanToPath.lastIndexOf('/');
      const newName =
        lastSlashIndex >= 0
          ? cleanToPath.substring(lastSlashIndex + 1)
          : cleanToPath;
      const newParentPath =
        lastSlashIndex >= 0 ? cleanToPath.substring(0, lastSlashIndex) : '';

      // Get parent folder reference
      const parentReference = newParentPath
        ? { driveId, path: `/root:/${newParentPath}` }
        : { driveId, path: `/root` };

      // Copy operation returns 202 Accepted with a monitor URL
      const response = await this.httpClient.post(
        `https://graph.microsoft.com/v1.0/sites/${siteId}/drives/${driveId}/root:/${cleanFromPath}:/copy`,
        {
          parentReference,
          name: newName,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // The copy is asynchronous. Monitor URL is in Location header.
      // For now, we'll just return the response.
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to copy file from ${fromPath} to ${toPath}`, {
        error,
      });
      throw error;
    }
  }

  /**
   * Get file or folder metadata
   */
  async getFileMetadata(
    siteId: string,
    driveId: string,
    itemPath: string,
    token: string,
  ): Promise<any> {
    try {
      const cleanPath = itemPath.startsWith('/') ? itemPath.slice(1) : itemPath;

      const response = await this.httpClient.get(
        `https://graph.microsoft.com/v1.0/sites/${siteId}/drives/${driveId}/root:/${cleanPath}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Failed to get metadata for item: ${itemPath}`, {
        error,
      });
      throw error;
    }
  }

  /**
   * List items in a folder
   */
  async listDriveItems(
    siteId: string,
    driveId: string,
    folderPath: string,
    token: string,
  ): Promise<any[]> {
    try {
      const cleanPath = folderPath.startsWith('/')
        ? folderPath.slice(1)
        : folderPath;

      const url = cleanPath
        ? `https://graph.microsoft.com/v1.0/sites/${siteId}/drives/${driveId}/root:/${cleanPath}:/children`
        : `https://graph.microsoft.com/v1.0/sites/${siteId}/drives/${driveId}/root/children`;

      const response = await this.httpClient.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.value || [];
    } catch (error) {
      this.logger.error(`Failed to list items in folder: ${folderPath}`, {
        error,
      });
      throw error;
    }
  }
}

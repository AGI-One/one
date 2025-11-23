import { Injectable, Logger } from '@nestjs/common';

import { FieldMetadataType } from 'twenty-shared/types';

import { SharePointService } from 'src/engine/core-modules/sharepoint/sharepoint.service';
import {
  SHAREPOINT_FIELD_TYPE_MAP,
  type SharePointColumnSchema,
  type SharePointListSchema,
} from 'src/engine/core-modules/sharepoint/types/sharepoint-field-mapping.type';
import { type FieldMetadataEntity } from 'src/engine/metadata-modules/field-metadata/field-metadata.entity';
import { type ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';

/**
 * Service for managing SharePoint list schema creation and synchronization
 * Maps Twenty.one object/field metadata to SharePoint list/column structures
 */
@Injectable()
export class SharePointSchemaService {
  private readonly logger = new Logger(SharePointSchemaService.name);

  constructor(private readonly sharePointService: SharePointService) {}

  /**
   * Create SharePoint list from Twenty.one object metadata
   * Phase 1: Create list with basic columns only (skip twentyId)
   */
  async createListFromObjectMetadata(
    siteId: string,
    objectMetadata: ObjectMetadataEntity,
    token: string,
    skipTwentyIdColumn = false, // Skip twentyId in phase 1
  ): Promise<{ listId: string; listName: string }> {
    this.logger.log(
      `Creating SharePoint list for object: ${objectMetadata.nameSingular}`,
    );

    // Generate list schema from object metadata
    const listSchema = this.generateListSchema(
      objectMetadata,
      skipTwentyIdColumn,
    );

    // Check if list already exists
    const existingLists = await this.sharePointService.getSiteLists(
      siteId,
      token,
    );
    const existingList = existingLists.find(
      (list) => list.displayName === listSchema.displayName,
    );

    let list;

    if (existingList) {
      this.logger.log(
        `List already exists: ${existingList.displayName} (${existingList.id})`,
      );
      list = existingList;
    } else {
      // Create the list
      list = await this.sharePointService.createList(
        siteId,
        {
          displayName: listSchema.displayName,
          description: listSchema.description,
          template: listSchema.template,
        },
        token,
      );

      this.logger.log(`Created list: ${list.displayName} (${list.id})`);
    }

    // Add custom columns (will skip existing ones)
    await this.createColumns(siteId, list.id, listSchema.columns, token);

    return {
      listId: list.id,
      listName: list.name,
    };
  }

  /**
   * Generate SharePoint list schema from object metadata
   */
  private generateListSchema(
    objectMetadata: ObjectMetadataEntity,
    skipTwentyIdColumn = false,
  ): SharePointListSchema {
    const columns: SharePointColumnSchema[] = [];

    // Add twentyId field only if not skipped
    // This allows Phase 1 (list creation) to skip it, then Phase 2 adds it
    if (!skipTwentyIdColumn) {
      columns.push({
        name: 'twentyId',
        displayName: 'Twenty ID',
        type: 'text',
        required: false,
        indexed: false,
        description: 'Twenty.one entity UUID',
      });
    }

    // Process each field
    for (const field of objectMetadata.fields) {
      // Skip system fields that SharePoint provides by default
      if (this.isSystemField(field.name)) {
        continue;
      }

      const column = this.mapFieldToColumn(field);

      if (column) {
        columns.push(column);
      }
    }

    return {
      displayName: objectMetadata.labelPlural || objectMetadata.namePlural,
      description: objectMetadata.description || undefined,
      template: 'genericList',
      columns,
    };
  }

  /**
   * Map Twenty.one field to SharePoint column
   */
  private mapFieldToColumn(
    field: FieldMetadataEntity,
  ): SharePointColumnSchema | null {
    const sharePointType = SHAREPOINT_FIELD_TYPE_MAP[field.type];

    if (!sharePointType) {
      this.logger.warn(
        `Unsupported field type: ${field.type} for field ${field.name}`,
      );

      return null;
    }

    const column: SharePointColumnSchema = {
      name: field.name,
      displayName: field.label,
      type: sharePointType,
      required: !field.isNullable,
      indexed: false, // Can be enhanced based on field settings
      description: field.description || undefined,
    };

    // Handle SELECT type - add choices
    if (
      field.type === FieldMetadataType.SELECT ||
      field.type === FieldMetadataType.MULTI_SELECT
    ) {
      const options = field.options as { value: string; label: string }[];

      if (options && Array.isArray(options)) {
        column.choices = options.map((opt) => opt.label);
      }
    }

    // Handle RELATION type - setup lookup
    if (field.type === FieldMetadataType.RELATION) {
      // Note: Lookup configuration requires target list ID
      // This should be set after all lists are created
      column.lookupField = 'Title'; // Default to Title field
      // column.lookupListId will be set during relationship mapping phase
    }

    return column;
  }

  /**
   * Create columns in SharePoint list
   */
  private async createColumns(
    siteId: string,
    listId: string,
    columns: SharePointColumnSchema[],
    token: string,
  ): Promise<void> {
    this.logger.log(`Creating ${columns.length} columns in list ${listId}`);

    for (const column of columns) {
      // Skip Lookup columns during initial creation - they will be created in Phase 2
      if (column.type === 'Lookup' && !column.lookupListId) {
        this.logger.debug(
          `Skipping Lookup column ${column.name} - will be created after all lists exist`,
        );
        continue;
      }

      try {
        await this.createColumn(siteId, listId, column, token);
        this.logger.debug(`Created column: ${column.name}`);
      } catch (error) {
        this.logger.error(
          `Failed to create column ${column.name}: ${error.message}`,
        );
        // Continue with other columns even if one fails
      }
    }
  }

  /**
   * Create a single column in SharePoint list
   */
  private async createColumn(
    siteId: string,
    listId: string,
    column: SharePointColumnSchema,
    token: string,
  ): Promise<void> {
    const graphApiBaseUrl = this.sharePointService['configService'].get<string>(
      'sharepoint.graphApiBaseUrl',
    );

    // Build column definition based on type
    const columnDef: Record<string, unknown> = {
      name: column.name,
      displayName: column.displayName,
      description: column.description,
      required: column.required || false,
      indexed: column.indexed || false,
    };

    // Add type-specific configuration
    switch (column.type) {
      case 'text':
      case 'Text':
        columnDef.text = { allowMultipleLines: false, maxLength: 255 };
        break;
      case 'note':
      case 'Note':
        columnDef.text = { allowMultipleLines: true };
        break;
      case 'number':
      case 'Number':
        columnDef.number = {};
        break;
      case 'currency':
      case 'Currency':
        columnDef.currency = { locale: 'en-US' };
        break;
      case 'boolean':
      case 'Boolean':
        columnDef.boolean = {};
        break;
      case 'datetime':
      case 'DateTime':
        columnDef.dateTime = { format: 'dateTime' };
        break;
      case 'choice':
      case 'Choice':
        columnDef.choice = {
          choices: column.choices || [],
          allowTextEntry: false,
        };
        break;
      case 'multichoice':
      case 'MultiChoice':
        columnDef.choice = {
          choices: column.choices || [],
          allowTextEntry: false,
        };
        break;
      case 'url':
      case 'URL':
        columnDef.hyperlinkOrPicture = { isPicture: false };
        break;
      case 'lookup':
      case 'Lookup':
        if (column.lookupListId) {
          columnDef.lookup = {
            listId: column.lookupListId,
            columnName: column.lookupField || 'Title',
          };
        }
        break;
    }

    const httpClient = this.sharePointService['httpClient'];

    this.logger.debug(
      `Creating column ${column.name} with definition: ${JSON.stringify(columnDef, null, 2)}`,
    );

    await httpClient.post(
      `${graphApiBaseUrl}/sites/${siteId}/lists/${listId}/columns`,
      columnDef,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );
  }

  /**
   * Check if field is a system field that SharePoint provides
   */
  private isSystemField(fieldName: string): boolean {
    const systemFields = [
      'id',
      'createdAt',
      'updatedAt',
      'deletedAt',
      'createdBy',
      'updatedBy',
    ];

    return systemFields.includes(fieldName);
  }

  /**
   * Create Lookup column linking to another list
   * Called during Phase 2 (relationship setup) after all lists are created
   */
  async createLookupColumn(
    siteId: string,
    listId: string,
    columnName: string,
    displayName: string,
    targetListId: string,
    targetColumnName: string = 'Title',
    token: string,
  ): Promise<void> {
    this.logger.log(
      `Creating Lookup column ${columnName} in list ${listId} pointing to list ${targetListId}`,
    );

    const graphApiBaseUrl = this.sharePointService['configService'].get<string>(
      'sharepoint.graphApiBaseUrl',
    );
    const httpClient = this.sharePointService['httpClient'];

    try {
      const columnDef = {
        name: columnName,
        displayName: displayName,
        lookup: {
          listId: targetListId,
          columnName: targetColumnName,
        },
      };

      await httpClient.post(
        `${graphApiBaseUrl}/sites/${siteId}/lists/${listId}/columns`,
        columnDef,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      this.logger.debug(
        `Created Lookup column ${columnName} -> ${targetListId}/${targetColumnName}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to create Lookup column ${columnName}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Update Lookup column with target list ID
   * Called during relationship mapping phase after all lists are created
   */
  async updateLookupColumn(
    siteId: string,
    listId: string,
    columnName: string,
    targetListId: string,
    targetColumnName: string = 'Title',
    token: string,
  ): Promise<void> {
    this.logger.log(
      `Updating Lookup column ${columnName} in list ${listId} to point to list ${targetListId}`,
    );

    const graphApiBaseUrl = this.sharePointService['configService'].get<string>(
      'sharepoint.graphApiBaseUrl',
    );
    const httpClient = this.sharePointService['httpClient'];

    try {
      // SharePoint requires PATCH to update existing column
      await httpClient.patch(
        `${graphApiBaseUrl}/sites/${siteId}/lists/${listId}/columns/${columnName}`,
        {
          lookup: {
            listId: targetListId,
            columnName: targetColumnName,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      this.logger.debug(
        `Updated Lookup column ${columnName} -> ${targetListId}/${targetColumnName}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to update Lookup column ${columnName}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Sync object metadata changes to SharePoint list
   */
  async syncObjectMetadata(
    siteId: string,
    listId: string,
    objectMetadata: ObjectMetadataEntity,
    token: string,
  ): Promise<void> {
    this.logger.log(
      `Syncing object metadata for: ${objectMetadata.nameSingular}`,
    );

    // Get existing columns from SharePoint
    const existingColumns = await this.sharePointService.getListColumns(
      siteId,
      listId,
      token,
    );

    // Generate expected schema from current metadata
    const expectedSchema = this.generateListSchema(objectMetadata);

    // Create maps for easy lookup
    const existingColumnMap = new Map(
      existingColumns.map((col) => [col.name, col]),
    );
    const expectedColumnMap = new Map(
      expectedSchema.columns.map((col) => [col.name, col]),
    );

    let columnsAdded = 0;
    let columnsUpdated = 0;
    let columnsDeprecated = 0;

    // 1. Add new columns that don't exist in SharePoint
    for (const [columnName, expectedColumn] of expectedColumnMap) {
      if (!existingColumnMap.has(columnName)) {
        try {
          await this.createColumn(siteId, listId, expectedColumn, token);
          columnsAdded++;
          this.logger.debug(`Added new column: ${columnName}`);
        } catch (error) {
          this.logger.error(
            `Failed to add column ${columnName}: ${error.message}`,
          );
        }
      }
    }

    // 2. Update existing columns if needed
    // Note: SharePoint has limited column update capabilities
    // Most column type changes require deleting and recreating
    for (const [columnName, expectedColumn] of expectedColumnMap) {
      const existingColumn = existingColumnMap.get(columnName);

      if (
        existingColumn &&
        this.shouldUpdateColumn(existingColumn, expectedColumn)
      ) {
        try {
          await this.updateColumn(
            siteId,
            listId,
            columnName,
            expectedColumn,
            token,
          );
          columnsUpdated++;
          this.logger.debug(`Updated column: ${columnName}`);
        } catch (error) {
          this.logger.warn(
            `Failed to update column ${columnName}: ${error.message}`,
          );
          // Column updates often fail due to SharePoint restrictions
        }
      }
    }

    // 3. Mark deprecated columns (columns that exist in SharePoint but not in metadata)
    // Note: SharePoint doesn't allow deleting columns with data
    // We log them as deprecated for manual cleanup
    for (const [columnName, _existingColumn] of existingColumnMap) {
      if (
        !expectedColumnMap.has(columnName) &&
        !this.isSharePointSystemColumn(columnName)
      ) {
        columnsDeprecated++;
        this.logger.warn(
          `Deprecated column detected: ${columnName} (exists in SharePoint but not in metadata)`,
        );
        // TODO: Option to hide deprecated columns instead of deletion
      }
    }

    this.logger.log(
      `Schema sync complete for ${objectMetadata.nameSingular}: ` +
        `Added: ${columnsAdded}, Updated: ${columnsUpdated}, Deprecated: ${columnsDeprecated}`,
    );
  }

  /**
   * Check if column should be updated
   */
  private shouldUpdateColumn(
    existingColumn: Record<string, unknown>,
    expectedColumn: SharePointColumnSchema,
  ): boolean {
    // Check if displayName changed
    if (
      existingColumn.displayName &&
      existingColumn.displayName !== expectedColumn.displayName
    ) {
      return true;
    }

    // Check if description changed
    if (
      existingColumn.description !== expectedColumn.description &&
      expectedColumn.description !== undefined
    ) {
      return true;
    }

    // Check if required flag changed
    if (
      existingColumn.required !== undefined &&
      existingColumn.required !== expectedColumn.required
    ) {
      return true;
    }

    // Check if choices changed (for Choice columns)
    if (expectedColumn.choices && existingColumn.choice) {
      const choiceField = existingColumn.choice as { choices?: string[] };

      if (Array.isArray(choiceField.choices)) {
        const existingChoices = new Set(choiceField.choices);
        const expectedChoices = new Set(expectedColumn.choices);

        if (existingChoices.size !== expectedChoices.size) {
          return true;
        }

        for (const choice of expectedChoices) {
          if (!existingChoices.has(choice)) {
            return true;
          }
        }
      }
    }

    return false;
  }

  /**
   * Update existing column
   */
  private async updateColumn(
    siteId: string,
    listId: string,
    columnName: string,
    column: SharePointColumnSchema,
    token: string,
  ): Promise<void> {
    const graphApiBaseUrl = this.sharePointService['configService'].get<string>(
      'sharepoint.graphApiBaseUrl',
    );
    const httpClient = this.sharePointService['httpClient'];

    // Build update payload (only updatable properties)
    const updatePayload: Record<string, unknown> = {};

    if (column.displayName) {
      updatePayload.displayName = column.displayName;
    }

    if (column.description !== undefined) {
      updatePayload.description = column.description;
    }

    // Update choices for Choice columns
    if (column.choices && column.type === 'Choice') {
      updatePayload.choice = {
        choices: column.choices,
        allowTextEntry: false,
      };
    }

    // Note: SharePoint doesn't allow changing column type or required flag
    // for columns with existing data

    await httpClient.patch(
      `${graphApiBaseUrl}/sites/${siteId}/lists/${listId}/columns/${columnName}`,
      updatePayload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );
  }

  /**
   * Check if column is a SharePoint system column
   */
  private isSharePointSystemColumn(columnName: string): boolean {
    const systemColumns = [
      'ContentType',
      'Title',
      'Modified',
      'Created',
      'Author',
      'Editor',
      'ID',
      '_ModerationStatus',
      '_UIVersionString',
      'Attachments',
      'Edit',
      'LinkTitleNoMenu',
      'LinkTitle',
      'DocIcon',
      'ItemChildCount',
      'FolderChildCount',
      'AppAuthor',
      'AppEditor',
    ];

    return systemColumns.includes(columnName);
  }

  /**
   * Add twentyId column to an existing SharePoint list
   * Called in Phase 2 after all lists are created
   */
  async addTwentyIdColumn(
    siteId: string,
    listId: string,
    token: string,
  ): Promise<void> {
    this.logger.log(`Adding twentyId column to list ${listId}`);

    try {
      const twentyIdColumn: SharePointColumnSchema = {
        name: 'twentyId',
        displayName: 'Twenty ID',
        type: 'text',
        required: false,
        indexed: false,
        description: 'Twenty.one entity UUID',
      };

      await this.createColumn(siteId, listId, twentyIdColumn, token);
      this.logger.log(`Successfully added twentyId column to list ${listId}`);
    } catch (error) {
      // If column already exists, that's fine
      if (
        error.response?.status === 400 &&
        error.response?.data?.error?.message?.includes('already exists')
      ) {
        this.logger.debug(`twentyId column already exists in list ${listId}`);
      } else {
        this.logger.error(
          `Failed to add twentyId column to list ${listId}: ${error.message}`,
        );
        // Log detailed error response
        if (error.response?.data) {
          this.logger.error(
            `SharePoint API error response: ${JSON.stringify(error.response.data, null, 2)}`,
          );
        }
        throw error;
      }
    }
  }
}

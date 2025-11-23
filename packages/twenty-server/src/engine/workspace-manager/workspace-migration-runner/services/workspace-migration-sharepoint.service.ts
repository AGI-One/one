import { Injectable, Logger } from '@nestjs/common';

import { SharePointService } from 'src/engine/core-modules/sharepoint/sharepoint.service';
import {
    WorkspaceMigrationColumnActionType,
    WorkspaceMigrationTableActionType,
    type WorkspaceMigrationColumnAction,
    type WorkspaceMigrationColumnCreate,
    type WorkspaceMigrationTableAction,
} from 'src/engine/metadata-modules/workspace-migration/workspace-migration.entity';

/**
 * Service to handle SharePoint List schema migrations
 * Translates PostgreSQL table/column migrations to SharePoint List operations
 */
@Injectable()
export class WorkspaceMigrationSharePointService {
  private readonly logger = new Logger(
    WorkspaceMigrationSharePointService.name,
  );

  constructor(private readonly sharePointService: SharePointService) {}

  /**
   * Execute migrations for SharePoint datasource
   * Translates table actions to SharePoint List operations
   */
  async executeMigrations(
    siteId: string,
    tableMigrations: WorkspaceMigrationTableAction[],
    tenantId: string,
  ): Promise<void> {
    const token = await this.sharePointService.getAppOnlyToken(tenantId);

    for (const tableMigration of tableMigrations) {
      await this.handleTableMigration(siteId, tableMigration, token);
    }
  }

  /**
   * Handle single table migration action
   */
  private async handleTableMigration(
    siteId: string,
    tableMigration: WorkspaceMigrationTableAction,
    token: string,
  ): Promise<void> {
    this.logger.log(
      `Executing SharePoint migration: ${tableMigration.action} on ${tableMigration.name}`,
    );

    switch (tableMigration.action) {
      case WorkspaceMigrationTableActionType.CREATE:
        await this.createList(
          siteId,
          tableMigration.name,
          tableMigration.columns || [],
          token,
        );
        break;

      case WorkspaceMigrationTableActionType.ALTER:
        if (tableMigration.columns && tableMigration.columns.length > 0) {
          const listId = await this.findListIdByName(
            siteId,
            tableMigration.name,
            token,
          );

          if (!listId) {
            this.logger.warn(
              `SharePoint List ${tableMigration.name} not found, skipping ALTER`,
            );
            break;
          }

          await this.alterList(siteId, listId, tableMigration.columns, token);
        }
        break;

      case WorkspaceMigrationTableActionType.DROP:
        this.logger.warn(
          `SharePoint List deletion not implemented for safety. List: ${tableMigration.name}`,
        );
        // Intentionally not deleting SharePoint Lists to prevent data loss
        break;

      default:
        this.logger.warn(
          `SharePoint migration action ${tableMigration.action} not supported, skipping`,
        );
    }
  }

  /**
   * Create SharePoint List with columns
   */
  private async createList(
    siteId: string,
    listName: string,
    columns: WorkspaceMigrationColumnAction[],
    token: string,
  ): Promise<void> {
    try {
      // Check if list already exists
      const existingListId = await this.findListIdByName(
        siteId,
        listName,
        token,
      );

      if (existingListId) {
        this.logger.log(
          `SharePoint List ${listName} already exists, skipping creation`,
        );

        return;
      }

      // Create the list
      this.logger.log(`Creating SharePoint List: ${listName}`);
      const createdList = await this.sharePointService.createList(
        siteId,
        {
          displayName: listName,
          description: `Twenty.one object: ${listName}`,
          template: 'genericList',
        },
        token,
      );
      const listId = createdList.id;

      // Add custom columns
      const createColumns = columns.filter(
        (col) => col.action === WorkspaceMigrationColumnActionType.CREATE,
      ) as WorkspaceMigrationColumnCreate[];

      for (const column of createColumns) {
        // Skip standard Twenty columns that are handled automatically
        if (this.isStandardTwentyColumn(column.columnName)) {
          continue;
        }

        await this.createColumn(siteId, listId, column, token);
      }

      this.logger.log(
        `SharePoint List ${listName} created successfully with ${createColumns.length} columns`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to create SharePoint List ${listName}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Alter SharePoint List by adding/modifying columns
   */
  private async alterList(
    siteId: string,
    listId: string,
    columns: WorkspaceMigrationColumnAction[],
    token: string,
  ): Promise<void> {
    for (const column of columns) {
      switch (column.action) {
        case WorkspaceMigrationColumnActionType.CREATE:
          await this.createColumn(
            siteId,
            listId,
            column as WorkspaceMigrationColumnCreate,
            token,
          );
          break;

        case WorkspaceMigrationColumnActionType.ALTER:
          this.logger.warn(
            `SharePoint column ALTER not fully implemented, skipping ${column}`,
          );
          break;

        case WorkspaceMigrationColumnActionType.DROP:
          this.logger.warn(
            `SharePoint column DROP not implemented for safety, skipping`,
          );
          break;

        default:
          this.logger.warn(
            `SharePoint column action ${column.action} not supported`,
          );
      }
    }
  }

  /**
   * Create column in SharePoint List
   */
  private async createColumn(
    siteId: string,
    listId: string,
    column: WorkspaceMigrationColumnCreate,
    token: string,
  ): Promise<void> {
    try {
      // Skip standard columns
      if (this.isStandardTwentyColumn(column.columnName)) {
        return;
      }

      const sharePointColumnType = this.mapPostgreSQLTypeToSharePoint(
        column.columnType,
      );

      this.logger.log(
        `Creating SharePoint column ${column.columnName} (${sharePointColumnType})`,
      );

      await this.sharePointService.createListColumn(
        siteId,
        listId,
        column.columnName,
        sharePointColumnType,
        column.isNullable === false, // SharePoint "required" means NOT nullable
        token,
      );
    } catch (error) {
      // Column might already exist
      if (error.message?.includes('400') || error.message?.includes('exists')) {
        this.logger.warn(
          `SharePoint column ${column.columnName} might already exist, skipping`,
        );

        return;
      }

      this.logger.error(
        `Failed to create SharePoint column ${column.columnName}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Find SharePoint List ID by name
   */
  private async findListIdByName(
    siteId: string,
    listName: string,
    token: string,
  ): Promise<string | null> {
    try {
      const lists = await this.sharePointService.getSiteLists(siteId, token);
      const list = lists.find(
        (l) => l.displayName.toLowerCase() === listName.toLowerCase(),
      );

      return list?.id || null;
    } catch (error) {
      this.logger.error(
        `Failed to find SharePoint List ${listName}: ${error.message}`,
      );

      return null;
    }
  }

  /**
   * Check if column is a standard Twenty.one column that doesn't need explicit creation
   */
  private isStandardTwentyColumn(columnName: string): boolean {
    const standardColumns = [
      'id', // SharePoint has built-in ID
      'createdAt', // SharePoint has Created
      'updatedAt', // SharePoint has Modified
      'deletedAt', // Soft delete - can be custom column
    ];

    return standardColumns.includes(columnName);
  }

  /**
   * Map PostgreSQL column type to SharePoint column type
   */
  private mapPostgreSQLTypeToSharePoint(postgresType: string): string {
    // Normalize type string
    const normalizedType = postgresType.toLowerCase().trim();

    // UUID → Text (SharePoint doesn't have native UUID)
    if (normalizedType.includes('uuid') || normalizedType.includes('varchar')) {
      return 'text';
    }

    // Integer types → Number
    if (
      normalizedType.includes('int') ||
      normalizedType.includes('serial') ||
      normalizedType.includes('bigint')
    ) {
      return 'number';
    }

    // Decimal/Float → Number
    if (
      normalizedType.includes('decimal') ||
      normalizedType.includes('numeric') ||
      normalizedType.includes('float') ||
      normalizedType.includes('double') ||
      normalizedType.includes('real')
    ) {
      return 'number';
    }

    // Boolean → Boolean
    if (normalizedType.includes('bool')) {
      return 'boolean';
    }

    // Date/Time types → DateTime
    if (
      normalizedType.includes('timestamp') ||
      normalizedType.includes('date') ||
      normalizedType.includes('time')
    ) {
      return 'dateTime';
    }

    // Text types → Text
    if (normalizedType.includes('text') || normalizedType.includes('char')) {
      return 'text';
    }

    // JSON/JSONB → Text (store as JSON string)
    if (normalizedType.includes('json')) {
      return 'text';
    }

    // Default to text for unknown types
    this.logger.warn(
      `Unknown PostgreSQL type ${postgresType}, defaulting to text`,
    );

    return 'text';
  }
}

import { Injectable, Logger } from '@nestjs/common';

import { SharePointSchemaService } from 'src/engine/core-modules/sharepoint/sharepoint-schema.service';
import { SharePointService } from 'src/engine/core-modules/sharepoint/sharepoint.service';
import { type ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';

/**
 * Service for initializing SharePoint workspace
 * Creates lists and schema mappings for all Twenty.one objects
 */
@Injectable()
export class SharePointWorkspaceInitService {
  private readonly logger = new Logger(SharePointWorkspaceInitService.name);

  constructor(
    private readonly sharePointService: SharePointService,
    private readonly sharePointSchemaService: SharePointSchemaService,
  ) {}

  /**
   * Initialize SharePoint workspace with all object metadata
   * Creates SharePoint lists for each Twenty.one object
   */
  async initializeWorkspace(
    tenantId: string,
    siteId: string,
    objectMetadataCollection: ObjectMetadataEntity[],
  ): Promise<Map<string, string>> {
    this.logger.log(
      `Initializing SharePoint workspace for ${objectMetadataCollection.length} objects`,
    );

    const token = await this.sharePointService.getAppOnlyToken(tenantId);

    // Map to store object name → SharePoint list ID
    const objectToListMap = new Map<string, string>();

    // Phase 1: Create all lists (without relationships)
    for (const objectMetadata of objectMetadataCollection) {
      try {
        const { listId, listName } =
          await this.sharePointSchemaService.createListFromObjectMetadata(
            siteId,
            objectMetadata,
            token,
          );

        objectToListMap.set(objectMetadata.nameSingular, listId);

        this.logger.log(
          `Created list for ${objectMetadata.nameSingular}: ${listName} (${listId})`,
        );
      } catch (error) {
        this.logger.error(
          `Failed to create list for ${objectMetadata.nameSingular}: ${error.message}`,
        );
        // Continue with other objects
      }
    }

    // Phase 2: Setup relationships (Lookup columns)
    this.logger.log('Phase 2: Setting up relationships...');
    await this.setupRelationships(
      tenantId,
      siteId,
      objectMetadataCollection,
      objectToListMap,
    );

    this.logger.log(
      `Workspace initialization complete. Created ${objectToListMap.size} lists.`,
    );

    return objectToListMap;
  }

  /**
   * Sync workspace metadata changes
   * Updates SharePoint list schemas when object metadata changes
   */
  async syncWorkspaceMetadata(
    tenantId: string,
    siteId: string,
    objectMetadataCollection: ObjectMetadataEntity[],
    objectToListMap: Map<string, string>,
  ): Promise<void> {
    this.logger.log(
      `Syncing workspace metadata for ${objectMetadataCollection.length} objects`,
    );

    const token = await this.sharePointService.getAppOnlyToken(tenantId);

    for (const objectMetadata of objectMetadataCollection) {
      const listId = objectToListMap.get(objectMetadata.nameSingular);

      if (!listId) {
        this.logger.warn(
          `No list mapping found for ${objectMetadata.nameSingular}, skipping sync`,
        );
        continue;
      }

      try {
        await this.sharePointSchemaService.syncObjectMetadata(
          siteId,
          listId,
          objectMetadata,
          token,
        );

        this.logger.debug(`Synced metadata for ${objectMetadata.nameSingular}`);
      } catch (error) {
        this.logger.error(
          `Failed to sync metadata for ${objectMetadata.nameSingular}: ${error.message}`,
        );
      }
    }

    this.logger.log('Workspace metadata sync complete');
  }

  /**
   * Setup relationships between lists
   * Updates Lookup columns with correct target list IDs
   */
  async setupRelationships(
    tenantId: string,
    siteId: string,
    objectMetadataCollection: ObjectMetadataEntity[],
    objectToListMap: Map<string, string>,
  ): Promise<void> {
    this.logger.log(
      `Setting up relationships for ${objectMetadataCollection.length} objects`,
    );

    const token = await this.sharePointService.getAppOnlyToken(tenantId);
    let relationshipsConfigured = 0;
    let relationshipsSkipped = 0;

    for (const objectMetadata of objectMetadataCollection) {
      const sourceListId = objectToListMap.get(objectMetadata.nameSingular);

      if (!sourceListId) {
        this.logger.warn(
          `No list mapping found for ${objectMetadata.nameSingular}, skipping relationships`,
        );
        continue;
      }

      // Find all RELATION fields in this object
      const relationFields = objectMetadata.fields.filter(
        (field) => field.type === 'RELATION' || field.type === 'MORPH_RELATION',
      );

      for (const field of relationFields) {
        try {
          // Get target object metadata ID from field
          // Cast to FieldMetadataEntity with RELATION type to access relationTargetObjectMetadataId
          const relationField = field as {
            relationTargetObjectMetadataId?: string;
          };
          const targetObjectMetadataId =
            relationField.relationTargetObjectMetadataId;

          if (!targetObjectMetadataId) {
            this.logger.warn(
              `RELATION field ${field.name} in ${objectMetadata.nameSingular} has no target object, skipping`,
            );
            relationshipsSkipped++;
            continue;
          }

          // Find target object in collection
          const targetObject = objectMetadataCollection.find(
            (obj) => obj.id === targetObjectMetadataId,
          );

          if (!targetObject) {
            this.logger.warn(
              `Target object ${targetObjectMetadataId} not found for field ${field.name}, skipping`,
            );
            relationshipsSkipped++;
            continue;
          }

          // Get target list ID
          const targetListId = objectToListMap.get(targetObject.nameSingular);

          if (!targetListId) {
            this.logger.warn(
              `No list mapping found for target object ${targetObject.nameSingular}, skipping`,
            );
            relationshipsSkipped++;
            continue;
          }

          // Update Lookup column with target list ID
          await this.sharePointSchemaService.updateLookupColumn(
            siteId,
            sourceListId,
            field.name,
            targetListId,
            'Title', // Default to Title field
            token,
          );

          relationshipsConfigured++;
          this.logger.debug(
            `Configured relationship: ${objectMetadata.nameSingular}.${field.name} -> ${targetObject.nameSingular}`,
          );
        } catch (error) {
          this.logger.error(
            `Failed to setup relationship for ${objectMetadata.nameSingular}.${field.name}: ${error.message}`,
          );
          relationshipsSkipped++;
          // Continue with other relationships
        }
      }
    }

    this.logger.log(
      `Relationship setup complete. Configured: ${relationshipsConfigured}, Skipped: ${relationshipsSkipped}`,
    );
  }

  /**
   * Get or create mapping between object names and SharePoint list IDs
   */
  async getOrCreateObjectToListMapping(
    tenantId: string,
    siteId: string,
    objectMetadataCollection: ObjectMetadataEntity[],
  ): Promise<Map<string, string>> {
    const token = await this.sharePointService.getAppOnlyToken(tenantId);
    const existingLists = await this.sharePointService.getSiteLists(
      siteId,
      token,
    );

    const mapping = new Map<string, string>();

    // Try to match existing lists with object metadata
    for (const objectMetadata of objectMetadataCollection) {
      const expectedListName =
        objectMetadata.labelPlural || objectMetadata.namePlural;

      // Find matching list by display name
      const matchingList = existingLists.find(
        (list) =>
          list.displayName === expectedListName ||
          list.name === objectMetadata.namePlural,
      );

      if (matchingList) {
        mapping.set(objectMetadata.nameSingular, matchingList.id);
        this.logger.debug(
          `Found existing list for ${objectMetadata.nameSingular}: ${matchingList.id}`,
        );
      }
    }

    return mapping;
  }
}

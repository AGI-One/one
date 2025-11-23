/**
 * Migration script to add twentyId field to existing SharePoint List items
 * Run this once to populate twentyId for all existing items
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { v5 as uuidv5 } from 'uuid';

import { AppModule } from 'src/app.module';
import { SharePointObjectListMappingService } from 'src/engine/core-modules/sharepoint/sharepoint-object-list-mapping.service';
import { SharePointService } from 'src/engine/core-modules/sharepoint/sharepoint.service';

const logger = new Logger('TwentyIdMigration');

async function migrateTwentyId() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const sharePointService = app.get(SharePointService);
    const mappingService = app.get(SharePointObjectListMappingService);

    // Get tenant info from environment
    const tenantId = process.env.SHAREPOINT_TENANT_ID;
    const siteId = process.env.SHAREPOINT_SITE_ID;

    if (!tenantId || !siteId) {
      throw new Error(
        'SHAREPOINT_TENANT_ID and SHAREPOINT_SITE_ID must be set',
      );
    }

    logger.log('Starting twentyId migration...');

    // Get token
    const token = await sharePointService.getAppOnlyToken(tenantId);

    // Get all workspace mappings from database
    const workspaces = await mappingService.getAllWorkspaces();

    for (const workspaceId of workspaces) {
      logger.log(`Processing workspace: ${workspaceId}`);

      const mappings = await mappingService.getWorkspaceMappings(workspaceId);

      for (const mapping of mappings) {
        logger.log(
          `  Processing list: ${mapping.listTitle} (${mapping.listId})`,
        );

        try {
          // Get all items in the list
          const items = await sharePointService.getListItems(
            siteId,
            mapping.listId,
            { top: 5000 }, // Max items per request
            token,
          );

          logger.log(`    Found ${items.length} items`);

          let updatedCount = 0;
          let skippedCount = 0;

          for (const item of items) {
            const fields = item.fields as Record<string, unknown>;

            // Skip if twentyId already exists
            if (fields.twentyId) {
              skippedCount++;
              continue;
            }

            // Generate deterministic UUID from listId:itemId
            const namespace = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
            const twentyId = uuidv5(`${mapping.listId}:${item.id}`, namespace);

            // Update the item
            await sharePointService.updateListItem(
              siteId,
              mapping.listId,
              item.id,
              { twentyId },
              token,
            );

            updatedCount++;

            if (updatedCount % 10 === 0) {
              logger.log(`    Updated ${updatedCount} items...`);
            }
          }

          logger.log(
            `    ✓ Completed: ${updatedCount} updated, ${skippedCount} skipped`,
          );
        } catch (error) {
          logger.error(
            `    ✗ Failed to process list ${mapping.listTitle}: ${error.message}`,
          );
        }
      }
    }

    logger.log('Migration completed successfully!');
  } catch (error) {
    logger.error(`Migration failed: ${error.message}`);
    throw error;
  } finally {
    await app.close();
  }
}

// Run migration
migrateTwentyId()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    logger.error(error);
    process.exit(1);
  });

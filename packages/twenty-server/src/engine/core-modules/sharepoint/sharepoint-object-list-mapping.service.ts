import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { SharePointObjectListMappingEntity } from 'src/engine/core-modules/sharepoint/sharepoint-object-list-mapping.entity';

/**
 * Service for managing SharePoint object-to-list mappings
 */
@Injectable()
export class SharePointObjectListMappingService {
  private readonly logger = new Logger(SharePointObjectListMappingService.name);

  constructor(
    @InjectRepository(SharePointObjectListMappingEntity)
    private readonly mappingRepository: Repository<SharePointObjectListMappingEntity>,
  ) {}

  /**
   * Save object-to-list mapping
   */
  async saveMapping(
    workspaceId: string,
    objectName: string,
    listId: string,
    listTitle: string,
  ): Promise<void> {
    await this.mappingRepository.upsert(
      {
        workspaceId,
        objectName,
        listId,
        listTitle,
      },
      ['workspaceId', 'objectName'],
    );

    this.logger.debug(
      `Saved mapping: ${objectName} → ${listTitle} (${listId})`,
    );
  }

  /**
   * Get list ID for object
   */
  async getListId(
    workspaceId: string,
    objectName: string,
  ): Promise<string | null> {
    const mapping = await this.mappingRepository.findOne({
      where: { workspaceId, objectName },
    });

    return mapping?.listId ?? null;
  }

  /**
   * Get all mappings for workspace
   */
  async getWorkspaceMappings(
    workspaceId: string,
  ): Promise<SharePointObjectListMappingEntity[]> {
    return this.mappingRepository.find({
      where: { workspaceId },
    });
  }

  /**
   * Get object-to-list map for workspace (legacy method for backward compatibility)
   */
  async getWorkspaceMappingsMap(
    workspaceId: string,
  ): Promise<Map<string, string>> {
    const mappings = await this.getWorkspaceMappings(workspaceId);

    const map = new Map<string, string>();

    for (const mapping of mappings) {
      map.set(mapping.objectName, mapping.listId);
    }

    return map;
  }

  /**
   * Get all unique workspace IDs that have mappings
   */
  async getAllWorkspaces(): Promise<string[]> {
    const result = await this.mappingRepository
      .createQueryBuilder('mapping')
      .select('DISTINCT mapping.workspaceId', 'workspaceId')
      .getRawMany();

    return result.map((row) => row.workspaceId);
  }

  /**
   * Delete all mappings for workspace
   */
  async deleteWorkspaceMappings(workspaceId: string): Promise<void> {
    await this.mappingRepository.delete({ workspaceId });
    this.logger.log(`Deleted all mappings for workspace: ${workspaceId}`);
  }
}

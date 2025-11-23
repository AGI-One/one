import { Logger } from '@nestjs/common';

import { type ObjectsPermissions } from 'twenty-shared/types';
import {
  type DeleteResult,
  type EntityTarget,
  type FindManyOptions,
  type FindOneOptions,
  type FindOptionsWhere,
  type InsertResult,
  type ObjectId,
  type ObjectLiteral,
  type QueryRunner,
  type SaveOptions,
  type UpdateResult,
} from 'typeorm';
import { type PickKeysByType } from 'typeorm/common/PickKeysByType';
import { type QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { type UpsertOptions } from 'typeorm/repository/UpsertOptions';

import { type FeatureFlagMap } from 'src/engine/core-modules/feature-flag/interfaces/feature-flag-map.interface';
import { type WorkspaceInternalContext } from 'src/engine/twenty-orm/interfaces/workspace-internal-context.interface';

import { type AuthContext } from 'src/engine/core-modules/auth/types/auth-context.type';
import { type SharePointService } from 'src/engine/core-modules/sharepoint/sharepoint.service';
import { type SharePointListItem } from 'src/engine/core-modules/sharepoint/types/sharepoint-list.type';
import { type SharePointQueryOptions } from 'src/engine/core-modules/sharepoint/types/sharepoint-query-options.type';
import { type DeepPartialWithNestedRelationFields } from 'src/engine/twenty-orm/entity-manager/types/deep-partial-entity-with-nested-relation-fields.type';
import { type QueryDeepPartialEntityWithNestedRelationFields } from 'src/engine/twenty-orm/entity-manager/types/query-deep-partial-entity-with-nested-relation-fields.type';
import { type WorkspaceEntityManager } from 'src/engine/twenty-orm/entity-manager/workspace-entity-manager';
import { WorkspaceRepository } from 'src/engine/twenty-orm/repository/workspace.repository';
import { getObjectMetadataFromEntityTarget } from 'src/engine/twenty-orm/utils/get-object-metadata-from-entity-target.util';

/**
 * SharePoint implementation of WorkspaceRepository
 * Extends WorkspaceRepository to provide SharePoint List storage backend
 */
export class SharePointRepository<
  T extends ObjectLiteral,
> extends WorkspaceRepository<T> {
  private readonly logger = new Logger(SharePointRepository.name);
  private readonly sharePointService: SharePointService;
  private readonly siteId: string;
  private readonly listId: string;
  private readonly tenantId: string;
  private accessToken?: string;

  // Cache for generated UUIDs (SharePoint itemId -> UUID)
  private readonly uuidCache = new Map<string, string>();

  constructor(
    sharePointService: SharePointService,
    siteId: string,
    listId: string,
    tenantId: string,
    internalContext: WorkspaceInternalContext,
    target: EntityTarget<T>,
    manager: WorkspaceEntityManager,
    featureFlagMap: FeatureFlagMap,
    queryRunner?: QueryRunner,
    objectRecordsPermissions?: ObjectsPermissions,
    shouldBypassPermissionChecks = false,
    authContext?: AuthContext,
  ) {
    super(
      internalContext,
      target,
      manager,
      featureFlagMap,
      queryRunner,
      objectRecordsPermissions,
      shouldBypassPermissionChecks,
      authContext,
    );
    this.sharePointService = sharePointService;
    this.siteId = siteId;
    this.listId = listId;
    this.tenantId = tenantId;
  }

  /**
   * Ensure we have a valid access token
   */
  private async ensureToken(): Promise<string> {
    if (!this.accessToken) {
      this.accessToken = await this.sharePointService.getAppOnlyToken(
        this.tenantId,
      );
    }

    return this.accessToken;
  }

  /**
   * FIND METHODS - Override to use SharePoint REST API
   */
  override async find(
    options?: FindManyOptions<T>,
    _entityManager?: WorkspaceEntityManager,
  ): Promise<T[]> {
    this.logger.debug('SharePoint find', { options });
    const token = await this.ensureToken();

    const queryOptions = this.buildSharePointQuery(options);

    this.logger.debug('Built SharePoint query', { queryOptions });

    const items = await this.sharePointService.getListItems(
      this.siteId,
      this.listId,
      queryOptions,
      token,
    );

    return this.transformToEntities(items);
  }

  override async findBy(
    where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    _entityManager?: WorkspaceEntityManager,
  ): Promise<T[]> {
    return this.find({ where });
  }

  override async findAndCount(
    options?: FindManyOptions<T>,
    _entityManager?: WorkspaceEntityManager,
  ): Promise<[T[], number]> {
    this.logger.debug('SharePoint findAndCount', { options });
    const token = await this.ensureToken();

    const queryOptions = this.buildSharePointQuery(options);

    // Call both APIs in parallel for better performance
    // 1. Get items with pagination/filtering
    // 2. Get total count (without pagination) using $count endpoint
    const [items, totalCount] = await Promise.all([
      this.sharePointService.getListItems(
        this.siteId,
        this.listId,
        queryOptions,
        token,
      ),
      this.sharePointService.getListItemCount(
        this.siteId,
        this.listId,
        queryOptions.filter,
        token,
      ),
    ]);

    return [this.transformToEntities(items), totalCount];
  }

  override async findAndCountBy(
    where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    _entityManager?: WorkspaceEntityManager,
  ): Promise<[T[], number]> {
    return this.findAndCount({ where });
  }

  override async findOne(
    options: FindOneOptions<T>,
    _entityManager?: WorkspaceEntityManager,
  ): Promise<T | null> {
    this.logger.debug('SharePoint findOne', { options });
    const token = await this.ensureToken();

    const queryOptions = this.buildSharePointQuery({ ...options, take: 1 });

    this.logger.debug('SharePoint findOne queryOptions', { queryOptions });

    const items = await this.sharePointService.getListItems(
      this.siteId,
      this.listId,
      queryOptions,
      token,
    );

    this.logger.debug('SharePoint findOne items', {
      itemsCount: items.length,
      items: items.map((i) => ({ id: i.id, fields: i.fields })),
    });

    if (items.length === 0) {
      return null;
    }

    const entities = await this.transformToEntities(items);

    this.logger.debug('SharePoint findOne transformed entities', {
      entitiesCount: entities.length,
      entities,
    });

    return entities[0] || null;
  }

  override async findOneBy(
    where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    _entityManager?: WorkspaceEntityManager,
  ): Promise<T | null> {
    return this.findOne({ where });
  }

  override async findOneOrFail(
    options: FindOneOptions<T>,
    _entityManager?: WorkspaceEntityManager,
  ): Promise<T> {
    const result = await this.findOne(options);

    if (!result) {
      throw new Error('Entity not found');
    }

    return result;
  }

  override async findOneByOrFail(
    where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    _entityManager?: WorkspaceEntityManager,
  ): Promise<T> {
    return this.findOneOrFail({ where });
  }

  /**
   * SAVE METHODS - Override to use SharePoint REST API
   */
  override async save<U extends DeepPartialWithNestedRelationFields<T>>(
    entityOrEntities: U | U[],
    _options?: SaveOptions,
    _entityManager?: WorkspaceEntityManager,
  ): Promise<U | U[]> {
    this.logger.debug('SharePoint save called', {
      entityOrEntities,
      isArray: Array.isArray(entityOrEntities),
    });
    const token = await this.ensureToken();

    const entities = Array.isArray(entityOrEntities)
      ? entityOrEntities
      : [entityOrEntities];
    const results: T[] = [];

    for (const entity of entities) {
      const entityWithId = entity as unknown as T & { id?: string };
      let twentyUuid = entityWithId.id;

      // Generate UUID if not exists
      if (!twentyUuid) {
        const { v4: uuidv4 } = await import('uuid');

        twentyUuid = uuidv4();
        this.logger.debug(`Generated new UUID for entity: ${twentyUuid}`);
      }

      // Apply default values for required fields
      const entityWithDefaults = this.applyDefaultValues({
        ...entity,
        id: twentyUuid,
      } as ObjectLiteral);

      // Transform entity and ensure twentyId is included
      const sharePointItem = this.transformToSharePointItem(entityWithDefaults);

      // Ensure twentyId is set (transformToSharePointItem should handle this, but double-check)
      if (!sharePointItem.twentyId) {
        sharePointItem.twentyId = twentyUuid;
      }

      let savedItem: SharePointListItem;

      // Try to find existing item by UUID
      this.logger.debug(`Finding SharePoint item ID for UUID: ${twentyUuid}`);
      const sharePointItemId = await this.findSharePointItemId(twentyUuid);

      if (sharePointItemId) {
        // Item exists, update it
        this.logger.debug(`Updating SharePoint item ${sharePointItemId}`, {
          sharePointItem,
        });
        savedItem = await this.sharePointService.updateListItem(
          this.siteId,
          this.listId,
          sharePointItemId,
          sharePointItem,
          token,
        );
        this.logger.debug(
          `Updated SharePoint item ${sharePointItemId} successfully`,
        );
      } else {
        // Item not found, create new
        this.logger.debug(
          `Creating new SharePoint item with UUID: ${twentyUuid}`,
          { sharePointItem },
        );
        savedItem = await this.sharePointService.createListItem(
          this.siteId,
          this.listId,
          sharePointItem,
          token,
        );
        this.logger.debug(
          `Created SharePoint item ${savedItem.id} with UUID: ${twentyUuid}`,
        );
      }

      const transformedEntity = await this.transformToEntity(savedItem);

      results.push(transformedEntity);
    }

    return (Array.isArray(entityOrEntities)
      ? results
      : results[0]) as unknown as U | U[];
  }

  /**
   * Override createQueryBuilder to return a functional stub
   * SharePoint repository doesn't fully support QueryBuilder, but we can handle basic queries
   * This allows GraphQL queries with relations to work
   */
  override createQueryBuilder(alias?: string): any {
    this.logger.debug(
      `SharePoint repository QueryBuilder called with alias: ${alias}`,
    );

    const queryState = {
      alias,
      findOptions: {} as FindManyOptions<T>,
      whereConditions: [] as FindOptionsWhere<T>[],
      selectedColumns: undefined as string[] | undefined,
      orderByOptions: {} as Record<string, 'ASC' | 'DESC'>,
      limitValue: undefined as number | undefined,
      skipValue: undefined as number | undefined,
    };

    const stub: any = {
      setFindOptions: (options: FindManyOptions<T>) => {
        queryState.findOptions = { ...queryState.findOptions, ...options };

        return stub;
      },

      where: (condition: FindOptionsWhere<T>) => {
        queryState.whereConditions = [condition];

        return stub;
      },

      andWhere: (condition: FindOptionsWhere<T>) => {
        queryState.whereConditions.push(condition);

        return stub;
      },

      orWhere: () => {
        this.logger.warn('orWhere not fully supported in SharePoint stub');

        return stub;
      },

      whereInIds: (ids: string[]) => {
        // Convert to IN query
        if (ids.length > 0) {
          queryState.whereConditions = [{ id: { _type: 'in', _value: ids } }];
        }

        return stub;
      },

      // Join methods - log warning but don't fail
      leftJoin: () => stub,
      leftJoinAndSelect: () => stub,
      innerJoin: () => stub,
      innerJoinAndSelect: () => stub,

      orderBy: (field: string, order: 'ASC' | 'DESC' = 'ASC') => {
        queryState.orderByOptions = { [field]: order };

        return stub;
      },

      addOrderBy: (field: string, order: 'ASC' | 'DESC' = 'ASC') => {
        queryState.orderByOptions[field] = order;

        return stub;
      },

      groupBy: () => stub,
      addGroupBy: () => stub,
      having: () => stub,

      limit: (value: number) => {
        queryState.limitValue = value;

        return stub;
      },

      offset: (value: number) => {
        queryState.skipValue = value;

        return stub;
      },

      skip: (value: number) => {
        queryState.skipValue = value;

        return stub;
      },

      take: (value: number) => {
        queryState.limitValue = value;

        return stub;
      },

      select: (columns: string[]) => {
        queryState.selectedColumns = columns;

        return stub;
      },

      addSelect: () => stub,
      distinct: () => stub,

      getQuery: () => '',
      getParameters: () => ({}),

      // Get current find options
      getFindOptions: () => {
        return {
          ...queryState.findOptions,
          where:
            queryState.whereConditions.length > 0
              ? queryState.whereConditions.length === 1
                ? queryState.whereConditions[0]
                : queryState.whereConditions
              : undefined,
          order: queryState.orderByOptions,
          take: queryState.limitValue,
          skip: queryState.skipValue,
          select: queryState.selectedColumns,
        };
      },

      // Execution methods - use repository methods internally
      getMany: async () => {
        try {
          const options: FindManyOptions<T> = {
            ...queryState.findOptions,
            where:
              queryState.whereConditions.length > 0
                ? queryState.whereConditions.length === 1
                  ? queryState.whereConditions[0]
                  : queryState.whereConditions
                : undefined,
            order: queryState.orderByOptions,
            take: queryState.limitValue,
            skip: queryState.skipValue,
            select: queryState.selectedColumns,
          };

          return await this.find(options);
        } catch (error) {
          this.logger.error('QueryBuilder.getMany failed', { error });

          return [];
        }
      },

      getOne: async () => {
        try {
          const options: FindOneOptions<T> = {
            ...queryState.findOptions,
            where:
              queryState.whereConditions.length > 0
                ? queryState.whereConditions[0]
                : undefined,
            order: queryState.orderByOptions,
            select: queryState.selectedColumns,
          };

          return await this.findOne(options);
        } catch (error) {
          this.logger.error('QueryBuilder.getOne failed', { error });

          return null;
        }
      },

      getManyAndCount: async () => {
        try {
          const options: FindManyOptions<T> = {
            ...queryState.findOptions,
            where:
              queryState.whereConditions.length > 0
                ? queryState.whereConditions.length === 1
                  ? queryState.whereConditions[0]
                  : queryState.whereConditions
                : undefined,
            order: queryState.orderByOptions,
            take: queryState.limitValue,
            skip: queryState.skipValue,
            select: queryState.selectedColumns,
          };

          return await this.findAndCount(options);
        } catch (error) {
          this.logger.error('QueryBuilder.getManyAndCount failed', { error });

          return [[], 0];
        }
      },

      getCount: async () => {
        try {
          const options: FindManyOptions<T> = {
            where:
              queryState.whereConditions.length > 0
                ? queryState.whereConditions.length === 1
                  ? queryState.whereConditions[0]
                  : queryState.whereConditions
                : undefined,
          };

          return await this.count(options);
        } catch (error) {
          this.logger.error('QueryBuilder.getCount failed', { error });

          return 0;
        }
      },

      getRawMany: async () => [],
      getRawOne: async () => null,
      execute: async () => ({ affected: 0, raw: [] }),
      stream: () => {
        const { Readable } = require('stream');

        return Readable.from([]);
      },

      clone: () => stub,

      alias,
      expressionMap: {
        mainAlias: { name: alias },
        wheres: [],
        joinAttributes: [],
      },
    };

    return stub;
  }

  /**
   * INSERT METHODS
   */
  override async insert(
    entity:
      | QueryDeepPartialEntityWithNestedRelationFields<T>
      | QueryDeepPartialEntityWithNestedRelationFields<T>[],
    _entityManager?: WorkspaceEntityManager,
    _selectedColumns?: string[],
  ): Promise<InsertResult> {
    this.logger.debug('SharePoint insert', { entity });
    const token = await this.ensureToken();

    const entities = Array.isArray(entity) ? entity : [entity];
    const identifiers: ObjectLiteral[] = [];
    const generatedMaps: ObjectLiteral[] = [];

    for (const item of entities) {
      const itemWithId = item as ObjectLiteral & { id?: string };

      // Generate UUID if not exists
      if (!itemWithId.id) {
        const { v4: uuidv4 } = await import('uuid');

        itemWithId.id = uuidv4();
        this.logger.debug(`Generated new UUID for insert: ${itemWithId.id}`);
      }

      // Apply default values for required fields before insert
      const itemWithDefaults = this.applyDefaultValues(itemWithId);

      const sharePointItem = this.transformToSharePointItem(itemWithDefaults);

      // Ensure twentyId is set
      if (!sharePointItem.twentyId) {
        sharePointItem.twentyId = itemWithId.id;
      }

      this.logger.debug('Creating SharePoint item', {
        twentyId: sharePointItem.twentyId,
        sharePointItem,
      });

      const createdItem = await this.sharePointService.createListItem(
        this.siteId,
        this.listId,
        sharePointItem,
        token,
      );

      // Transform to get the proper UUID from twentyId field
      const transformedEntity = await this.transformToEntity(createdItem);
      const entityId = (transformedEntity as unknown as { id: string }).id;

      identifiers.push({ id: entityId });
      generatedMaps.push({ id: entityId });
    }

    return {
      identifiers,
      generatedMaps,
      raw: entities,
    };
  }

  /**
   * UPDATE METHODS
   */
  override async update(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | ObjectId
      | ObjectId[]
      | FindOptionsWhere<T>,
    partialEntity: QueryDeepPartialEntity<T>,
    _entityManager?: WorkspaceEntityManager,
    _selectedColumns?: string[],
  ): Promise<UpdateResult> {
    this.logger.debug('SharePoint update', { criteria, partialEntity });
    const token = await this.ensureToken();

    // Convert criteria to item IDs
    const itemIds = await this.resolveItemIds(criteria);
    const sharePointItem = this.transformToSharePointItem(partialEntity);

    const affected = itemIds.length;

    for (const itemId of itemIds) {
      await this.sharePointService.updateListItem(
        this.siteId,
        this.listId,
        itemId,
        sharePointItem,
        token,
      );
    }

    return {
      affected,
      raw: [],
      generatedMaps: [],
    };
  }

  /**
   * DELETE METHODS
   */
  override async delete(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | ObjectId
      | ObjectId[]
      | FindOptionsWhere<T>,
    _entityManager?: WorkspaceEntityManager,
    _selectedColumns?: string[] | '*',
  ): Promise<DeleteResult> {
    this.logger.debug('SharePoint delete', { criteria });
    const token = await this.ensureToken();

    const itemIds = await this.resolveItemIds(criteria);
    const affected = itemIds.length;

    for (const itemId of itemIds) {
      await this.sharePointService.deleteListItem(
        this.siteId,
        this.listId,
        itemId,
        token,
      );
    }

    return {
      affected,
      raw: [],
      generatedMaps: [],
    };
  }

  /**
   * UPSERT METHOD
   */
  override async upsert(
    entityOrEntities:
      | QueryDeepPartialEntityWithNestedRelationFields<T>
      | QueryDeepPartialEntityWithNestedRelationFields<T>[],
    conflictPathsOrOptions: string[] | UpsertOptions<T>,
    _entityManager?: WorkspaceEntityManager,
    _selectedColumns: string[] = [],
  ): Promise<InsertResult> {
    this.logger.debug('SharePoint upsert', { entityOrEntities });
    const token = await this.ensureToken();

    const entities = Array.isArray(entityOrEntities)
      ? entityOrEntities
      : [entityOrEntities];
    const identifiers: ObjectLiteral[] = [];
    const generatedMaps: ObjectLiteral[] = [];

    for (const entity of entities) {
      const entityWithId = entity as T & { id?: string };
      let twentyUuid = entityWithId.id;

      // Generate UUID if not exists
      if (!twentyUuid) {
        const { v4: uuidv4 } = await import('uuid');

        twentyUuid = uuidv4();
        this.logger.debug(`Generated new UUID for upsert: ${twentyUuid}`);
      }

      // Apply default values for required fields
      const entityWithDefaults = this.applyDefaultValues({
        ...entity,
        id: twentyUuid,
      } as ObjectLiteral);

      const sharePointItem = this.transformToSharePointItem(entityWithDefaults);

      // Ensure twentyId is set
      if (!sharePointItem.twentyId) {
        sharePointItem.twentyId = twentyUuid;
      }

      let resultItem: SharePointListItem;

      // Try to find existing item by UUID
      const sharePointItemId = await this.findSharePointItemId(twentyUuid);

      if (sharePointItemId) {
        // Item exists, update it
        this.logger.debug(
          `Upserting: Updating existing SharePoint item ${sharePointItemId}`,
        );
        resultItem = await this.sharePointService.updateListItem(
          this.siteId,
          this.listId,
          sharePointItemId,
          sharePointItem,
          token,
        );
      } else {
        // Item not found, create new
        this.logger.debug(
          `Upserting: Creating new SharePoint item with UUID: ${twentyUuid}`,
        );
        resultItem = await this.sharePointService.createListItem(
          this.siteId,
          this.listId,
          sharePointItem,
          token,
        );
      }

      // Use the Twenty UUID, not SharePoint's numeric ID
      identifiers.push({ id: twentyUuid });
      generatedMaps.push({ id: twentyUuid });
    }

    return {
      identifiers,
      generatedMaps,
      raw: entities,
    };
  }

  /**
   * COUNT/EXISTS METHODS
   */
  override async count(
    options?: FindManyOptions<T>,
    _entityManager?: WorkspaceEntityManager,
  ): Promise<number> {
    this.logger.debug('SharePoint count', { options });
    const token = await this.ensureToken();

    const queryOptions = this.buildSharePointQuery(options);

    // Use dedicated count endpoint - more efficient than fetching all items
    return await this.sharePointService.getListItemCount(
      this.siteId,
      this.listId,
      queryOptions.filter,
      token,
    );
  }

  override async countBy(
    where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    entityManager?: WorkspaceEntityManager,
  ): Promise<number> {
    return this.count({ where }, entityManager);
  }

  override async exists(
    options?: FindManyOptions<T>,
    entityManager?: WorkspaceEntityManager,
  ): Promise<boolean> {
    const count = await this.count(options, entityManager);

    return count > 0;
  }

  override async existsBy(
    where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    entityManager?: WorkspaceEntityManager,
  ): Promise<boolean> {
    return this.exists({ where }, entityManager);
  }

  /**
   * MATH METHODS - Using SharePoint server-side aggregation ($apply)
   */
  override async sum(
    columnName: PickKeysByType<T, number>,
    where?: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    _entityManager?: WorkspaceEntityManager,
  ): Promise<number | null> {
    this.logger.debug('SharePoint sum', { columnName, where });
    const token = await this.ensureToken();

    // Build filter from where clause
    const filter = where ? this.buildSharePointFilter(where) : undefined;

    // Try server-side aggregation first
    try {
      const result = await this.sharePointService.getListAggregation(
        this.siteId,
        this.listId,
        columnName as string,
        'sum',
        filter,
        token,
      );

      return result;
    } catch (error) {
      // Fallback to client-side calculation if aggregation not supported
      this.logger.warn('Server-side sum failed, falling back to client-side', {
        error,
      });
      const items = await this.find({ where });

      if (items.length === 0) return null;

      return items.reduce((acc, item) => {
        const value = (item as ObjectLiteral)[columnName as string];

        return acc + (Number(value) || 0);
      }, 0);
    }
  }

  override async average(
    columnName: PickKeysByType<T, number>,
    where?: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    _entityManager?: WorkspaceEntityManager,
  ): Promise<number | null> {
    this.logger.debug('SharePoint average', { columnName, where });
    const token = await this.ensureToken();

    const filter = where ? this.buildSharePointFilter(where) : undefined;

    try {
      const result = await this.sharePointService.getListAggregation(
        this.siteId,
        this.listId,
        columnName as string,
        'average',
        filter,
        token,
      );

      return result;
    } catch (error) {
      this.logger.warn(
        'Server-side average failed, falling back to client-side',
        { error },
      );
      const items = await this.find({ where });

      if (items.length === 0) return null;

      const sum = items.reduce((acc, item) => {
        const value = (item as ObjectLiteral)[columnName as string];

        return acc + (Number(value) || 0);
      }, 0);

      return sum / items.length;
    }
  }

  override async minimum(
    columnName: PickKeysByType<T, number>,
    where?: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    _entityManager?: WorkspaceEntityManager,
  ): Promise<number | null> {
    this.logger.debug('SharePoint minimum', { columnName, where });
    const token = await this.ensureToken();

    const filter = where ? this.buildSharePointFilter(where) : undefined;

    try {
      const result = await this.sharePointService.getListAggregation(
        this.siteId,
        this.listId,
        columnName as string,
        'min',
        filter,
        token,
      );

      return result;
    } catch (error) {
      this.logger.warn('Server-side min failed, falling back to client-side', {
        error,
      });
      const items = await this.find({ where });

      if (items.length === 0) return null;

      return Math.min(
        ...items.map((item) => {
          const value = (item as ObjectLiteral)[columnName as string];

          return Number(value) || 0;
        }),
      );
    }
  }

  override async maximum(
    columnName: PickKeysByType<T, number>,
    where?: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    _entityManager?: WorkspaceEntityManager,
  ): Promise<number | null> {
    this.logger.debug('SharePoint maximum', { columnName, where });
    const token = await this.ensureToken();

    const filter = where ? this.buildSharePointFilter(where) : undefined;

    try {
      const result = await this.sharePointService.getListAggregation(
        this.siteId,
        this.listId,
        columnName as string,
        'max',
        filter,
        token,
      );

      return result;
    } catch (error) {
      this.logger.warn('Server-side max failed, falling back to client-side', {
        error,
      });
      const items = await this.find({ where });

      if (items.length === 0) return null;

      return Math.max(
        ...items.map((item) => {
          const value = (item as ObjectLiteral)[columnName as string];

          return Number(value) || 0;
        }),
      );
    }
  }

  /**
   * PRIVATE HELPER METHODS
   */

  /**
   * Build SharePoint OData query from TypeORM FindOptions
   */
  private buildSharePointQuery(
    options?: FindManyOptions<T>,
  ): SharePointQueryOptions {
    const query: SharePointQueryOptions = {};

    if (!options) {
      return query;
    }

    if (options.where) {
      query.filter = this.buildSharePointFilter(options.where);
    }

    if (options.select) {
      query.select = Array.isArray(options.select)
        ? (options.select as string[])
        : Object.keys(options.select);
    }

    if (options.take !== undefined) {
      query.top = options.take;
    }

    if (options.skip !== undefined) {
      query.skip = options.skip;
    }

    const orderOptions = options as FindManyOptions<T> & {
      order?: Record<string, 'ASC' | 'DESC'>;
    };

    if (orderOptions.order) {
      query.orderby = this.buildOrderBy(orderOptions.order);
    }

    return query;
  }

  /**
   * Convert TypeORM where clause to OData $filter syntax
   */
  private buildSharePointFilter(
    where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
  ): string {
    if (Array.isArray(where)) {
      // OR conditions
      return where.map((w) => this.whereToOData(w)).join(' or ');
    }

    return this.whereToOData(where);
  }

  /**
   * Convert single where object to OData filter string
   * Supports TypeORM Find operators: MoreThan, LessThan, Like, Between, In, IsNull, Not
   * Note: SharePoint List fields must be accessed via 'fields/' prefix in OData queries
   */
  private whereToOData(where: FindOptionsWhere<T>): string {
    const conditions: string[] = [];

    for (const [key, value] of Object.entries(where)) {
      // Skip deletedAt field - SharePoint handles soft delete differently
      // Twenty automatically adds 'deletedAt IS NULL' filter which doesn't exist in SharePoint Lists
      if (key === 'deletedAt') {
        continue;
      }

      // Map 'id' to 'twentyId' field in SharePoint
      // SharePoint's built-in 'id' is numeric, but Twenty uses UUID
      const fieldName = key === 'id' ? 'twentyId' : key;
      const fieldPath = `fields/${fieldName}`;

      if (value === null || value === undefined) {
        conditions.push(`${fieldPath} eq null`);
      } else if (typeof value === 'object' && value !== null) {
        // Handle TypeORM Find operators
        const operator = value as ObjectLiteral;

        // Check for TypeORM operator patterns
        if ('_type' in operator) {
          const opType = operator._type;
          const opValue = operator._value;

          switch (opType) {
            case 'moreThan':
              conditions.push(
                `${fieldPath} gt ${this.formatODataValue(opValue)}`,
              );
              break;
            case 'moreThanOrEqual':
              conditions.push(
                `${fieldPath} ge ${this.formatODataValue(opValue)}`,
              );
              break;
            case 'lessThan':
              conditions.push(
                `${fieldPath} lt ${this.formatODataValue(opValue)}`,
              );
              break;
            case 'lessThanOrEqual':
              conditions.push(
                `${fieldPath} le ${this.formatODataValue(opValue)}`,
              );
              break;
            case 'like':
              // Convert SQL LIKE to OData contains/startswith/endswith
              const likeValue = String(opValue).replace(/%/g, '');

              if (
                String(opValue).startsWith('%') &&
                String(opValue).endsWith('%')
              ) {
                conditions.push(`contains(${fieldPath}, '${likeValue}')`);
              } else if (String(opValue).startsWith('%')) {
                conditions.push(`endswith(${fieldPath}, '${likeValue}')`);
              } else if (String(opValue).endsWith('%')) {
                conditions.push(`startswith(${fieldPath}, '${likeValue}')`);
              } else {
                conditions.push(`${fieldPath} eq '${likeValue}'`);
              }
              break;
            case 'ilike':
              // Case-insensitive like - use tolower
              const ilikeValue = String(opValue)
                .replace(/%/g, '')
                .toLowerCase();

              if (
                String(opValue).startsWith('%') &&
                String(opValue).endsWith('%')
              ) {
                conditions.push(
                  `contains(tolower(${fieldPath}), '${ilikeValue}')`,
                );
              } else {
                conditions.push(`tolower(${fieldPath}) eq '${ilikeValue}'`);
              }
              break;
            case 'between':
              if (Array.isArray(opValue) && opValue.length === 2) {
                conditions.push(
                  `${fieldPath} ge ${this.formatODataValue(opValue[0])} and ${fieldPath} le ${this.formatODataValue(opValue[1])}`,
                );
              }
              break;
            case 'in':
              if (Array.isArray(opValue) && opValue.length > 0) {
                const inValues = opValue
                  .map((v) => this.formatODataValue(v))
                  .join(',');

                conditions.push(`${fieldPath} in (${inValues})`);
              }
              break;
            case 'isNull':
              conditions.push(`${fieldPath} eq null`);
              break;
            case 'not':
              // NOT operator
              if (typeof opValue === 'object') {
                const notCondition = this.whereToOData({
                  [key]: opValue,
                } as FindOptionsWhere<T>);

                conditions.push(`not (${notCondition})`);
              } else {
                conditions.push(
                  `${fieldPath} ne ${this.formatODataValue(opValue)}`,
                );
              }
              break;
            default:
              // Fallback: treat as equality
              conditions.push(
                `${fieldPath} eq ${this.formatODataValue(opValue)}`,
              );
          }
        } else {
          // Plain object - treat as equality
          conditions.push(`${fieldPath} eq '${JSON.stringify(value)}'`);
        }
      } else if (typeof value === 'string') {
        conditions.push(`${fieldPath} eq '${value}'`);
      } else if (typeof value === 'number') {
        conditions.push(`${fieldPath} eq ${value}`);
      } else if (typeof value === 'boolean') {
        conditions.push(`${fieldPath} eq ${value}`);
      }
    }

    return conditions.join(' and ');
  }

  /**
   * Format value for OData query
   */
  private formatODataValue(value: unknown): string {
    if (value === null || value === undefined) {
      return 'null';
    }
    if (typeof value === 'string') {
      return `'${value}'`;
    }
    if (typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }
    if (value instanceof Date) {
      return `'${value.toISOString()}'`;
    }

    return `'${String(value)}'`;
  }

  /**
   * Build OData $orderby from TypeORM order options
   */
  private buildOrderBy(order: Record<string, 'ASC' | 'DESC'>): string {
    return Object.entries(order)
      .map(([field, direction]) => `${field} ${direction.toLowerCase()}`)
      .join(',');
  }

  /**
   * Find SharePoint numeric ID from Twenty UUID
   * Queries SharePoint by twentyId field to get the numeric ID
   */
  private async findSharePointItemId(
    twentyUuid: string,
  ): Promise<string | null> {
    try {
      const token = await this.ensureToken();
      const items = await this.sharePointService.getListItems(
        this.siteId,
        this.listId,
        { filter: `fields/twentyId eq '${twentyUuid}'`, top: 1 },
        token,
      );

      if (items.length > 0) {
        return items[0].id;
      }

      return null;
    } catch (error) {
      // If error is because twentyId field doesn't exist, log warning and return null
      if (
        error.message?.includes('400') ||
        error.message?.includes('Bad Request')
      ) {
        this.logger.warn(
          `twentyId field may not exist in SharePoint list ${this.listId}. Cannot find item by UUID: ${twentyUuid}`,
        );

        return null;
      }

      this.logger.error(
        `Failed to find SharePoint item ID for UUID ${twentyUuid}: ${error.message}`,
      );

      return null;
    }
  }

  /**
   * Transform SharePoint list items to Twenty.one entities
   */
  private async transformToEntities(items: SharePointListItem[]): Promise<T[]> {
    return Promise.all(items.map((item) => this.transformToEntity(item)));
  }

  /**
   * Transform single SharePoint item to Twenty.one entity
   */
  private async transformToEntity(item: SharePointListItem): Promise<T> {
    const fields = item.fields as Record<string, unknown>;

    // Use twentyId from SharePoint fields as the entity ID (UUID)
    // SharePoint's item.id is a numeric string, but Twenty expects UUID
    let entityId = fields.twentyId as string | undefined;

    // If twentyId is missing, generate a deterministic UUID based on SharePoint item ID
    // This ensures the same SharePoint item always gets the same UUID
    if (!entityId) {
      // Check cache first
      entityId = this.uuidCache.get(item.id);

      const isFirstGeneration = !entityId;

      if (!entityId) {
        // Generate UUID v5 (deterministic) from SharePoint item ID and list ID
        // This way the same item always gets the same UUID even across server restarts
        const { v5: uuidv5 } = await import('uuid');
        const namespace = '6ba7b810-9dad-11d1-80b4-00c04fd430c8'; // Standard UUID namespace

        entityId = uuidv5(`${this.listId}:${item.id}`, namespace);

        // Cache it
        this.uuidCache.set(item.id, entityId);
      }

      // Only log once when first generated
      if (isFirstGeneration) {
        this.logger.debug(
          `SharePoint item ${item.id} missing twentyId. Using deterministic UUID: ${entityId}`,
        );
      }
    }

    // Validate UUID format
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(entityId)) {
      this.logger.error(
        `Invalid UUID detected for SharePoint item ${item.id}`,
        {
          entityId,
          twentyId: fields.twentyId,
          itemId: item.id,
          listId: this.listId,
          allFields: Object.keys(fields),
        },
      );
      throw new Error(
        `Invalid UUID: ${entityId} for SharePoint item ${item.id}`,
      );
    }

    // Remove twentyId from fields since it's only used internally for mapping
    // Also remove SharePoint's numeric 'id' field to avoid conflicts
    const { twentyId: _twentyId, id: _sharePointId, ...rawFields } = fields;

    // Deserialize composite types (FULL_NAME, etc.) from JSON strings
    const entityFields: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(rawFields)) {
      if (
        typeof value === 'string' &&
        value.startsWith('{') &&
        value.endsWith('}')
      ) {
        // Try to parse as JSON object (composite types)
        try {
          entityFields[key] = JSON.parse(value);
        } catch {
          // Not valid JSON, keep as string
          entityFields[key] = value;
        }
      } else {
        entityFields[key] = value;
      }
    }

    // Set default values for required Twenty.one fields that might be missing
    // This ensures GraphQL non-nullable fields don't cause errors
    const entityWithDefaults = {
      id: entityId,
      ...entityFields,
    };

    // Apply defaults for common required fields if they're null/undefined
    if (
      entityWithDefaults.avatarUrl === null ||
      entityWithDefaults.avatarUrl === undefined
    ) {
      entityWithDefaults.avatarUrl = '';
    }
    if (
      entityWithDefaults.createdAt === null ||
      entityWithDefaults.createdAt === undefined
    ) {
      entityWithDefaults.createdAt = new Date();
    }
    if (
      entityWithDefaults.updatedAt === null ||
      entityWithDefaults.updatedAt === undefined
    ) {
      entityWithDefaults.updatedAt = new Date();
    }
    if (entityWithDefaults.deletedAt === undefined) {
      entityWithDefaults.deletedAt = null;
    }
    if (
      entityWithDefaults.position === null ||
      entityWithDefaults.position === undefined
    ) {
      entityWithDefaults.position = 0;
    }

    // WorkspaceMember specific defaults
    if (
      entityWithDefaults.colorScheme === null ||
      entityWithDefaults.colorScheme === undefined
    ) {
      entityWithDefaults.colorScheme = 'System';
    }
    if (
      entityWithDefaults.locale === null ||
      entityWithDefaults.locale === undefined
    ) {
      entityWithDefaults.locale = 'en';
    }
    if (
      entityWithDefaults.timeZone === null ||
      entityWithDefaults.timeZone === undefined
    ) {
      entityWithDefaults.timeZone = 'UTC';
    }
    if (
      entityWithDefaults.dateFormat === null ||
      entityWithDefaults.dateFormat === undefined
    ) {
      entityWithDefaults.dateFormat = 'SYSTEM';
    }
    if (
      entityWithDefaults.timeFormat === null ||
      entityWithDefaults.timeFormat === undefined
    ) {
      entityWithDefaults.timeFormat = 'SYSTEM';
    }
    if (
      entityWithDefaults.calendarStartDay === null ||
      entityWithDefaults.calendarStartDay === undefined
    ) {
      entityWithDefaults.calendarStartDay = 'MONDAY';
    }
    if (
      entityWithDefaults.numberFormat === null ||
      entityWithDefaults.numberFormat === undefined
    ) {
      entityWithDefaults.numberFormat = 'SYSTEM';
    }

    const entity = entityWithDefaults as unknown as T;

    return entity;
  }

  /**
   * Transform Twenty entity to SharePoint list item fields
   * Handles composite types (FULL_NAME, etc.) by flattening or JSON encoding
   * Filters out SharePoint read-only system fields
   */
  private transformToSharePointItem(
    entity: DeepPartialWithNestedRelationFields<T> | QueryDeepPartialEntity<T>,
  ): Record<string, unknown> {
    const entityWithId = entity as ObjectLiteral & { id?: string };
    const { id, ...fields } = entityWithId;

    // SharePoint read-only/system fields that should NOT be sent in create/update requests
    const sharePointSystemFields = new Set([
      // OData metadata
      '@odata.etag',
      '@odata.type',
      '@odata.id',
      '@odata.editLink',
      '@odata.context',
      // SharePoint system fields
      'id', // SharePoint's numeric ID
      'ID',
      'GUID',
      'Modified',
      'Created',
      'AuthorLookupId',
      'EditorLookupId',
      'Author',
      'Editor',
      '_UIVersionString',
      'Attachments',
      'Edit',
      'ItemChildCount',
      'FolderChildCount',
      '_ComplianceFlags',
      '_ComplianceTag',
      '_ComplianceTagWrittenTime',
      '_ComplianceTagUserId',
      'AppAuthorLookupId',
      'AppEditorLookupId',
      'ContentType',
      'ContentTypeId',
      'FileSystemObjectType',
      'ServerRedirectedEmbedUri',
      'ServerRedirectedEmbedUrl',
      'FileLeafRef',
      'FileDirRef',
      'File_x0020_Type',
      'HTML_x0020_File_x0020_Type',
      'CheckoutUser',
      '_CheckinComment',
      'LinkTitle',
      'LinkTitleNoMenu',
      'LinkFilename',
      'LinkFilenameNoMenu',
      'DocIcon',
      'FileSizeDisplay',
      'SelectTitle',
      'SelectFilename',
      'owshiddenversion',
      '_Level',
      '_IsCurrentVersion',
      'ParentVersionString',
      'ParentLeafName',
      '_ModerationStatus',
      '_ModerationComments',
      'InstanceID',
      'Order',
      'WorkflowVersion',
      'WorkflowInstanceID',
      'ComplianceAssetId',
      // Twenty.one standard fields that may not exist in SharePoint or are auto-managed
      'createdAt',
      'updatedAt',
      'deletedAt',
      'position',
    ]);

    // Flatten or serialize complex types for SharePoint
    const sharePointFields: Record<string, unknown> = {};

    // Store Twenty's UUID in twentyId field
    if (id) {
      sharePointFields.twentyId = id;
    }

    for (const [key, value] of Object.entries(fields)) {
      // Skip SharePoint system/read-only fields
      if (sharePointSystemFields.has(key)) {
        this.logger.debug(`Skipping SharePoint system field: ${key}`);
        continue;
      }

      if (value === null || value === undefined) {
        sharePointFields[key] = value;
        continue;
      }

      // Handle composite types (FULL_NAME, etc.)
      if (
        typeof value === 'object' &&
        !Array.isArray(value) &&
        !(value instanceof Date)
      ) {
        // Check if it's a composite type by presence of nested properties
        const nestedObj = value as Record<string, unknown>;

        // FULL_NAME type: {firstName, lastName}
        if ('firstName' in nestedObj || 'lastName' in nestedObj) {
          // Flatten to JSON string for SharePoint Text field
          sharePointFields[key] = JSON.stringify(nestedObj);
        } else {
          // Other objects: serialize to JSON
          sharePointFields[key] = JSON.stringify(value);
        }
      } else {
        // Primitive types, arrays, dates
        sharePointFields[key] = value;
      }
    }

    return sharePointFields;
  }

  /**
   * Resolve criteria to SharePoint item IDs
   * Converts Twenty.one UUIDs to SharePoint numeric item IDs
   */
  private async resolveItemIds(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | ObjectId
      | ObjectId[]
      | FindOptionsWhere<T>,
  ): Promise<string[]> {
    // Simple ID resolution - UUID string
    if (typeof criteria === 'string') {
      // This is a Twenty UUID, need to find SharePoint numeric ID
      const sharePointId = await this.findSharePointItemId(criteria);

      if (!sharePointId) {
        this.logger.warn(
          `Could not resolve UUID ${criteria} to SharePoint item ID`,
        );

        return [];
      }

      return [sharePointId];
    }

    if (Array.isArray(criteria)) {
      // Array of UUIDs - resolve each to SharePoint ID
      const resolvedIds: string[] = [];

      for (const uuid of criteria) {
        const sharePointId = await this.findSharePointItemId(String(uuid));

        if (sharePointId) {
          resolvedIds.push(sharePointId);
        } else {
          this.logger.warn(
            `Could not resolve UUID ${uuid} to SharePoint item ID`,
          );
        }
      }

      return resolvedIds;
    }

    if (typeof criteria === 'object') {
      // FindOptionsWhere - check if it's an ID-based query
      const criteriaObj = criteria as FindOptionsWhere<T>;

      // Special handling for id field queries (e.g., { id: { eq: 'uuid' } })
      if ('id' in criteriaObj) {
        const idValue = (criteriaObj as ObjectLiteral).id;

        // Handle TypeORM Find operators like { eq: 'uuid' }
        if (
          typeof idValue === 'object' &&
          idValue !== null &&
          '_type' in idValue &&
          idValue._type === 'equal'
        ) {
          const uuid = idValue._value;
          const sharePointId = await this.findSharePointItemId(uuid);

          if (!sharePointId) {
            this.logger.warn(
              `Could not resolve UUID ${uuid} to SharePoint item ID`,
            );

            return [];
          }

          return [sharePointId];
        }
        // Direct UUID value
        else if (typeof idValue === 'string') {
          const sharePointId = await this.findSharePointItemId(idValue);

          if (!sharePointId) {
            this.logger.warn(
              `Could not resolve UUID ${idValue} to SharePoint item ID`,
            );

            return [];
          }

          return [sharePointId];
        }
      }

      // For other queries, find items matching criteria and get their SharePoint IDs
      const items = await this.find({ where: criteria as FindOptionsWhere<T> });

      // Map Twenty entity IDs (UUIDs) to SharePoint numeric IDs
      const resolvedIds: string[] = [];

      for (const item of items) {
        const twentyUuid = (item as unknown as { id: string }).id;
        const sharePointId = await this.findSharePointItemId(twentyUuid);

        if (sharePointId) {
          resolvedIds.push(sharePointId);
        }
      }

      return resolvedIds;
    }

    return [String(criteria)];
  }

  /**
   * Apply default values for required Twenty.one fields from object metadata
   * This ensures fields are properly set when inserting/updating based on field definitions
   */
  private applyDefaultValues(entity: ObjectLiteral): ObjectLiteral {
    const entityWithDefaults = { ...entity };

    // Get object metadata to read default values from field definitions
    const objectMetadata = getObjectMetadataFromEntityTarget(
      this.target,
      this['internalContext'],
    );

    if (!objectMetadata) {
      this.logger.warn(
        'Object metadata not found, cannot apply default values',
      );

      return entityWithDefaults;
    }

    // Apply default values from field metadata
    Object.values(objectMetadata.fieldsById).forEach((field) => {
      const fieldName = field.name;
      const currentValue = entityWithDefaults[fieldName];

      // Skip if value already exists (not null/undefined)
      if (currentValue !== null && currentValue !== undefined) {
        return;
      }

      // Apply default value from metadata if defined
      if (field.defaultValue !== null && field.defaultValue !== undefined) {
        entityWithDefaults[fieldName] = this.parseDefaultValue(
          field.defaultValue,
        );
      }
    });

    return entityWithDefaults;
  }

  /**
   * Parse default value from field metadata
   * Handles different default value formats (quoted strings, numbers, expressions)
   */
  private parseDefaultValue(defaultValue: unknown): unknown {
    // Handle null/undefined
    if (defaultValue === null || defaultValue === undefined) {
      return null;
    }

    // Handle string default values
    if (typeof defaultValue === 'string') {
      // Remove surrounding quotes if present (e.g., "'System'" -> "System")
      if (
        defaultValue.startsWith("'") &&
        defaultValue.endsWith("'") &&
        defaultValue.length > 1
      ) {
        return defaultValue.slice(1, -1);
      }

      // Handle special keywords
      if (defaultValue === 'now') {
        return new Date();
      }
      if (defaultValue === 'uuid') {
        return null; // UUID is generated elsewhere
      }

      return defaultValue;
    }

    // Handle numeric default values
    if (typeof defaultValue === 'number') {
      return defaultValue;
    }

    // Handle object default values (e.g., ACTOR, FULL_NAME)
    if (typeof defaultValue === 'object') {
      return defaultValue;
    }

    return null;
  }
}

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
    const items = await this.sharePointService.getListItems(
      this.siteId,
      this.listId,
      queryOptions,
      token,
    );

    if (items.length === 0) {
      return null;
    }

    const entities = this.transformToEntities(items);

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
    this.logger.debug('SharePoint save', { entityOrEntities });
    const token = await this.ensureToken();

    const entities = Array.isArray(entityOrEntities)
      ? entityOrEntities
      : [entityOrEntities];
    const results: T[] = [];

    for (const entity of entities) {
      const sharePointItem = this.transformToSharePointItem(entity);
      const entityWithId = entity as unknown as T & { id?: string };
      const entityId = entityWithId.id;

      let savedItem: SharePointListItem;

      if (entityId) {
        // Update existing
        savedItem = await this.sharePointService.updateListItem(
          this.siteId,
          this.listId,
          entityId,
          sharePointItem,
          token,
        );
      } else {
        // Create new
        savedItem = await this.sharePointService.createListItem(
          this.siteId,
          this.listId,
          sharePointItem,
          token,
        );
      }

      const transformedEntity = this.transformToEntity(savedItem);

      results.push(transformedEntity);
    }

    return (Array.isArray(entityOrEntities)
      ? results
      : results[0]) as unknown as U | U[];
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
      const sharePointItem = this.transformToSharePointItem(item);
      const createdItem = await this.sharePointService.createListItem(
        this.siteId,
        this.listId,
        sharePointItem,
        token,
      );

      identifiers.push({ id: createdItem.id });
      generatedMaps.push({ id: createdItem.id });
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
      const sharePointItem = this.transformToSharePointItem(entity);
      const entityWithId = entity as T & { id?: string };
      const entityId = entityWithId.id;

      let resultItem: SharePointListItem;

      if (entityId) {
        // Check if exists, then update or insert
        try {
          resultItem = await this.sharePointService.updateListItem(
            this.siteId,
            this.listId,
            entityId,
            sharePointItem,
            token,
          );
        } catch {
          resultItem = await this.sharePointService.createListItem(
            this.siteId,
            this.listId,
            sharePointItem,
            token,
          );
        }
      } else {
        resultItem = await this.sharePointService.createListItem(
          this.siteId,
          this.listId,
          sharePointItem,
          token,
        );
      }

      identifiers.push({ id: resultItem.id });
      generatedMaps.push({ id: resultItem.id });
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
   */
  private whereToOData(where: FindOptionsWhere<T>): string {
    const conditions: string[] = [];

    for (const [key, value] of Object.entries(where)) {
      if (value === null || value === undefined) {
        conditions.push(`${key} eq null`);
      } else if (typeof value === 'object' && value !== null) {
        // Handle TypeORM Find operators
        const operator = value as ObjectLiteral;

        // Check for TypeORM operator patterns
        if ('_type' in operator) {
          const opType = operator._type;
          const opValue = operator._value;

          switch (opType) {
            case 'moreThan':
              conditions.push(`${key} gt ${this.formatODataValue(opValue)}`);
              break;
            case 'moreThanOrEqual':
              conditions.push(`${key} ge ${this.formatODataValue(opValue)}`);
              break;
            case 'lessThan':
              conditions.push(`${key} lt ${this.formatODataValue(opValue)}`);
              break;
            case 'lessThanOrEqual':
              conditions.push(`${key} le ${this.formatODataValue(opValue)}`);
              break;
            case 'like':
              // Convert SQL LIKE to OData contains/startswith/endswith
              const likeValue = String(opValue).replace(/%/g, '');

              if (
                String(opValue).startsWith('%') &&
                String(opValue).endsWith('%')
              ) {
                conditions.push(`contains(${key}, '${likeValue}')`);
              } else if (String(opValue).startsWith('%')) {
                conditions.push(`endswith(${key}, '${likeValue}')`);
              } else if (String(opValue).endsWith('%')) {
                conditions.push(`startswith(${key}, '${likeValue}')`);
              } else {
                conditions.push(`${key} eq '${likeValue}'`);
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
                conditions.push(`contains(tolower(${key}), '${ilikeValue}')`);
              } else {
                conditions.push(`tolower(${key}) eq '${ilikeValue}'`);
              }
              break;
            case 'between':
              if (Array.isArray(opValue) && opValue.length === 2) {
                conditions.push(
                  `${key} ge ${this.formatODataValue(opValue[0])} and ${key} le ${this.formatODataValue(opValue[1])}`,
                );
              }
              break;
            case 'in':
              if (Array.isArray(opValue) && opValue.length > 0) {
                const inValues = opValue
                  .map((v) => this.formatODataValue(v))
                  .join(',');

                conditions.push(`${key} in (${inValues})`);
              }
              break;
            case 'isNull':
              conditions.push(`${key} eq null`);
              break;
            case 'not':
              // NOT operator
              if (typeof opValue === 'object') {
                const notCondition = this.whereToOData({
                  [key]: opValue,
                } as FindOptionsWhere<T>);

                conditions.push(`not (${notCondition})`);
              } else {
                conditions.push(`${key} ne ${this.formatODataValue(opValue)}`);
              }
              break;
            default:
              // Fallback: treat as equality
              conditions.push(`${key} eq ${this.formatODataValue(opValue)}`);
          }
        } else {
          // Plain object - treat as equality
          conditions.push(`${key} eq '${JSON.stringify(value)}'`);
        }
      } else if (typeof value === 'string') {
        conditions.push(`${key} eq '${value}'`);
      } else if (typeof value === 'number') {
        conditions.push(`${key} eq ${value}`);
      } else if (typeof value === 'boolean') {
        conditions.push(`${key} eq ${value}`);
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
   * Transform SharePoint list items to Twenty.one entities
   */
  private transformToEntities(items: SharePointListItem[]): T[] {
    return items.map((item) => this.transformToEntity(item));
  }

  /**
   * Transform single SharePoint item to Twenty.one entity
   */
  private transformToEntity(item: SharePointListItem): T {
    return {
      id: item.id,
      ...item.fields,
    } as unknown as T;
  }

  /**
   * Transform Twenty.one entity to SharePoint item data
   */
  private transformToSharePointItem(
    entity: DeepPartialWithNestedRelationFields<T> | QueryDeepPartialEntity<T>,
  ): Record<string, unknown> {
    const entityWithId = entity as ObjectLiteral & { id?: string };
    const { id: _id, ...fields } = entityWithId;

    return fields;
  }

  /**
   * Resolve criteria to SharePoint item IDs
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
    // Simple ID resolution
    if (typeof criteria === 'string') {
      return [criteria];
    }

    if (Array.isArray(criteria)) {
      return criteria.map((c) => String(c));
    }

    if (typeof criteria === 'object') {
      // Find items matching criteria
      const items = await this.find({ where: criteria as FindOptionsWhere<T> });

      return items.map((item: ObjectLiteral) => item.id as string);
    }

    return [String(criteria)];
  }
}

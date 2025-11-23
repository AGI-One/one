import { Injectable, Logger } from '@nestjs/common';

import { isDefined } from 'class-validator';
import { QUERY_MAX_RECORDS } from 'twenty-shared/constants';
import { ObjectRecord } from 'twenty-shared/types';
import { FindOptionsRelations, ObjectLiteral } from 'typeorm';

import { WorkspaceAuthContext } from 'src/engine/api/common/interfaces/workspace-auth-context.interface';

import { CommonBaseQueryRunnerService } from 'src/engine/api/common/common-query-runners/common-base-query-runner.service';
import {
  CommonQueryRunnerException,
  CommonQueryRunnerExceptionCode,
} from 'src/engine/api/common/common-query-runners/errors/common-query-runner.exception';
import { CommonBaseQueryRunnerContext } from 'src/engine/api/common/types/common-base-query-runner-context.type';
import { CommonExtendedQueryRunnerContext } from 'src/engine/api/common/types/common-extended-query-runner-context.type';
import {
  CommonExtendedInput,
  CommonInput,
  CommonQueryNames,
  UpdateManyQueryArgs,
} from 'src/engine/api/common/types/common-query-args.type';
import { buildColumnsToReturn } from 'src/engine/api/graphql/graphql-query-runner/utils/build-columns-to-return';
import { assertIsValidUuid } from 'src/engine/api/graphql/workspace-query-runner/utils/assert-is-valid-uuid.util';
import { assertMutationNotOnRemoteObject } from 'src/engine/metadata-modules/object-metadata/utils/assert-mutation-not-on-remote-object.util';
import { ObjectMetadataMaps } from 'src/engine/metadata-modules/types/object-metadata-maps';

@Injectable()
export class CommonUpdateManyQueryRunnerService extends CommonBaseQueryRunnerService<
  UpdateManyQueryArgs,
  ObjectRecord[]
> {
  protected readonly operationName = CommonQueryNames.UPDATE_MANY;
  private readonly logger = new Logger(CommonUpdateManyQueryRunnerService.name);

  async run(
    args: CommonExtendedInput<UpdateManyQueryArgs>,
    queryRunnerContext: CommonExtendedQueryRunnerContext,
  ): Promise<ObjectRecord[]> {
    const {
      repository,
      authContext,
      rolePermissionConfig,
      workspaceDataSource,
      objectMetadataMaps,
      objectMetadataItemWithFieldMaps,
      commonQueryParser,
    } = queryRunnerContext;

    // Check if repository supports QueryBuilder
    // SharePoint repository throws error on createQueryBuilder
    const isSharePointRepository =
      repository.constructor.name === 'SharePointRepository';

    if (isSharePointRepository) {
      // Use repository methods for SharePoint
      // Build where clause from filter
      const where = this.buildWhereFromFilter(args.filter);

      this.logger.debug('SharePoint update - finding entities', {
        where,
        filter: args.filter,
      });

      const entitiesToUpdate = await repository.find({ where });

      this.logger.debug('SharePoint update - found entities', {
        count: entitiesToUpdate.length,
        entities: entitiesToUpdate,
      });

      if (entitiesToUpdate.length === 0) {
        return [];
      }

      // Update each entity
      const updatedRecords: ObjectRecord[] = [];

      for (const entity of entitiesToUpdate) {
        const updated = await repository.save({
          ...entity,
          ...args.data,
        });

        updatedRecords.push(updated as ObjectRecord);
      }

      if (isDefined(args.selectedFieldsResult.relations)) {
        await this.processNestedRelationsHelper.processNestedRelations({
          objectMetadataMaps,
          parentObjectMetadataItem: objectMetadataItemWithFieldMaps,
          parentObjectRecords: updatedRecords,
          relations: args.selectedFieldsResult.relations as Record<
            string,
            FindOptionsRelations<ObjectLiteral>
          >,
          limit: QUERY_MAX_RECORDS,
          authContext,
          workspaceDataSource,
          rolePermissionConfig,
          selectedFields: args.selectedFieldsResult.select,
        });
      }

      return updatedRecords;
    }

    // Original QueryBuilder approach for PostgreSQL
    const queryBuilder = repository.createQueryBuilder(
      objectMetadataItemWithFieldMaps.nameSingular,
    );

    commonQueryParser.applyFilterToBuilder(
      queryBuilder,
      objectMetadataItemWithFieldMaps.nameSingular,
      args.filter,
    );

    const columnsToReturn = buildColumnsToReturn({
      select: args.selectedFieldsResult.select,
      relations: args.selectedFieldsResult.relations,
      objectMetadataItemWithFieldMaps,
      objectMetadataMaps,
    });

    const updatedObjectRecords = await queryBuilder
      .update()
      .set(args.data)
      .returning(columnsToReturn)
      .execute();

    const updatedRecords = updatedObjectRecords.generatedMaps as ObjectRecord[];

    if (isDefined(args.selectedFieldsResult.relations)) {
      await this.processNestedRelationsHelper.processNestedRelations({
        objectMetadataMaps,
        parentObjectMetadataItem: objectMetadataItemWithFieldMaps,
        parentObjectRecords: updatedRecords,
        //TODO : Refacto-common - Typing to fix when switching processNestedRelationsHelper to Common
        relations: args.selectedFieldsResult.relations as Record<
          string,
          FindOptionsRelations<ObjectLiteral>
        >,
        limit: QUERY_MAX_RECORDS,
        authContext,
        workspaceDataSource,
        rolePermissionConfig,
        selectedFields: args.selectedFieldsResult.select,
      });
    }

    return updatedRecords;
  }

  private buildWhereFromFilter(filter: any): any {
    // Simple conversion from GraphQL filter to TypeORM where clause
    // Filter format: { id: { eq: 'uuid' } }
    // Where format: { id: 'uuid' }
    const where: any = {};

    for (const [key, value] of Object.entries(filter || {})) {
      if (typeof value === 'object' && value !== null) {
        // Handle filter operators like { eq: 'value' }
        if ('eq' in value) {
          where[key] = value.eq;
        } else if ('in' in value) {
          where[key] = value.in;
        }
        // Add more operators as needed
      } else {
        where[key] = value;
      }
    }

    return where;
  }

  async computeArgs(
    args: CommonInput<UpdateManyQueryArgs>,
    queryRunnerContext: CommonBaseQueryRunnerContext,
  ): Promise<CommonInput<UpdateManyQueryArgs>> {
    const { authContext, objectMetadataItemWithFieldMaps } = queryRunnerContext;

    return {
      ...args,
      filter:
        this.queryRunnerArgsFactory.overrideFilterByFieldMetadata(
          args.filter,
          objectMetadataItemWithFieldMaps,
        ) || {},
      data: (
        await this.dataArgProcessor.process({
          partialRecordInputs: [args.data],
          authContext,
          objectMetadataItemWithFieldMaps,
          shouldBackfillPositionIfUndefined: false,
        })
      )[0],
    };
  }

  async validate(
    args: CommonInput<UpdateManyQueryArgs>,
    queryRunnerContext: CommonBaseQueryRunnerContext,
  ): Promise<void> {
    const { objectMetadataItemWithFieldMaps } = queryRunnerContext;

    assertMutationNotOnRemoteObject(objectMetadataItemWithFieldMaps);
    if (!args.filter) {
      throw new CommonQueryRunnerException(
        'Filter is required',
        CommonQueryRunnerExceptionCode.INVALID_QUERY_INPUT,
      );
    }

    args.filter.id?.in?.forEach((id: string) => assertIsValidUuid(id));
  }

  async processQueryResult(
    queryResult: ObjectRecord[],
    objectMetadataItemId: string,
    objectMetadataMaps: ObjectMetadataMaps,
    authContext: WorkspaceAuthContext,
  ): Promise<ObjectRecord[]> {
    return await this.commonResultGettersService.processRecordArray(
      queryResult,
      objectMetadataItemId,
      objectMetadataMaps,
      authContext.workspace.id,
    );
  }
}

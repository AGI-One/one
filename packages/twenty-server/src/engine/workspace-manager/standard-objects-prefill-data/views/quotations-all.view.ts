import { msg } from '@lingui/core/macro';

import { AggregateOperations } from 'src/engine/api/graphql/graphql-query-runner/constants/aggregate-operations.constant';
import { type ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import { DEFAULT_VIEW_FIELD_SIZE } from 'src/engine/workspace-manager/standard-objects-prefill-data/views/constants/DEFAULT_VIEW_FIELD_SIZE';
import {
    BASE_OBJECT_STANDARD_FIELD_IDS,
    QUOTATION_STANDARD_FIELD_IDS,
} from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';

export const quotationsAllView = (
  objectMetadataItems: ObjectMetadataEntity[],
  useCoreNaming = false,
) => {
  const quotationObjectMetadata = objectMetadataItems.find(
    (object) => object.standardId === STANDARD_OBJECT_IDS.quotation,
  );

  if (!quotationObjectMetadata) {
    throw new Error('Quotation object metadata not found');
  }

  return {
    name: useCoreNaming ? msg`All {objectLabelPlural}` : 'All Quotations',
    objectMetadataId: quotationObjectMetadata.id ?? '',
    type: 'table',
    key: 'INDEX',
    position: 0,
    icon: 'IconList',
    kanbanFieldMetadataId: '',
    filters: [],
    fields: [
      {
        fieldMetadataId:
          quotationObjectMetadata.fields.find(
            (field) =>
              field.standardId === QUOTATION_STANDARD_FIELD_IDS.quotationCode,
          )?.id ?? '',
        position: 0,
        isVisible: true,
        size: DEFAULT_VIEW_FIELD_SIZE,
      },
      {
        fieldMetadataId:
          quotationObjectMetadata.fields.find(
            (field) =>
              field.standardId === QUOTATION_STANDARD_FIELD_IDS.quotationName,
          )?.id ?? '',
        position: 1,
        isVisible: true,
        size: DEFAULT_VIEW_FIELD_SIZE,
      },
      {
        fieldMetadataId:
          quotationObjectMetadata.fields.find(
            (field) =>
              field.standardId === QUOTATION_STANDARD_FIELD_IDS.supplier,
          )?.id ?? '',
        position: 2,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          quotationObjectMetadata.fields.find(
            (field) =>
              field.standardId === QUOTATION_STANDARD_FIELD_IDS.project,
          )?.id ?? '',
        position: 3,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          quotationObjectMetadata.fields.find(
            (field) => field.standardId === QUOTATION_STANDARD_FIELD_IDS.status,
          )?.id ?? '',
        position: 4,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          quotationObjectMetadata.fields.find(
            (field) =>
              field.standardId === QUOTATION_STANDARD_FIELD_IDS.totalAmount,
          )?.id ?? '',
        position: 5,
        isVisible: true,
        size: 150,
        aggregateOperation: AggregateOperations.SUM,
      },
      {
        fieldMetadataId:
          quotationObjectMetadata.fields.find(
            (field) =>
              field.standardId === QUOTATION_STANDARD_FIELD_IDS.quotationDate,
          )?.id ?? '',
        position: 6,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          quotationObjectMetadata.fields.find(
            (field) =>
              field.standardId === QUOTATION_STANDARD_FIELD_IDS.validUntil,
          )?.id ?? '',
        position: 7,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          quotationObjectMetadata.fields.find(
            (field) =>
              field.standardId === BASE_OBJECT_STANDARD_FIELD_IDS.createdAt,
          )?.id ?? '',
        position: 8,
        isVisible: true,
        size: 150,
      },
    ],
  };
};

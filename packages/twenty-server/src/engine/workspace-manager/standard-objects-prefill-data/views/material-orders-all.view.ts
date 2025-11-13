import { msg } from '@lingui/core/macro';

import { AggregateOperations } from 'src/engine/api/graphql/graphql-query-runner/constants/aggregate-operations.constant';
import { type ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import { DEFAULT_VIEW_FIELD_SIZE } from 'src/engine/workspace-manager/standard-objects-prefill-data/views/constants/DEFAULT_VIEW_FIELD_SIZE';
import { MATERIAL_ORDER_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';

export const materialOrdersAllView = (
  objectMetadataItems: ObjectMetadataEntity[],
  useCoreNaming = false,
) => {
  const materialOrderObjectMetadata = objectMetadataItems.find(
    (object) => object.standardId === STANDARD_OBJECT_IDS.materialOrder,
  );

  if (!materialOrderObjectMetadata) {
    throw new Error('Material Order object metadata not found');
  }

  return {
    name: useCoreNaming ? msg`All {objectLabelPlural}` : 'All Material Orders',
    objectMetadataId: materialOrderObjectMetadata.id ?? '',
    type: 'table',
    key: 'INDEX',
    position: 0,
    icon: 'IconList',
    kanbanFieldMetadataId: '',
    filters: [],
    fields: [
      {
        fieldMetadataId:
          materialOrderObjectMetadata.fields.find(
            (field) =>
              field.standardId === MATERIAL_ORDER_STANDARD_FIELD_IDS.orderCode,
          )?.id ?? '',
        position: 0,
        isVisible: true,
        size: DEFAULT_VIEW_FIELD_SIZE,
      },
      {
        fieldMetadataId:
          materialOrderObjectMetadata.fields.find(
            (field) =>
              field.standardId === MATERIAL_ORDER_STANDARD_FIELD_IDS.supplier,
          )?.id ?? '',
        position: 1,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          materialOrderObjectMetadata.fields.find(
            (field) =>
              field.standardId === MATERIAL_ORDER_STANDARD_FIELD_IDS.project,
          )?.id ?? '',
        position: 2,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          materialOrderObjectMetadata.fields.find(
            (field) =>
              field.standardId ===
              MATERIAL_ORDER_STANDARD_FIELD_IDS.totalAmount,
          )?.id ?? '',
        position: 3,
        isVisible: true,
        size: 150,
        aggregateOperation: AggregateOperations.SUM,
      },
      {
        fieldMetadataId:
          materialOrderObjectMetadata.fields.find(
            (field) =>
              field.standardId ===
              MATERIAL_ORDER_STANDARD_FIELD_IDS.purchaseApprovalStatus,
          )?.id ?? '',
        position: 4,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          materialOrderObjectMetadata.fields.find(
            (field) =>
              field.standardId === MATERIAL_ORDER_STANDARD_FIELD_IDS.priority,
          )?.id ?? '',
        position: 5,
        isVisible: true,
        size: 120,
      },
      {
        fieldMetadataId:
          materialOrderObjectMetadata.fields.find(
            (field) =>
              field.standardId ===
              MATERIAL_ORDER_STANDARD_FIELD_IDS.nextApprover,
          )?.id ?? '',
        position: 6,
        isVisible: true,
        size: 150,
      },
    ],
  };
};

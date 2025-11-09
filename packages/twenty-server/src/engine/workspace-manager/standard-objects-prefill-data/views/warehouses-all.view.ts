import { msg } from '@lingui/core/macro';

import { type ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import {
  BASE_OBJECT_STANDARD_FIELD_IDS,
  WAREHOUSE_STANDARD_FIELD_IDS,
} from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';

export const warehousesAllView = (
  objectMetadataItems: ObjectMetadataEntity[],
  useCoreNaming = false,
) => {
  const warehouseObjectMetadata = objectMetadataItems.find(
    (object) => object.standardId === STANDARD_OBJECT_IDS.warehouse,
  );

  if (!warehouseObjectMetadata) {
    throw new Error('Warehouse object metadata not found');
  }

  return {
    name: useCoreNaming ? msg`All {objectLabelPlural}` : 'All Warehouses',
    objectMetadataId: warehouseObjectMetadata.id,
    type: 'table',
    key: 'INDEX',
    position: 0,
    icon: 'IconBuilding',
    kanbanFieldMetadataId:
      warehouseObjectMetadata.fields.find(
        (field) => field.standardId === WAREHOUSE_STANDARD_FIELD_IDS.enabled,
      )?.id ?? '',
    filters: [],
    fields: [
      {
        fieldMetadataId:
          warehouseObjectMetadata.fields.find(
            (field) => field.standardId === WAREHOUSE_STANDARD_FIELD_IDS.name,
          )?.id ?? '',
        position: 0,
        isVisible: true,
        size: 180,
      },
      {
        fieldMetadataId:
          warehouseObjectMetadata.fields.find(
            (field) => field.standardId === WAREHOUSE_STANDARD_FIELD_IDS.code,
          )?.id ?? '',
        position: 1,
        isVisible: true,
        size: 120,
      },
      {
        fieldMetadataId:
          warehouseObjectMetadata.fields.find(
            (field) =>
              field.standardId === WAREHOUSE_STANDARD_FIELD_IDS.description,
          )?.id ?? '',
        position: 2,
        isVisible: true,
        size: 200,
      },
      {
        fieldMetadataId:
          warehouseObjectMetadata.fields.find(
            (field) =>
              field.standardId === WAREHOUSE_STANDARD_FIELD_IDS.enabled,
          )?.id ?? '',
        position: 3,
        isVisible: true,
        size: 100,
      },
      {
        fieldMetadataId:
          warehouseObjectMetadata.fields.find(
            (field) => field.standardId === WAREHOUSE_STANDARD_FIELD_IDS.email,
          )?.id ?? '',
        position: 4,
        isVisible: true,
        size: 180,
      },
      {
        fieldMetadataId:
          warehouseObjectMetadata.fields.find(
            (field) => field.standardId === WAREHOUSE_STANDARD_FIELD_IDS.phone,
          )?.id ?? '',
        position: 5,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          warehouseObjectMetadata.fields.find(
            (field) =>
              field.standardId === BASE_OBJECT_STANDARD_FIELD_IDS.createdAt,
          )?.id ?? '',
        position: 6,
        isVisible: true,
        size: 150,
      },
    ],
  };
};

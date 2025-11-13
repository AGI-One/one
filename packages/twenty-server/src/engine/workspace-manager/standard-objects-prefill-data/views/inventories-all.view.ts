import { msg } from '@lingui/core/macro';

import { type ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import {
  BASE_OBJECT_STANDARD_FIELD_IDS,
  INVENTORY_STANDARD_FIELD_IDS,
} from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';

export const inventoriesAllView = (
  objectMetadataItems: ObjectMetadataEntity[],
  useCoreNaming = false,
) => {
  const inventoryObjectMetadata = objectMetadataItems.find(
    (object) => object.standardId === STANDARD_OBJECT_IDS.inventory,
  );

  if (!inventoryObjectMetadata) {
    throw new Error('Inventory object metadata not found');
  }

  return {
    name: useCoreNaming ? msg`All {objectLabelPlural}` : 'All Inventories',
    objectMetadataId: inventoryObjectMetadata.id,
    type: 'table',
    key: 'INDEX',
    position: 0,
    icon: 'IconList',
    kanbanFieldMetadataId: '',
    filters: [],
    fields: [
      {
        fieldMetadataId:
          inventoryObjectMetadata.fields.find(
            (field) =>
              field.standardId === INVENTORY_STANDARD_FIELD_IDS.warehouse,
          )?.id ?? '',
        position: 0,
        isVisible: true,
        size: 180,
      },
      {
        fieldMetadataId:
          inventoryObjectMetadata.fields.find(
            (field) =>
              field.standardId === INVENTORY_STANDARD_FIELD_IDS.material,
          )?.id ?? '',
        position: 1,
        isVisible: true,
        size: 180,
      },
      {
        fieldMetadataId:
          inventoryObjectMetadata.fields.find(
            (field) =>
              field.standardId === INVENTORY_STANDARD_FIELD_IDS.currentBalance,
          )?.id ?? '',
        position: 2,
        isVisible: true,
        size: 100,
      },
      {
        fieldMetadataId:
          inventoryObjectMetadata.fields.find(
            (field) =>
              field.standardId ===
              INVENTORY_STANDARD_FIELD_IDS.reservedQuantity,
          )?.id ?? '',
        position: 4,
        isVisible: true,
        size: 100,
      },
      {
        fieldMetadataId:
          inventoryObjectMetadata.fields.find(
            (field) =>
              field.standardId === INVENTORY_STANDARD_FIELD_IDS.createdBy,
          )?.id ?? '',
        position: 5,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          inventoryObjectMetadata.fields.find(
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

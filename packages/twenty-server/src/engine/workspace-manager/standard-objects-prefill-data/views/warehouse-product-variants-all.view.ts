import { msg } from '@lingui/core/macro';

import { type ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import {
  BASE_OBJECT_STANDARD_FIELD_IDS,
  WAREHOUSE_PRODUCT_VARIANT_STANDARD_FIELD_IDS,
} from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';

export const warehouseProductVariantsAllView = (
  objectMetadataItems: ObjectMetadataEntity[],
  useCoreNaming = false,
) => {
  const warehouseProductVariantObjectMetadata = objectMetadataItems.find(
    (object) => object.standardId === STANDARD_OBJECT_IDS.warehouseProductVariant,
  );

  if (!warehouseProductVariantObjectMetadata) {
    throw new Error('WarehouseProductVariant object metadata not found');
  }

  return {
    name: useCoreNaming
      ? msg`All {objectLabelPlural}`
      : 'All Warehouse Product Variants',
    objectMetadataId: warehouseProductVariantObjectMetadata.id,
    type: 'table',
    key: 'INDEX',
    position: 0,
    icon: 'IconBoxSeam',
    kanbanFieldMetadataId: '',
    filters: [],
    fields: [
      {
        fieldMetadataId:
          warehouseProductVariantObjectMetadata.fields.find(
            (field) =>
              field.standardId ===
              WAREHOUSE_PRODUCT_VARIANT_STANDARD_FIELD_IDS.warehouseProduct,
          )?.id ?? '',
        position: 0,
        isVisible: true,
        size: 180,
      },
      {
        fieldMetadataId:
          warehouseProductVariantObjectMetadata.fields.find(
            (field) =>
              field.standardId ===
              WAREHOUSE_PRODUCT_VARIANT_STANDARD_FIELD_IDS.productVariant,
          )?.id ?? '',
        position: 1,
        isVisible: true,
        size: 180,
      },
      {
        fieldMetadataId:
          warehouseProductVariantObjectMetadata.fields.find(
            (field) =>
              field.standardId ===
              WAREHOUSE_PRODUCT_VARIANT_STANDARD_FIELD_IDS.quantity,
          )?.id ?? '',
        position: 2,
        isVisible: true,
        size: 120,
      },
      {
        fieldMetadataId:
          warehouseProductVariantObjectMetadata.fields.find(
            (field) =>
              field.standardId === BASE_OBJECT_STANDARD_FIELD_IDS.createdAt,
          )?.id ?? '',
        position: 3,
        isVisible: true,
        size: 150,
      },
    ],
  };
};

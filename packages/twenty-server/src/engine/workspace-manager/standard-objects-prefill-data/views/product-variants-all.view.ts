import { msg } from '@lingui/core/macro';

import { type ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import {
  BASE_OBJECT_STANDARD_FIELD_IDS,
  PRODUCT_VARIANT_STANDARD_FIELD_IDS,
} from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';

export const productVariantsAllView = (
  objectMetadataItems: ObjectMetadataEntity[],
  useCoreNaming = false,
) => {
  const productVariantObjectMetadata = objectMetadataItems.find(
    (object) => object.standardId === STANDARD_OBJECT_IDS.productVariant,
  );

  if (!productVariantObjectMetadata) {
    throw new Error('ProductVariant object metadata not found');
  }

  return {
    name: useCoreNaming ? msg`All {objectLabelPlural}` : 'All Product Variants',
    objectMetadataId: productVariantObjectMetadata.id,
    type: 'table',
    key: 'INDEX',
    position: 0,
    icon: 'IconList',
    kanbanFieldMetadataId: '',
    filters: [],
    fields: [
      {
        fieldMetadataId:
          productVariantObjectMetadata.fields.find(
            (field) =>
              field.standardId === PRODUCT_VARIANT_STANDARD_FIELD_IDS.sku,
          )?.id ?? '',
        position: 0,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          productVariantObjectMetadata.fields.find(
            (field) =>
              field.standardId === PRODUCT_VARIANT_STANDARD_FIELD_IDS.product,
          )?.id ?? '',
        position: 1,
        isVisible: true,
        size: 180,
      },
      {
        fieldMetadataId:
          productVariantObjectMetadata.fields.find(
            (field) =>
              field.standardId === PRODUCT_VARIANT_STANDARD_FIELD_IDS.quantity,
          )?.id ?? '',
        position: 2,
        isVisible: true,
        size: 100,
      },
      {
        fieldMetadataId:
          productVariantObjectMetadata.fields.find(
            (field) =>
              field.standardId ===
              PRODUCT_VARIANT_STANDARD_FIELD_IDS.retailPrice,
          )?.id ?? '',
        position: 3,
        isVisible: true,
        size: 120,
      },
      {
        fieldMetadataId:
          productVariantObjectMetadata.fields.find(
            (field) =>
              field.standardId === PRODUCT_VARIANT_STANDARD_FIELD_IDS.unitCost,
          )?.id ?? '',
        position: 4,
        isVisible: true,
        size: 120,
      },
      {
        fieldMetadataId:
          productVariantObjectMetadata.fields.find(
            (field) =>
              field.standardId === PRODUCT_VARIANT_STANDARD_FIELD_IDS.enabled,
          )?.id ?? '',
        position: 5,
        isVisible: true,
        size: 100,
      },
      {
        fieldMetadataId:
          productVariantObjectMetadata.fields.find(
            (field) =>
              field.standardId ===
              PRODUCT_VARIANT_STANDARD_FIELD_IDS.trackInventory,
          )?.id ?? '',
        position: 6,
        isVisible: true,
        size: 120,
      },
      {
        fieldMetadataId:
          productVariantObjectMetadata.fields.find(
            (field) =>
              field.standardId === BASE_OBJECT_STANDARD_FIELD_IDS.createdAt,
          )?.id ?? '',
        position: 7,
        isVisible: true,
        size: 150,
      },
    ],
  };
};

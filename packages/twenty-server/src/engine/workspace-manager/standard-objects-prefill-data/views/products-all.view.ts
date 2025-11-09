import { msg } from '@lingui/core/macro';

import { type ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import {
  BASE_OBJECT_STANDARD_FIELD_IDS,
  PRODUCT_STANDARD_FIELD_IDS,
} from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';

export const productsAllView = (
  objectMetadataItems: ObjectMetadataEntity[],
  useCoreNaming = false,
) => {
  const productObjectMetadata = objectMetadataItems.find(
    (object) => object.standardId === STANDARD_OBJECT_IDS.product,
  );

  if (!productObjectMetadata) {
    throw new Error('Product object metadata not found');
  }

  return {
    name: useCoreNaming ? msg`All {objectLabelPlural}` : 'All Products',
    objectMetadataId: productObjectMetadata.id,
    type: 'table',
    key: 'INDEX',
    position: 0,
    icon: 'IconList',
    kanbanFieldMetadataId: '',
    filters: [],
    fields: [
      {
        fieldMetadataId:
          productObjectMetadata.fields.find(
            (field) => field.standardId === PRODUCT_STANDARD_FIELD_IDS.name,
          )?.id ?? '',
        position: 0,
        isVisible: true,
        size: 210,
      },
      {
        fieldMetadataId:
          productObjectMetadata.fields.find(
            (field) => field.standardId === PRODUCT_STANDARD_FIELD_IDS.code,
          )?.id ?? '',
        position: 1,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          productObjectMetadata.fields.find(
            (field) =>
              field.standardId === PRODUCT_STANDARD_FIELD_IDS.productType,
          )?.id ?? '',
        position: 2,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          productObjectMetadata.fields.find(
            (field) =>
              field.standardId === PRODUCT_STANDARD_FIELD_IDS.productCategory,
          )?.id ?? '',
        position: 3,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          productObjectMetadata.fields.find(
            (field) => field.standardId === PRODUCT_STANDARD_FIELD_IDS.enabled,
          )?.id ?? '',
        position: 4,
        isVisible: true,
        size: 100,
      },
      {
        fieldMetadataId:
          productObjectMetadata.fields.find(
            (field) =>
              field.standardId === PRODUCT_STANDARD_FIELD_IDS.description,
          )?.id ?? '',
        position: 5,
        isVisible: true,
        size: 200,
      },
      {
        fieldMetadataId:
          productObjectMetadata.fields.find(
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

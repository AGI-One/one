import { msg } from '@lingui/core/macro';

import { type ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import {
  BASE_OBJECT_STANDARD_FIELD_IDS,
  PRODUCT_CATEGORY_STANDARD_FIELD_IDS,
} from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';

export const productCategoriesAllView = (
  objectMetadataItems: ObjectMetadataEntity[],
  useCoreNaming = false,
) => {
  const productCategoryObjectMetadata = objectMetadataItems.find(
    (object) => object.standardId === STANDARD_OBJECT_IDS.productCategory,
  );

  if (!productCategoryObjectMetadata) {
    throw new Error('ProductCategory object metadata not found');
  }

  return {
    name: useCoreNaming
      ? msg`All {objectLabelPlural}`
      : 'All Product Categories',
    objectMetadataId: productCategoryObjectMetadata.id,
    type: 'table',
    key: 'INDEX',
    position: 0,
    icon: 'IconList',
    kanbanFieldMetadataId: '',
    filters: [],
    fields: [
      {
        fieldMetadataId:
          productCategoryObjectMetadata.fields.find(
            (field) =>
              field.standardId === PRODUCT_CATEGORY_STANDARD_FIELD_IDS.name,
          )?.id ?? '',
        position: 0,
        isVisible: true,
        size: 210,
      },
      {
        fieldMetadataId:
          productCategoryObjectMetadata.fields.find(
            (field) =>
              field.standardId ===
              PRODUCT_CATEGORY_STANDARD_FIELD_IDS.description,
          )?.id ?? '',
        position: 1,
        isVisible: true,
        size: 250,
      },
      {
        fieldMetadataId:
          productCategoryObjectMetadata.fields.find(
            (field) =>
              field.standardId === PRODUCT_CATEGORY_STANDARD_FIELD_IDS.imageUrl,
          )?.id ?? '',
        position: 2,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          productCategoryObjectMetadata.fields.find(
            (field) =>
              field.standardId ===
              PRODUCT_CATEGORY_STANDARD_FIELD_IDS.createdBy,
          )?.id ?? '',
        position: 3,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          productCategoryObjectMetadata.fields.find(
            (field) =>
              field.standardId === BASE_OBJECT_STANDARD_FIELD_IDS.createdAt,
          )?.id ?? '',
        position: 4,
        isVisible: true,
        size: 150,
      },
    ],
  };
};

import { msg } from '@lingui/core/macro';

import { type ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import {
  BASE_OBJECT_STANDARD_FIELD_IDS,
  PRODUCT_OPTION_GROUP_STANDARD_FIELD_IDS,
} from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';

export const productOptionGroupsAllView = (
  objectMetadataItems: ObjectMetadataEntity[],
  useCoreNaming = false,
) => {
  const productOptionGroupObjectMetadata = objectMetadataItems.find(
    (object) => object.standardId === STANDARD_OBJECT_IDS.productOptionGroup,
  );

  if (!productOptionGroupObjectMetadata) {
    throw new Error('ProductOptionGroup object metadata not found');
  }

  return {
    name: useCoreNaming
      ? msg`All {objectLabelPlural}`
      : 'All Product Option Groups',
    objectMetadataId: productOptionGroupObjectMetadata.id,
    type: 'table',
    key: 'INDEX',
    position: 0,
    icon: 'IconList',
    kanbanFieldMetadataId: '',
    filters: [],
    fields: [
      {
        fieldMetadataId:
          productOptionGroupObjectMetadata.fields.find(
            (field) =>
              field.standardId === PRODUCT_OPTION_GROUP_STANDARD_FIELD_IDS.name,
          )?.id ?? '',
        position: 0,
        isVisible: true,
        size: 210,
      },
      {
        fieldMetadataId:
          productOptionGroupObjectMetadata.fields.find(
            (field) =>
              field.standardId ===
              PRODUCT_OPTION_GROUP_STANDARD_FIELD_IDS.inputType,
          )?.id ?? '',
        position: 1,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          productOptionGroupObjectMetadata.fields.find(
            (field) =>
              field.standardId ===
              PRODUCT_OPTION_GROUP_STANDARD_FIELD_IDS.isGlobal,
          )?.id ?? '',
        position: 2,
        isVisible: true,
        size: 100,
      },
      {
        fieldMetadataId:
          productOptionGroupObjectMetadata.fields.find(
            (field) =>
              field.standardId ===
              PRODUCT_OPTION_GROUP_STANDARD_FIELD_IDS.createdBy,
          )?.id ?? '',
        position: 3,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          productOptionGroupObjectMetadata.fields.find(
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

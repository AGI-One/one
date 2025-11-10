import { msg } from '@lingui/core/macro';

import { type ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import {
  BASE_OBJECT_STANDARD_FIELD_IDS,
  PRODUCT_OPTION_GROUP_LINK_STANDARD_FIELD_IDS,
} from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';

export const productOptionGroupLinksAllView = (
  objectMetadataItems: ObjectMetadataEntity[],
  useCoreNaming = false,
) => {
  const productOptionGroupLinkObjectMetadata = objectMetadataItems.find(
    (object) =>
      object.standardId === STANDARD_OBJECT_IDS.productOptionGroupLink,
  );

  if (!productOptionGroupLinkObjectMetadata) {
    throw new Error('ProductOptionGroupLink object metadata not found');
  }

  return {
    name: useCoreNaming
      ? msg`All {objectLabelPlural}`
      : 'All Product Option Group Links',
    objectMetadataId: productOptionGroupLinkObjectMetadata.id,
    type: 'table',
    key: 'INDEX',
    position: 0,
    icon: 'IconList',
    kanbanFieldMetadataId: '',
    filters: [],
    fields: [
      {
        fieldMetadataId:
          productOptionGroupLinkObjectMetadata.fields.find(
            (field) =>
              field.standardId ===
              PRODUCT_OPTION_GROUP_LINK_STANDARD_FIELD_IDS.product,
          )?.id ?? '',
        position: 0,
        isVisible: true,
        size: 210,
      },
      {
        fieldMetadataId:
          productOptionGroupLinkObjectMetadata.fields.find(
            (field) =>
              field.standardId ===
              PRODUCT_OPTION_GROUP_LINK_STANDARD_FIELD_IDS.optionGroup,
          )?.id ?? '',
        position: 1,
        isVisible: true,
        size: 210,
      },
      {
        fieldMetadataId:
          productOptionGroupLinkObjectMetadata.fields.find(
            (field) =>
              field.standardId ===
              PRODUCT_OPTION_GROUP_LINK_STANDARD_FIELD_IDS.required,
          )?.id ?? '',
        position: 2,
        isVisible: true,
        size: 100,
      },
      {
        fieldMetadataId:
          productOptionGroupLinkObjectMetadata.fields.find(
            (field) =>
              field.standardId ===
              PRODUCT_OPTION_GROUP_LINK_STANDARD_FIELD_IDS.position,
          )?.id ?? '',
        position: 3,
        isVisible: true,
        size: 100,
      },
      {
        fieldMetadataId:
          productOptionGroupLinkObjectMetadata.fields.find(
            (field) =>
              field.standardId ===
              PRODUCT_OPTION_GROUP_LINK_STANDARD_FIELD_IDS.customDisplayName,
          )?.id ?? '',
        position: 4,
        isVisible: true,
        size: 200,
      },
      {
        fieldMetadataId:
          productOptionGroupLinkObjectMetadata.fields.find(
            (field) =>
              field.standardId === BASE_OBJECT_STANDARD_FIELD_IDS.createdAt,
          )?.id ?? '',
        position: 5,
        isVisible: true,
        size: 150,
      },
    ],
  };
};

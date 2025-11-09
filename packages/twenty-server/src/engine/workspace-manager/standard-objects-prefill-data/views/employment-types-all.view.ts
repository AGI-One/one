import { msg } from '@lingui/core/macro';

import { type ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import { BASE_OBJECT_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';

export const employmentTypesAllView = (
  objectMetadataItems: ObjectMetadataEntity[],
  useCoreNaming = false,
) => {
  const employmentTypeObjectMetadata = objectMetadataItems.find(
    (object) => object.standardId === '6c231232-1bf2-4669-b653-60faa7e02fab',
  );

  if (!employmentTypeObjectMetadata) {
    throw new Error('Employment Type object metadata not found');
  }

  return {
    name: useCoreNaming ? msg`All {objectLabelPlural}` : 'All Employment Types',
    objectMetadataId: employmentTypeObjectMetadata.id,
    type: 'table',
    key: 'INDEX',
    position: 0,
    icon: 'IconList',
    kanbanFieldMetadataId: '',
    filters: [],
    fields: [
      {
        fieldMetadataId:
          employmentTypeObjectMetadata.fields.find(
            (field) =>
              field.standardId === '60f38a84-d8b3-4e84-b256-32a643acffed',
          )?.id ?? '',
        position: 0,
        isVisible: true,
        size: 210,
      },
      {
        fieldMetadataId:
          employmentTypeObjectMetadata.fields.find(
            (field) =>
              field.standardId === '25c86e5e-929a-49dc-99d0-05bbed697978',
          )?.id ?? '',
        position: 1,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          employmentTypeObjectMetadata.fields.find(
            (field) =>
              field.standardId === BASE_OBJECT_STANDARD_FIELD_IDS.createdAt,
          )?.id ?? '',
        position: 2,
        isVisible: true,
        size: 150,
      },
    ],
  };
};

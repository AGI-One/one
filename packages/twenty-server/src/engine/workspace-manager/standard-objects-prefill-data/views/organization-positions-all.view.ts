import { msg } from '@lingui/core/macro';

import { type ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import { BASE_OBJECT_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';

export const organizationPositionsAllView = (
  objectMetadataItems: ObjectMetadataEntity[],
  useCoreNaming = false,
) => {
  const organizationPositionObjectMetadata = objectMetadataItems.find(
    (object) => object.standardId === '44b2f458-19c2-4460-ab19-33bcc40db34e',
  );

  if (!organizationPositionObjectMetadata) {
    throw new Error('Organization Position object metadata not found');
  }

  return {
    name: useCoreNaming
      ? msg`All {objectLabelPlural}`
      : 'All Organization Positions',
    objectMetadataId: organizationPositionObjectMetadata.id,
    type: 'table',
    key: 'INDEX',
    position: 0,
    icon: 'IconList',
    kanbanFieldMetadataId: '',
    filters: [],
    fields: [
      {
        fieldMetadataId:
          organizationPositionObjectMetadata.fields.find(
            (field) =>
              field.standardId === 'dcd033ec-8b95-4f12-a520-b5af1382a0df',
          )?.id ?? '',
        position: 0,
        isVisible: true,
        size: 210,
      },
      {
        fieldMetadataId:
          organizationPositionObjectMetadata.fields.find(
            (field) =>
              field.standardId === '38b95cc0-ee07-4bfa-81e0-ebbe56d21891',
          )?.id ?? '',
        position: 1,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          organizationPositionObjectMetadata.fields.find(
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

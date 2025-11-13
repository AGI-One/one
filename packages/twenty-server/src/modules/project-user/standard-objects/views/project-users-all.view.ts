import { msg } from '@lingui/core/macro';

import { type ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import { PROJECT_USER_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';

export const projectUsersAllView = (
  objectMetadataItems: ObjectMetadataEntity[],
  useCoreNaming = false,
) => {
  const projectUserObjectMetadata = objectMetadataItems.find(
    (object) => object.standardId === STANDARD_OBJECT_IDS.projectUser,
  );

  if (!projectUserObjectMetadata) {
    throw new Error('ProjectUser object metadata not found');
  }

  return {
    name: useCoreNaming ? msg`All {objectLabelPlural}` : 'All Project Users',
    objectMetadataId: projectUserObjectMetadata.id,
    type: 'table',
    key: 'INDEX',
    position: 0,
    icon: 'IconUserPlus',
    kanbanFieldMetadataId: '',
    filters: [],
    fields: [
      {
        fieldMetadataId:
          projectUserObjectMetadata.fields.find(
            (field) =>
              field.standardId === PROJECT_USER_STANDARD_FIELD_IDS.appUserId,
          )?.id ?? '',
        position: 0,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          projectUserObjectMetadata.fields.find(
            (field) =>
              field.standardId === PROJECT_USER_STANDARD_FIELD_IDS.projectId,
          )?.id ?? '',
        position: 1,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          projectUserObjectMetadata.fields.find(
            (field) =>
              field.standardId === PROJECT_USER_STANDARD_FIELD_IDS.email,
          )?.id ?? '',
        position: 2,
        isVisible: true,
        size: 200,
      },
    ],
  };
};

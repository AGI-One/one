import { msg } from '@lingui/core/macro';

import { type ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import {
  BASE_OBJECT_STANDARD_FIELD_IDS,
  APP_USER_STANDARD_FIELD_IDS,
} from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';

export const appUsersAllView = (
  objectMetadataItems: ObjectMetadataEntity[],
  useCoreNaming = false,
) => {
  const appUserObjectMetadata = objectMetadataItems.find(
    (object) => object.standardId === STANDARD_OBJECT_IDS.appUser,
  );

  if (!appUserObjectMetadata) {
    throw new Error('AppUser object metadata not found');
  }

  return {
    name: useCoreNaming ? msg`All {objectLabelPlural}` : 'All App Users',
    objectMetadataId: appUserObjectMetadata.id,
    type: 'table',
    key: 'INDEX',
    position: 0,
    icon: 'IconUser',
    kanbanFieldMetadataId: '',
    filters: [],
    fields: [
      {
        fieldMetadataId:
          appUserObjectMetadata.fields.find(
            (field) =>
              field.standardId === APP_USER_STANDARD_FIELD_IDS.displayName,
          )?.id ?? '',
        position: 0,
        isVisible: true,
        size: 200,
      },
      {
        fieldMetadataId:
          appUserObjectMetadata.fields.find(
            (field) => field.standardId === APP_USER_STANDARD_FIELD_IDS.mail,
          )?.id ?? '',
        position: 1,
        isVisible: true,
        size: 200,
      },
      {
        fieldMetadataId:
          appUserObjectMetadata.fields.find(
            (field) =>
              field.standardId === APP_USER_STANDARD_FIELD_IDS.isActive,
          )?.id ?? '',
        position: 2,
        isVisible: true,
        size: 100,
      },
      {
        fieldMetadataId:
          appUserObjectMetadata.fields.find(
            (field) =>
              field.standardId === APP_USER_STANDARD_FIELD_IDS.createdBy,
          )?.id ?? '',
        position: 3,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          appUserObjectMetadata.fields.find(
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

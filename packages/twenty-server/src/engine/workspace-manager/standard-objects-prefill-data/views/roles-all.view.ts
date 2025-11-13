import { msg } from '@lingui/core/macro';

import { type ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import {
  BASE_OBJECT_STANDARD_FIELD_IDS,
  ROLE_STANDARD_FIELD_IDS,
} from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';

export const rolesAllView = (
  objectMetadataItems: ObjectMetadataEntity[],
  useCoreNaming = false,
) => {
  const roleObjectMetadata = objectMetadataItems.find(
    (object) => object.standardId === STANDARD_OBJECT_IDS.role,
  );

  if (!roleObjectMetadata) {
    throw new Error('Role object metadata not found');
  }

  return {
    name: useCoreNaming ? msg`All {objectLabelPlural}` : 'All Roles',
    objectMetadataId: roleObjectMetadata.id,
    type: 'table',
    key: 'INDEX',
    position: 0,
    icon: 'IconUsers',
    kanbanFieldMetadataId: '',
    filters: [],
    fields: [
      {
        fieldMetadataId:
          roleObjectMetadata.fields.find(
            (field) => field.standardId === ROLE_STANDARD_FIELD_IDS.roleName,
          )?.id ?? '',
        position: 0,
        isVisible: true,
        size: 200,
      },
      {
        fieldMetadataId:
          roleObjectMetadata.fields.find(
            (field) => field.standardId === ROLE_STANDARD_FIELD_IDS.roleCode,
          )?.id ?? '',
        position: 1,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          roleObjectMetadata.fields.find(
            (field) => field.standardId === ROLE_STANDARD_FIELD_IDS.description,
          )?.id ?? '',
        position: 2,
        isVisible: true,
        size: 250,
      },
      {
        fieldMetadataId:
          roleObjectMetadata.fields.find(
            (field) => field.standardId === ROLE_STANDARD_FIELD_IDS.workGroup,
          )?.id ?? '',
        position: 3,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          roleObjectMetadata.fields.find(
            (field) => field.standardId === ROLE_STANDARD_FIELD_IDS.createdBy,
          )?.id ?? '',
        position: 4,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          roleObjectMetadata.fields.find(
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

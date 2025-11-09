import { msg } from '@lingui/core/macro';

import { type ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import { BASE_OBJECT_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';

export const teamsAllView = (
  objectMetadataItems: ObjectMetadataEntity[],
  useCoreNaming = false,
) => {
  const teamObjectMetadata = objectMetadataItems.find(
    (object) => object.standardId === '50cf852c-59ae-4681-9baf-e81395fee42c',
  );

  if (!teamObjectMetadata) {
    throw new Error('Team object metadata not found');
  }

  return {
    name: useCoreNaming ? msg`All {objectLabelPlural}` : 'All Teams',
    objectMetadataId: teamObjectMetadata.id,
    type: 'table',
    key: 'INDEX',
    position: 0,
    icon: 'IconList',
    kanbanFieldMetadataId: '',
    filters: [],
    fields: [
      {
        fieldMetadataId:
          teamObjectMetadata.fields.find(
            (field) =>
              field.standardId === '32c939bb-f238-4aae-adca-665599f1ad05',
          )?.id ?? '',
        position: 0,
        isVisible: true,
        size: 210,
      },
      {
        fieldMetadataId:
          teamObjectMetadata.fields.find(
            (field) =>
              field.standardId === 'a8925405-ac20-49f8-b1ce-7ab95f9f79ad',
          )?.id ?? '',
        position: 1,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          teamObjectMetadata.fields.find(
            (field) =>
              field.standardId === '6f06dbe8-4116-4afb-a5bf-ecfc02f02361',
          )?.id ?? '',
        position: 2,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          teamObjectMetadata.fields.find(
            (field) =>
              field.standardId === '63be4164-afcb-48af-aee0-0d4b9fd9abe9',
          )?.id ?? '',
        position: 3,
        isVisible: true,
        size: 100,
      },
      {
        fieldMetadataId:
          teamObjectMetadata.fields.find(
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

import { msg } from '@lingui/core/macro';

import { type ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import {
  BASE_OBJECT_STANDARD_FIELD_IDS,
  PROJECT_STANDARD_FIELD_IDS,
} from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';

export const projectsAllView = (
  objectMetadataItems: ObjectMetadataEntity[],
  useCoreNaming = false,
) => {
  const projectObjectMetadata = objectMetadataItems.find(
    (object) => object.standardId === STANDARD_OBJECT_IDS.project,
  );

  if (!projectObjectMetadata) {
    throw new Error('Project object metadata not found');
  }

  return {
    name: useCoreNaming ? msg`All {objectLabelPlural}` : 'All Projects',
    objectMetadataId: projectObjectMetadata.id,
    type: 'table',
    key: 'INDEX',
    position: 0,
    icon: 'IconBriefcase',
    kanbanFieldMetadataId: '',
    filters: [],
    fields: [
      {
        fieldMetadataId:
          projectObjectMetadata.fields.find(
            (field) =>
              field.standardId === PROJECT_STANDARD_FIELD_IDS.projectCode,
          )?.id ?? '',
        position: 0,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          projectObjectMetadata.fields.find(
            (field) =>
              field.standardId === PROJECT_STANDARD_FIELD_IDS.projectName,
          )?.id ?? '',
        position: 1,
        isVisible: true,
        size: 200,
      },
      {
        fieldMetadataId:
          projectObjectMetadata.fields.find(
            (field) => field.standardId === PROJECT_STANDARD_FIELD_IDS.status,
          )?.id ?? '',
        position: 2,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          projectObjectMetadata.fields.find(
            (field) =>
              field.standardId === PROJECT_STANDARD_FIELD_IDS.projectOwnerName,
          )?.id ?? '',
        position: 3,
        isVisible: true,
        size: 180,
      },
      {
        fieldMetadataId:
          projectObjectMetadata.fields.find(
            (field) =>
              field.standardId === PROJECT_STANDARD_FIELD_IDS.startDate,
          )?.id ?? '',
        position: 4,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          projectObjectMetadata.fields.find(
            (field) => field.standardId === PROJECT_STANDARD_FIELD_IDS.endDate,
          )?.id ?? '',
        position: 5,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          projectObjectMetadata.fields.find(
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

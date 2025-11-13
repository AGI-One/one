import { msg } from '@lingui/core/macro';

import { type ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import {
  BASE_OBJECT_STANDARD_FIELD_IDS,
  JOB_TITLE_STANDARD_FIELD_IDS,
} from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';

export const jobTitlesAllView = (
  objectMetadataItems: ObjectMetadataEntity[],
  useCoreNaming = false,
) => {
  const jobTitleObjectMetadata = objectMetadataItems.find(
    (object) => object.standardId === STANDARD_OBJECT_IDS.jobTitle,
  );

  if (!jobTitleObjectMetadata) {
    throw new Error('JobTitle object metadata not found');
  }

  return {
    name: useCoreNaming ? msg`All {objectLabelPlural}` : 'All Job Titles',
    objectMetadataId: jobTitleObjectMetadata.id,
    type: 'table',
    key: 'INDEX',
    position: 0,
    icon: 'IconBriefcase',
    kanbanFieldMetadataId: '',
    filters: [],
    fields: [
      {
        fieldMetadataId:
          jobTitleObjectMetadata.fields.find(
            (field) => field.standardId === JOB_TITLE_STANDARD_FIELD_IDS.title,
          )?.id ?? '',
        position: 0,
        isVisible: true,
        size: 200,
      },
      {
        fieldMetadataId:
          jobTitleObjectMetadata.fields.find(
            (field) => field.standardId === JOB_TITLE_STANDARD_FIELD_IDS.code,
          )?.id ?? '',
        position: 1,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          jobTitleObjectMetadata.fields.find(
            (field) =>
              field.standardId === JOB_TITLE_STANDARD_FIELD_IDS.createdBy,
          )?.id ?? '',
        position: 2,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          jobTitleObjectMetadata.fields.find(
            (field) =>
              field.standardId === BASE_OBJECT_STANDARD_FIELD_IDS.createdAt,
          )?.id ?? '',
        position: 3,
        isVisible: true,
        size: 150,
      },
    ],
  };
};

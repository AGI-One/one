import { msg } from '@lingui/core/macro';

import { type ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import { BASE_OBJECT_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';

export const employeeLevelsAllView = (
  objectMetadataItems: ObjectMetadataEntity[],
  useCoreNaming = false,
) => {
  const employeeLevelObjectMetadata = objectMetadataItems.find(
    (object) => object.standardId === '82d8264c-8c2c-4e2f-a01e-00b9fb58fa01',
  );

  if (!employeeLevelObjectMetadata) {
    throw new Error('Employee Level object metadata not found');
  }

  return {
    name: useCoreNaming ? msg`All {objectLabelPlural}` : 'All Employee Levels',
    objectMetadataId: employeeLevelObjectMetadata.id,
    type: 'table',
    key: 'INDEX',
    position: 0,
    icon: 'IconList',
    kanbanFieldMetadataId: '',
    filters: [],
    fields: [
      {
        fieldMetadataId:
          employeeLevelObjectMetadata.fields.find(
            (field) =>
              field.standardId === '3fbfe175-325c-43d5-9c5e-5a3eedbb3ff5',
          )?.id ?? '',
        position: 0,
        isVisible: true,
        size: 210,
      },
      {
        fieldMetadataId:
          employeeLevelObjectMetadata.fields.find(
            (field) =>
              field.standardId === 'dd5809bc-5635-4723-a16b-483898b9b986',
          )?.id ?? '',
        position: 1,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          employeeLevelObjectMetadata.fields.find(
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

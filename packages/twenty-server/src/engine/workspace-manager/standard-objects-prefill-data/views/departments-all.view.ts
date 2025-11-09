import { msg } from '@lingui/core/macro';

import { type ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import { BASE_OBJECT_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';

export const departmentsAllView = (
  objectMetadataItems: ObjectMetadataEntity[],
  useCoreNaming = false,
) => {
  const departmentObjectMetadata = objectMetadataItems.find(
    (object) => object.standardId === '4fd2619f-2624-48cd-97e8-c5328de9f7ea',
  );

  if (!departmentObjectMetadata) {
    throw new Error('Department object metadata not found');
  }

  return {
    name: useCoreNaming ? msg`All {objectLabelPlural}` : 'All Departments',
    objectMetadataId: departmentObjectMetadata.id,
    type: 'table',
    key: 'INDEX',
    position: 0,
    icon: 'IconList',
    kanbanFieldMetadataId: '',
    filters: [],
    fields: [
      {
        fieldMetadataId:
          departmentObjectMetadata.fields.find(
            (field) =>
              field.standardId === '4f96d230-a3f0-4d40-949b-44f082811ba1',
          )?.id ?? '',
        position: 0,
        isVisible: true,
        size: 210,
      },
      {
        fieldMetadataId:
          departmentObjectMetadata.fields.find(
            (field) =>
              field.standardId === '4fea132a-1762-480f-88e5-30f0c8c3addf',
          )?.id ?? '',
        position: 1,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          departmentObjectMetadata.fields.find(
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

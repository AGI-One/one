import { msg } from '@lingui/core/macro';

import { type ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import { BASE_OBJECT_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';

export const employeesAllView = (
  objectMetadataItems: ObjectMetadataEntity[],
  useCoreNaming = false,
) => {
  const employeeObjectMetadata = objectMetadataItems.find(
    (object) => object.standardId === 'd9eb3cd3-0d19-4d3e-95a0-e1b8c222279b',
  );

  if (!employeeObjectMetadata) {
    throw new Error('Employee object metadata not found');
  }

  return {
    name: useCoreNaming ? msg`All {objectLabelPlural}` : 'All Employees',
    objectMetadataId: employeeObjectMetadata.id,
    type: 'table',
    key: 'INDEX',
    position: 0,
    icon: 'IconList',
    kanbanFieldMetadataId: '',
    filters: [],
    fields: [
      {
        fieldMetadataId:
          employeeObjectMetadata.fields.find(
            (field) =>
              field.standardId === '01bb78ac-387b-42f3-b9a2-e54ef14363af',
          )?.id ?? '',
        position: 0,
        isVisible: true,
        size: 210,
      },
      {
        fieldMetadataId:
          employeeObjectMetadata.fields.find(
            (field) =>
              field.standardId === '73423c75-387d-4932-9579-023d4d45ae24',
          )?.id ?? '',
        position: 1,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          employeeObjectMetadata.fields.find(
            (field) =>
              field.standardId === 'dde2410e-0035-4f9b-91e7-712c8299edc9',
          )?.id ?? '',
        position: 2,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          employeeObjectMetadata.fields.find(
            (field) =>
              field.standardId === '642e44d9-d29a-4a99-9493-69a002396b14',
          )?.id ?? '',
        position: 3,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          employeeObjectMetadata.fields.find(
            (field) =>
              field.standardId === '2a765e1c-d0aa-4edd-875b-33a202d8a9f5',
          )?.id ?? '',
        position: 4,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          employeeObjectMetadata.fields.find(
            (field) =>
              field.standardId === '367d3ac2-f76a-45b1-ba78-f8fce8890521',
          )?.id ?? '',
        position: 5,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          employeeObjectMetadata.fields.find(
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

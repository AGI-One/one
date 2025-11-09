import { msg } from '@lingui/core/macro';

import { type ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import { BASE_OBJECT_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';

export const employeeAwardsAllView = (
  objectMetadataItems: ObjectMetadataEntity[],
  useCoreNaming = false,
) => {
  const employeeAwardObjectMetadata = objectMetadataItems.find(
    (object) => object.standardId === '2fd9f2c6-cb97-4258-ac39-f84b0e017f6b',
  );

  if (!employeeAwardObjectMetadata) {
    throw new Error('Employee Award object metadata not found');
  }

  return {
    name: useCoreNaming ? msg`All {objectLabelPlural}` : 'All Employee Awards',
    objectMetadataId: employeeAwardObjectMetadata.id,
    type: 'table',
    key: 'INDEX',
    position: 0,
    icon: 'IconList',
    kanbanFieldMetadataId: '',
    filters: [],
    fields: [
      {
        fieldMetadataId:
          employeeAwardObjectMetadata.fields.find(
            (field) =>
              field.standardId === '1ff4526f-163f-4cf7-ab1a-71f7eb1cd169',
          )?.id ?? '',
        position: 0,
        isVisible: true,
        size: 210,
      },
      {
        fieldMetadataId:
          employeeAwardObjectMetadata.fields.find(
            (field) =>
              field.standardId === 'fa279d82-8ccc-40ee-94a8-c14798494a48',
          )?.id ?? '',
        position: 1,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          employeeAwardObjectMetadata.fields.find(
            (field) =>
              field.standardId === 'f35500c2-705a-4c64-9de6-16919ac9a2ba',
          )?.id ?? '',
        position: 2,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          employeeAwardObjectMetadata.fields.find(
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

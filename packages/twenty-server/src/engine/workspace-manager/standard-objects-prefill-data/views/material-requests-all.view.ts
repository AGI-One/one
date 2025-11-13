import { type ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import { MATERIAL_REQUEST_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';

export const materialRequestsAllView = (
  objectMetadataItems: ObjectMetadataEntity[],
  isRootLevel?: boolean,
) => {
  const materialRequestObjectMetadata = objectMetadataItems.find(
    (object) => object.standardId === STANDARD_OBJECT_IDS.materialRequest,
  );

  if (!materialRequestObjectMetadata) {
    throw new Error('Material Request object metadata not found');
  }

  return {
    name: isRootLevel ? 'All Material Requests' : 'All Material Requests',
    objectMetadataId: materialRequestObjectMetadata.id,
    type: 'table',
    key: isRootLevel ? 'INDEX' : null,
    position: 0,
    icon: 'IconFileText',
    kanbanFieldMetadataId: '',
    filters: [],
    fields: [
      {
        fieldMetadataId:
          materialRequestObjectMetadata.fields.find(
            (field) =>
              field.standardId === MATERIAL_REQUEST_STANDARD_FIELD_IDS.materialCode,
          )?.id ?? '',
        position: 0,
        isVisible: true,
        size: 120,
      },
      {
        fieldMetadataId:
          materialRequestObjectMetadata.fields.find(
            (field) =>
              field.standardId === MATERIAL_REQUEST_STANDARD_FIELD_IDS.materialName,
          )?.id ?? '',
        position: 1,
        isVisible: true,
        size: 180,
      },
      {
        fieldMetadataId:
          materialRequestObjectMetadata.fields.find(
            (field) =>
              field.standardId === MATERIAL_REQUEST_STANDARD_FIELD_IDS.project,
          )?.id ?? '',
        position: 2,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          materialRequestObjectMetadata.fields.find(
            (field) =>
              field.standardId === MATERIAL_REQUEST_STANDARD_FIELD_IDS.quantity,
          )?.id ?? '',
        position: 3,
        isVisible: true,
        size: 100,
      },
      {
        fieldMetadataId:
          materialRequestObjectMetadata.fields.find(
            (field) =>
              field.standardId === MATERIAL_REQUEST_STANDARD_FIELD_IDS.status,
          )?.id ?? '',
        position: 4,
        isVisible: true,
        size: 120,
      },
      {
        fieldMetadataId:
          materialRequestObjectMetadata.fields.find(
            (field) =>
              field.standardId === MATERIAL_REQUEST_STANDARD_FIELD_IDS.requestedDate,
          )?.id ?? '',
        position: 5,
        isVisible: true,
        size: 120,
      },
      {
        fieldMetadataId:
          materialRequestObjectMetadata.fields.find(
            (field) =>
              field.standardId === MATERIAL_REQUEST_STANDARD_FIELD_IDS.requiredDate,
          )?.id ?? '',
        position: 6,
        isVisible: true,
        size: 120,
      },
    ],
  };
};

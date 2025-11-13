import { type ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import { MATERIAL_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';

export const materialsAllView = (
  objectMetadataItems: ObjectMetadataEntity[],
  isRootLevel?: boolean,
) => {
  const materialObjectMetadata = objectMetadataItems.find(
    (object) => object.standardId === STANDARD_OBJECT_IDS.material,
  );

  if (!materialObjectMetadata) {
    throw new Error('Material object metadata not found');
  }

  return {
    name: isRootLevel ? 'All Materials' : 'All Materials',
    objectMetadataId: materialObjectMetadata.id,
    type: 'table',
    key: isRootLevel ? 'INDEX' : null,
    position: 0,
    icon: 'IconBox',
    kanbanFieldMetadataId: '',
    filters: [],
    fields: [
      {
        fieldMetadataId:
          materialObjectMetadata.fields.find(
            (field) =>
              field.standardId === MATERIAL_STANDARD_FIELD_IDS.materialCode,
          )?.id ?? '',
        position: 0,
        isVisible: true,
        size: 120,
      },
      {
        fieldMetadataId:
          materialObjectMetadata.fields.find(
            (field) =>
              field.standardId === MATERIAL_STANDARD_FIELD_IDS.materialName,
          )?.id ?? '',
        position: 1,
        isVisible: true,
        size: 200,
      },
      {
        fieldMetadataId:
          materialObjectMetadata.fields.find(
            (field) =>
              field.standardId === MATERIAL_STANDARD_FIELD_IDS.materialGroup,
          )?.id ?? '',
        position: 2,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          materialObjectMetadata.fields.find(
            (field) =>
              field.standardId === MATERIAL_STANDARD_FIELD_IDS.specification,
          )?.id ?? '',
        position: 3,
        isVisible: true,
        size: 180,
      },
      {
        fieldMetadataId:
          materialObjectMetadata.fields.find(
            (field) => field.standardId === MATERIAL_STANDARD_FIELD_IDS.unit,
          )?.id ?? '',
        position: 4,
        isVisible: true,
        size: 100,
      },
      {
        fieldMetadataId:
          materialObjectMetadata.fields.find(
            (field) => field.standardId === MATERIAL_STANDARD_FIELD_IDS.status,
          )?.id ?? '',
        position: 5,
        isVisible: true,
        size: 120,
      },
      {
        fieldMetadataId:
          materialObjectMetadata.fields.find(
            (field) =>
              field.standardId === MATERIAL_STANDARD_FIELD_IDS.createdBy,
          )?.id ?? '',
        position: 6,
        isVisible: true,
        size: 150,
      },
    ],
  };
};

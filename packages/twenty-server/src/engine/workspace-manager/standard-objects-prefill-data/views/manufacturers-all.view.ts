import { type ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import { MANUFACTURER_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';

export const manufacturersAllView = (
  objectMetadataItems: ObjectMetadataEntity[],
  isRootLevel?: boolean,
) => {
  const manufacturerObjectMetadata = objectMetadataItems.find(
    (object) => object.standardId === STANDARD_OBJECT_IDS.manufacturer,
  );

  if (!manufacturerObjectMetadata) {
    throw new Error('Manufacturer object metadata not found');
  }

  return {
    name: isRootLevel ? 'All Manufacturers' : 'All Manufacturers',
    objectMetadataId: manufacturerObjectMetadata.id,
    type: 'table',
    key: isRootLevel ? 'INDEX' : null,
    position: 0,
    icon: 'IconBuildingFactory2',
    kanbanFieldMetadataId: '',
    filters: [],
    fields: [
      {
        fieldMetadataId:
          manufacturerObjectMetadata.fields.find(
            (field) =>
              field.standardId ===
              MANUFACTURER_STANDARD_FIELD_IDS.manufacturerCode,
          )?.id ?? '',
        position: 0,
        isVisible: true,
        size: 120,
      },
      {
        fieldMetadataId:
          manufacturerObjectMetadata.fields.find(
            (field) =>
              field.standardId ===
              MANUFACTURER_STANDARD_FIELD_IDS.manufacturerName,
          )?.id ?? '',
        position: 1,
        isVisible: true,
        size: 200,
      },
      {
        fieldMetadataId:
          manufacturerObjectMetadata.fields.find(
            (field) =>
              field.standardId === MANUFACTURER_STANDARD_FIELD_IDS.materialName,
          )?.id ?? '',
        position: 2,
        isVisible: true,
        size: 180,
      },
      {
        fieldMetadataId:
          manufacturerObjectMetadata.fields.find(
            (field) =>
              field.standardId === MANUFACTURER_STANDARD_FIELD_IDS.note,
          )?.id ?? '',
        position: 3,
        isVisible: true,
        size: 200,
      },
      {
        fieldMetadataId:
          manufacturerObjectMetadata.fields.find(
            (field) =>
              field.standardId === MANUFACTURER_STANDARD_FIELD_IDS.createdBy,
          )?.id ?? '',
        position: 4,
        isVisible: true,
        size: 150,
      },
    ],
  };
};

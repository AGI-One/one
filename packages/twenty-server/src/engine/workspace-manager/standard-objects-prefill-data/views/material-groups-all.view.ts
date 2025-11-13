import { type ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import { MATERIAL_GROUP_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';

export const materialGroupsAllView = (
  objectMetadataItems: ObjectMetadataEntity[],
  isRootLevel?: boolean,
) => {
  const materialGroupObjectMetadata = objectMetadataItems.find(
    (object) => object.standardId === STANDARD_OBJECT_IDS.materialGroup,
  );

  if (!materialGroupObjectMetadata) {
    throw new Error('MaterialGroup object metadata not found');
  }

  return {
    name: isRootLevel ? 'All Material Groups' : 'All Material Groups',
    objectMetadataId: materialGroupObjectMetadata.id,
    type: 'table',
    key: isRootLevel ? 'INDEX' : null,
    position: 0,
    icon: 'IconCategory2',
    kanbanFieldMetadataId: '',
    filters: [],
    fields: [
      {
        fieldMetadataId:
          materialGroupObjectMetadata.fields.find(
            (field) =>
              field.standardId ===
              MATERIAL_GROUP_STANDARD_FIELD_IDS.materialGroupCode,
          )?.id ?? '',
        position: 0,
        isVisible: true,
        size: 120,
      },
      {
        fieldMetadataId:
          materialGroupObjectMetadata.fields.find(
            (field) =>
              field.standardId ===
              MATERIAL_GROUP_STANDARD_FIELD_IDS.materialGroupName,
          )?.id ?? '',
        position: 1,
        isVisible: true,
        size: 200,
      },
      {
        fieldMetadataId:
          materialGroupObjectMetadata.fields.find(
            (field) =>
              field.standardId ===
              MATERIAL_GROUP_STANDARD_FIELD_IDS.materialGroup,
          )?.id ?? '',
        position: 2,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          materialGroupObjectMetadata.fields.find(
            (field) =>
              field.standardId ===
              MATERIAL_GROUP_STANDARD_FIELD_IDS.materialType,
          )?.id ?? '',
        position: 3,
        isVisible: true,
        size: 130,
      },
      {
        fieldMetadataId:
          materialGroupObjectMetadata.fields.find(
            (field) =>
              field.standardId === MATERIAL_GROUP_STANDARD_FIELD_IDS.supplier,
          )?.id ?? '',
        position: 4,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          materialGroupObjectMetadata.fields.find(
            (field) =>
              field.standardId ===
              MATERIAL_GROUP_STANDARD_FIELD_IDS.manufacturer,
          )?.id ?? '',
        position: 5,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          materialGroupObjectMetadata.fields.find(
            (field) =>
              field.standardId === MATERIAL_GROUP_STANDARD_FIELD_IDS.createdBy,
          )?.id ?? '',
        position: 6,
        isVisible: true,
        size: 150,
      },
    ],
  };
};

import { type ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import { MATERIAL_CATEGORY_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';

export const materialCategoriesAllView = (
  objectMetadataItems: ObjectMetadataEntity[],
  isRootLevel?: boolean,
) => {
  const materialCategoryObjectMetadata = objectMetadataItems.find(
    (object) => object.standardId === STANDARD_OBJECT_IDS.materialCategory,
  );

  if (!materialCategoryObjectMetadata) {
    throw new Error('Material Category object metadata not found');
  }

  return {
    name: isRootLevel ? 'All Material Categories' : 'All Material Categories',
    objectMetadataId: materialCategoryObjectMetadata.id,
    type: 'table',
    key: isRootLevel ? 'INDEX' : null,
    position: 0,
    icon: 'IconCategory',
    kanbanFieldMetadataId: '',
    filters: [],
    fields: [
      {
        fieldMetadataId:
          materialCategoryObjectMetadata.fields.find(
            (field) =>
              field.standardId ===
              MATERIAL_CATEGORY_STANDARD_FIELD_IDS.materialCategoryCode,
          )?.id ?? '',
        position: 0,
        isVisible: true,
        size: 120,
      },
      {
        fieldMetadataId:
          materialCategoryObjectMetadata.fields.find(
            (field) =>
              field.standardId ===
              MATERIAL_CATEGORY_STANDARD_FIELD_IDS.materialCategoryName,
          )?.id ?? '',
        position: 1,
        isVisible: true,
        size: 200,
      },
      {
        fieldMetadataId:
          materialCategoryObjectMetadata.fields.find(
            (field) =>
              field.standardId ===
              MATERIAL_CATEGORY_STANDARD_FIELD_IDS.createdBy,
          )?.id ?? '',
        position: 2,
        isVisible: true,
        size: 150,
      },
    ],
  };
};

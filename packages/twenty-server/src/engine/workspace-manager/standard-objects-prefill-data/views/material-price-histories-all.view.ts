import { type ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import { MATERIAL_PRICE_HISTORY_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';

export const materialPriceHistoriesAllView = (
  objectMetadataItems: ObjectMetadataEntity[],
  isRootLevel?: boolean,
) => {
  const materialPriceHistoryObjectMetadata = objectMetadataItems.find(
    (object) => object.standardId === STANDARD_OBJECT_IDS.materialPriceHistory,
  );

  if (!materialPriceHistoryObjectMetadata) {
    throw new Error('Material Price History object metadata not found');
  }

  return {
    name: isRootLevel ? 'All Price History' : 'All Price History',
    objectMetadataId: materialPriceHistoryObjectMetadata.id,
    type: 'table',
    key: isRootLevel ? 'INDEX' : null,
    position: 0,
    icon: 'IconHistory',
    kanbanFieldMetadataId: '',
    filters: [],
    fields: [
      {
        fieldMetadataId:
          materialPriceHistoryObjectMetadata.fields.find(
            (field) =>
              field.standardId ===
              MATERIAL_PRICE_HISTORY_STANDARD_FIELD_IDS.materialPrice,
          )?.id ?? '',
        position: 0,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          materialPriceHistoryObjectMetadata.fields.find(
            (field) =>
              field.standardId ===
              MATERIAL_PRICE_HISTORY_STANDARD_FIELD_IDS.oldPrice,
          )?.id ?? '',
        position: 1,
        isVisible: true,
        size: 120,
      },
      {
        fieldMetadataId:
          materialPriceHistoryObjectMetadata.fields.find(
            (field) =>
              field.standardId ===
              MATERIAL_PRICE_HISTORY_STANDARD_FIELD_IDS.newPrice,
          )?.id ?? '',
        position: 2,
        isVisible: true,
        size: 120,
      },
      {
        fieldMetadataId:
          materialPriceHistoryObjectMetadata.fields.find(
            (field) =>
              field.standardId ===
              MATERIAL_PRICE_HISTORY_STANDARD_FIELD_IDS.changedAt,
          )?.id ?? '',
        position: 3,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          materialPriceHistoryObjectMetadata.fields.find(
            (field) =>
              field.standardId ===
              MATERIAL_PRICE_HISTORY_STANDARD_FIELD_IDS.changedBy,
          )?.id ?? '',
        position: 4,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          materialPriceHistoryObjectMetadata.fields.find(
            (field) =>
              field.standardId ===
              MATERIAL_PRICE_HISTORY_STANDARD_FIELD_IDS.reason,
          )?.id ?? '',
        position: 5,
        isVisible: true,
        size: 200,
      },
    ],
  };
};

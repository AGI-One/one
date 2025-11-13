import { type ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import { MATERIAL_PRICE_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';

export const materialPricesAllView = (
  objectMetadataItems: ObjectMetadataEntity[],
  isRootLevel?: boolean,
) => {
  const materialPriceObjectMetadata = objectMetadataItems.find(
    (object) => object.standardId === STANDARD_OBJECT_IDS.materialPrice,
  );

  if (!materialPriceObjectMetadata) {
    throw new Error('Material Price object metadata not found');
  }

  return {
    name: isRootLevel ? 'All Material Prices' : 'All Material Prices',
    objectMetadataId: materialPriceObjectMetadata.id,
    type: 'table',
    key: isRootLevel ? 'INDEX' : null,
    position: 0,
    icon: 'IconCurrencyDollar',
    kanbanFieldMetadataId: '',
    filters: [],
    fields: [
      {
        fieldMetadataId:
          materialPriceObjectMetadata.fields.find(
            (field) =>
              field.standardId === MATERIAL_PRICE_STANDARD_FIELD_IDS.material,
          )?.id ?? '',
        position: 0,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          materialPriceObjectMetadata.fields.find(
            (field) =>
              field.standardId === MATERIAL_PRICE_STANDARD_FIELD_IDS.supplier,
          )?.id ?? '',
        position: 1,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          materialPriceObjectMetadata.fields.find(
            (field) =>
              field.standardId ===
              MATERIAL_PRICE_STANDARD_FIELD_IDS.currentPrice,
          )?.id ?? '',
        position: 2,
        isVisible: true,
        size: 120,
      },
      {
        fieldMetadataId:
          materialPriceObjectMetadata.fields.find(
            (field) =>
              field.standardId === MATERIAL_PRICE_STANDARD_FIELD_IDS.unit,
          )?.id ?? '',
        position: 3,
        isVisible: true,
        size: 100,
      },
      {
        fieldMetadataId:
          materialPriceObjectMetadata.fields.find(
            (field) =>
              field.standardId ===
              MATERIAL_PRICE_STANDARD_FIELD_IDS.manufacturer,
          )?.id ?? '',
        position: 4,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          materialPriceObjectMetadata.fields.find(
            (field) =>
              field.standardId === MATERIAL_PRICE_STANDARD_FIELD_IDS.priceType,
          )?.id ?? '',
        position: 5,
        isVisible: true,
        size: 120,
      },
      {
        fieldMetadataId:
          materialPriceObjectMetadata.fields.find(
            (field) =>
              field.standardId === MATERIAL_PRICE_STANDARD_FIELD_IDS.createdBy,
          )?.id ?? '',
        position: 6,
        isVisible: true,
        size: 150,
      },
    ],
  };
};

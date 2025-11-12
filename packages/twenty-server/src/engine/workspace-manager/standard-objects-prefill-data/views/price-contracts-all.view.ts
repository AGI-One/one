import { type ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import { PRICE_CONTRACT_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';

export const priceContractsAllView = (
  objectMetadataItems: ObjectMetadataEntity[],
  isRootLevel?: boolean,
) => {
  const priceContractObjectMetadata = objectMetadataItems.find(
    (object) => object.standardId === STANDARD_OBJECT_IDS.priceContract,
  );

  if (!priceContractObjectMetadata) {
    throw new Error('Price Contract object metadata not found');
  }

  return {
    name: isRootLevel ? 'All Price Contracts' : 'All Price Contracts',
    objectMetadataId: priceContractObjectMetadata.id,
    type: 'table',
    key: isRootLevel ? 'INDEX' : null,
    position: 0,
    icon: 'IconFileContract',
    kanbanFieldMetadataId: '',
    filters: [],
    fields: [
      {
        fieldMetadataId:
          priceContractObjectMetadata.fields.find(
            (field) =>
              field.standardId ===
              PRICE_CONTRACT_STANDARD_FIELD_IDS.contractCode,
          )?.id ?? '',
        position: 0,
        isVisible: true,
        size: 120,
      },
      {
        fieldMetadataId:
          priceContractObjectMetadata.fields.find(
            (field) =>
              field.standardId ===
              PRICE_CONTRACT_STANDARD_FIELD_IDS.contractName,
          )?.id ?? '',
        position: 1,
        isVisible: true,
        size: 200,
      },
      {
        fieldMetadataId:
          priceContractObjectMetadata.fields.find(
            (field) =>
              field.standardId === PRICE_CONTRACT_STANDARD_FIELD_IDS.supplier,
          )?.id ?? '',
        position: 2,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          priceContractObjectMetadata.fields.find(
            (field) =>
              field.standardId === PRICE_CONTRACT_STANDARD_FIELD_IDS.status,
          )?.id ?? '',
        position: 3,
        isVisible: true,
        size: 120,
      },
      {
        fieldMetadataId:
          priceContractObjectMetadata.fields.find(
            (field) =>
              field.standardId === PRICE_CONTRACT_STANDARD_FIELD_IDS.startDate,
          )?.id ?? '',
        position: 4,
        isVisible: true,
        size: 120,
      },
      {
        fieldMetadataId:
          priceContractObjectMetadata.fields.find(
            (field) =>
              field.standardId === PRICE_CONTRACT_STANDARD_FIELD_IDS.endDate,
          )?.id ?? '',
        position: 5,
        isVisible: true,
        size: 120,
      },
      {
        fieldMetadataId:
          priceContractObjectMetadata.fields.find(
            (field) =>
              field.standardId === PRICE_CONTRACT_STANDARD_FIELD_IDS.createdBy,
          )?.id ?? '',
        position: 6,
        isVisible: true,
        size: 150,
      },
    ],
  };
};

import { type ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import { SUPPLIER_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';

export const suppliersAllView = (
  objectMetadataItems: ObjectMetadataEntity[],
  isRootLevel?: boolean,
) => {
  const supplierObjectMetadata = objectMetadataItems.find(
    (object) => object.standardId === STANDARD_OBJECT_IDS.supplier,
  );

  if (!supplierObjectMetadata) {
    throw new Error('Supplier object metadata not found');
  }

  return {
    name: isRootLevel ? 'All Suppliers' : 'All Suppliers',
    objectMetadataId: supplierObjectMetadata.id,
    type: 'table',
    key: isRootLevel ? 'INDEX' : null,
    position: 0,
    icon: 'IconTruck',
    kanbanFieldMetadataId: '',
    filters: [],
    fields: [
      {
        fieldMetadataId:
          supplierObjectMetadata.fields.find(
            (field) =>
              field.standardId === SUPPLIER_STANDARD_FIELD_IDS.supplierCode,
          )?.id ?? '',
        position: 0,
        isVisible: true,
        size: 120,
      },
      {
        fieldMetadataId:
          supplierObjectMetadata.fields.find(
            (field) =>
              field.standardId === SUPPLIER_STANDARD_FIELD_IDS.supplierName,
          )?.id ?? '',
        position: 1,
        isVisible: true,
        size: 200,
      },
      {
        fieldMetadataId:
          supplierObjectMetadata.fields.find(
            (field) => field.standardId === SUPPLIER_STANDARD_FIELD_IDS.taxCode,
          )?.id ?? '',
        position: 2,
        isVisible: true,
        size: 120,
      },
      {
        fieldMetadataId:
          supplierObjectMetadata.fields.find(
            (field) => field.standardId === SUPPLIER_STANDARD_FIELD_IDS.address,
          )?.id ?? '',
        position: 3,
        isVisible: true,
        size: 200,
      },
      {
        fieldMetadataId:
          supplierObjectMetadata.fields.find(
            (field) =>
              field.standardId === SUPPLIER_STANDARD_FIELD_IDS.contactPerson,
          )?.id ?? '',
        position: 4,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          supplierObjectMetadata.fields.find(
            (field) =>
              field.standardId === SUPPLIER_STANDARD_FIELD_IDS.contactPhone,
          )?.id ?? '',
        position: 5,
        isVisible: true,
        size: 130,
      },
      {
        fieldMetadataId:
          supplierObjectMetadata.fields.find(
            (field) =>
              field.standardId === SUPPLIER_STANDARD_FIELD_IDS.contactEmail,
          )?.id ?? '',
        position: 6,
        isVisible: true,
        size: 180,
      },
      {
        fieldMetadataId:
          supplierObjectMetadata.fields.find(
            (field) =>
              field.standardId === SUPPLIER_STANDARD_FIELD_IDS.createdBy,
          )?.id ?? '',
        position: 7,
        isVisible: true,
        size: 150,
      },
    ],
  };
};

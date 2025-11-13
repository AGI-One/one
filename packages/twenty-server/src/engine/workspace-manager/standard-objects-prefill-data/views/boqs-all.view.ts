import { type ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import { BOQ_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';

export const boqsAllView = (
  objectMetadataItems: ObjectMetadataEntity[],
  isRootLevel?: boolean,
) => {
  const boqObjectMetadata = objectMetadataItems.find(
    (object) => object.standardId === STANDARD_OBJECT_IDS.boq,
  );

  if (!boqObjectMetadata) {
    throw new Error('BoQ object metadata not found');
  }

  return {
    name: isRootLevel ? 'All BoQs' : 'All BoQs',
    objectMetadataId: boqObjectMetadata.id,
    type: 'table',
    key: isRootLevel ? 'INDEX' : null,
    position: 0,
    icon: 'IconListNumbers',
    kanbanFieldMetadataId: '',
    filters: [],
    fields: [
      {
        fieldMetadataId:
          boqObjectMetadata.fields.find(
            (field) => field.standardId === BOQ_STANDARD_FIELD_IDS.position,
          )?.id ?? '',
        position: 0,
        isVisible: true,
        size: 80,
      },
      {
        fieldMetadataId:
          boqObjectMetadata.fields.find(
            (field) => field.standardId === BOQ_STANDARD_FIELD_IDS.title,
          )?.id ?? '',
        position: 1,
        isVisible: true,
        size: 200,
      },
      {
        fieldMetadataId:
          boqObjectMetadata.fields.find(
            (field) => field.standardId === BOQ_STANDARD_FIELD_IDS.type,
          )?.id ?? '',
        position: 2,
        isVisible: true,
        size: 120,
      },
      {
        fieldMetadataId:
          boqObjectMetadata.fields.find(
            (field) =>
              field.standardId === BOQ_STANDARD_FIELD_IDS.classification,
          )?.id ?? '',
        position: 3,
        isVisible: true,
        size: 120,
      },
      {
        fieldMetadataId:
          boqObjectMetadata.fields.find(
            (field) => field.standardId === BOQ_STANDARD_FIELD_IDS.project,
          )?.id ?? '',
        position: 4,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          boqObjectMetadata.fields.find(
            (field) => field.standardId === BOQ_STANDARD_FIELD_IDS.material,
          )?.id ?? '',
        position: 5,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          boqObjectMetadata.fields.find(
            (field) => field.standardId === BOQ_STANDARD_FIELD_IDS.description,
          )?.id ?? '',
        position: 6,
        isVisible: true,
        size: 200,
      },
      {
        fieldMetadataId:
          boqObjectMetadata.fields.find(
            (field) => field.standardId === BOQ_STANDARD_FIELD_IDS.unit,
          )?.id ?? '',
        position: 7,
        isVisible: true,
        size: 80,
      },
      {
        fieldMetadataId:
          boqObjectMetadata.fields.find(
            (field) => field.standardId === BOQ_STANDARD_FIELD_IDS.quantity,
          )?.id ?? '',
        position: 8,
        isVisible: true,
        size: 100,
      },
      {
        fieldMetadataId:
          boqObjectMetadata.fields.find(
            (field) => field.standardId === BOQ_STANDARD_FIELD_IDS.unitPrice,
          )?.id ?? '',
        position: 9,
        isVisible: true,
        size: 120,
      },
      {
        fieldMetadataId:
          boqObjectMetadata.fields.find(
            (field) => field.standardId === BOQ_STANDARD_FIELD_IDS.laborCost,
          )?.id ?? '',
        position: 10,
        isVisible: true,
        size: 120,
      },
      {
        fieldMetadataId:
          boqObjectMetadata.fields.find(
            (field) =>
              field.standardId === BOQ_STANDARD_FIELD_IDS.materialTotalPrice,
          )?.id ?? '',
        position: 11,
        isVisible: true,
        size: 120,
      },
      {
        fieldMetadataId:
          boqObjectMetadata.fields.find(
            (field) =>
              field.standardId === BOQ_STANDARD_FIELD_IDS.laborTotalPrice,
          )?.id ?? '',
        position: 12,
        isVisible: true,
        size: 120,
      },
      {
        fieldMetadataId:
          boqObjectMetadata.fields.find(
            (field) => field.standardId === BOQ_STANDARD_FIELD_IDS.totalPrice,
          )?.id ?? '',
        position: 13,
        isVisible: true,
        size: 120,
      },
      {
        fieldMetadataId:
          boqObjectMetadata.fields.find(
            (field) => field.standardId === BOQ_STANDARD_FIELD_IDS.amount,
          )?.id ?? '',
        position: 14,
        isVisible: true,
        size: 120,
      },
      {
        fieldMetadataId:
          boqObjectMetadata.fields.find(
            (field) => field.standardId === BOQ_STANDARD_FIELD_IDS.manufacturer,
          )?.id ?? '',
        position: 15,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          boqObjectMetadata.fields.find(
            (field) => field.standardId === BOQ_STANDARD_FIELD_IDS.brand,
          )?.id ?? '',
        position: 16,
        isVisible: true,
        size: 120,
      },
      {
        fieldMetadataId:
          boqObjectMetadata.fields.find(
            (field) => field.standardId === BOQ_STANDARD_FIELD_IDS.model,
          )?.id ?? '',
        position: 17,
        isVisible: true,
        size: 120,
      },
      {
        fieldMetadataId:
          boqObjectMetadata.fields.find(
            (field) => field.standardId === BOQ_STANDARD_FIELD_IDS.origin,
          )?.id ?? '',
        position: 18,
        isVisible: true,
        size: 120,
      },
      {
        fieldMetadataId:
          boqObjectMetadata.fields.find(
            (field) =>
              field.standardId === BOQ_STANDARD_FIELD_IDS.technicalSpecs,
          )?.id ?? '',
        position: 19,
        isVisible: true,
        size: 200,
      },
      {
        fieldMetadataId:
          boqObjectMetadata.fields.find(
            (field) => field.standardId === BOQ_STANDARD_FIELD_IDS.image,
          )?.id ?? '',
        position: 20,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          boqObjectMetadata.fields.find(
            (field) => field.standardId === BOQ_STANDARD_FIELD_IDS.parentId,
          )?.id ?? '',
        position: 21,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          boqObjectMetadata.fields.find(
            (field) => field.standardId === BOQ_STANDARD_FIELD_IDS.note,
          )?.id ?? '',
        position: 22,
        isVisible: true,
        size: 200,
      },
    ],
  };
};

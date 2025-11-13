import { msg } from '@lingui/core/macro';

import { AggregateOperations } from 'src/engine/api/graphql/graphql-query-runner/constants/aggregate-operations.constant';
import { type ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import { DEFAULT_VIEW_FIELD_SIZE } from 'src/engine/workspace-manager/standard-objects-prefill-data/views/constants/DEFAULT_VIEW_FIELD_SIZE';
import { MATERIAL_PURCHASE_REQUEST_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';

export const materialPurchaseRequestsAllView = (
  objectMetadataItems: ObjectMetadataEntity[],
  useCoreNaming = false,
) => {
  const materialPurchaseRequestObjectMetadata = objectMetadataItems.find(
    (object) =>
      object.standardId === STANDARD_OBJECT_IDS.materialPurchaseRequest,
  );

  if (!materialPurchaseRequestObjectMetadata) {
    throw new Error('Material Purchase Request object metadata not found');
  }

  return {
    name: useCoreNaming
      ? msg`All {objectLabelPlural}`
      : 'All Material Purchase Requests',
    objectMetadataId: materialPurchaseRequestObjectMetadata.id ?? '',
    type: 'table',
    key: 'INDEX',
    position: 0,
    icon: 'IconList',
    kanbanFieldMetadataId: '',
    filters: [],
    fields: [
      {
        fieldMetadataId:
          materialPurchaseRequestObjectMetadata.fields.find(
            (field) =>
              field.standardId ===
              MATERIAL_PURCHASE_REQUEST_STANDARD_FIELD_IDS.purchaseRequestCode,
          )?.id ?? '',
        position: 0,
        isVisible: true,
        size: DEFAULT_VIEW_FIELD_SIZE,
      },
      {
        fieldMetadataId:
          materialPurchaseRequestObjectMetadata.fields.find(
            (field) =>
              field.standardId ===
              MATERIAL_PURCHASE_REQUEST_STANDARD_FIELD_IDS.material,
          )?.id ?? '',
        position: 1,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          materialPurchaseRequestObjectMetadata.fields.find(
            (field) =>
              field.standardId ===
              MATERIAL_PURCHASE_REQUEST_STANDARD_FIELD_IDS.requestedQuantity,
          )?.id ?? '',
        position: 2,
        isVisible: true,
        size: 120,
        aggregateOperation: AggregateOperations.SUM,
      },
      {
        fieldMetadataId:
          materialPurchaseRequestObjectMetadata.fields.find(
            (field) =>
              field.standardId ===
              MATERIAL_PURCHASE_REQUEST_STANDARD_FIELD_IDS.supplier,
          )?.id ?? '',
        position: 3,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          materialPurchaseRequestObjectMetadata.fields.find(
            (field) =>
              field.standardId ===
              MATERIAL_PURCHASE_REQUEST_STANDARD_FIELD_IDS.status,
          )?.id ?? '',
        position: 4,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          materialPurchaseRequestObjectMetadata.fields.find(
            (field) =>
              field.standardId ===
              MATERIAL_PURCHASE_REQUEST_STANDARD_FIELD_IDS.procurementDepartmentApprovalStatus,
          )?.id ?? '',
        position: 5,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          materialPurchaseRequestObjectMetadata.fields.find(
            (field) =>
              field.standardId ===
              MATERIAL_PURCHASE_REQUEST_STANDARD_FIELD_IDS.priority,
          )?.id ?? '',
        position: 6,
        isVisible: true,
        size: 120,
      },
      {
        fieldMetadataId:
          materialPurchaseRequestObjectMetadata.fields.find(
            (field) =>
              field.standardId ===
              MATERIAL_PURCHASE_REQUEST_STANDARD_FIELD_IDS.requestDate,
          )?.id ?? '',
        position: 7,
        isVisible: true,
        size: 150,
      },
    ],
  };
};

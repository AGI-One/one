import { type ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import { MATERIAL_APPROVAL_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';

export const materialApprovalsAllView = (
  objectMetadataItems: ObjectMetadataEntity[],
  isRootLevel?: boolean,
) => {
  const materialApprovalObjectMetadata = objectMetadataItems.find(
    (object) => object.standardId === STANDARD_OBJECT_IDS.materialApproval,
  );

  if (!materialApprovalObjectMetadata) {
    throw new Error('Material Approval object metadata not found');
  }

  return {
    name: isRootLevel ? 'All Material Approvals' : 'All Material Approvals',
    objectMetadataId: materialApprovalObjectMetadata.id,
    type: 'table',
    key: isRootLevel ? 'INDEX' : null,
    position: 0,
    icon: 'IconCircleCheck',
    kanbanFieldMetadataId: '',
    filters: [],
    fields: [
      {
        fieldMetadataId:
          materialApprovalObjectMetadata.fields.find(
            (field) =>
              field.standardId ===
              MATERIAL_APPROVAL_STANDARD_FIELD_IDS.material,
          )?.id ?? '',
        position: 0,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          materialApprovalObjectMetadata.fields.find(
            (field) =>
              field.standardId === MATERIAL_APPROVAL_STANDARD_FIELD_IDS.project,
          )?.id ?? '',
        position: 1,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          materialApprovalObjectMetadata.fields.find(
            (field) =>
              field.standardId ===
              MATERIAL_APPROVAL_STANDARD_FIELD_IDS.supplier,
          )?.id ?? '',
        position: 2,
        isVisible: true,
        size: 150,
      },
      {
        fieldMetadataId:
          materialApprovalObjectMetadata.fields.find(
            (field) =>
              field.standardId === MATERIAL_APPROVAL_STANDARD_FIELD_IDS.status,
          )?.id ?? '',
        position: 3,
        isVisible: true,
        size: 120,
      },
      {
        fieldMetadataId:
          materialApprovalObjectMetadata.fields.find(
            (field) =>
              field.standardId ===
              MATERIAL_APPROVAL_STANDARD_FIELD_IDS.approvedDate,
          )?.id ?? '',
        position: 4,
        isVisible: true,
        size: 120,
      },
      {
        fieldMetadataId:
          materialApprovalObjectMetadata.fields.find(
            (field) =>
              field.standardId === MATERIAL_APPROVAL_STANDARD_FIELD_IDS.note,
          )?.id ?? '',
        position: 5,
        isVisible: true,
        size: 200,
      },
    ],
  };
};

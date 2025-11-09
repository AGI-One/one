import { msg } from '@lingui/core/macro';
import { FieldMetadataType, RelationOnDeleteAction } from 'twenty-shared/types';

import { RelationType } from 'src/engine/metadata-modules/field-metadata/interfaces/relation-type.interface';
import { Relation } from 'src/engine/workspace-manager/workspace-sync-metadata/interfaces/relation.interface';

import { SEARCH_VECTOR_FIELD } from 'src/engine/metadata-modules/constants/search-vector-field.constants';
import { ActorMetadata } from 'src/engine/metadata-modules/field-metadata/composite-types/actor.composite-type';
import { IndexType } from 'src/engine/metadata-modules/index-metadata/types/indexType.types';
import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { WorkspaceEntity } from 'src/engine/twenty-orm/decorators/workspace-entity.decorator';
import { WorkspaceFieldIndex } from 'src/engine/twenty-orm/decorators/workspace-field-index.decorator';
import { WorkspaceField } from 'src/engine/twenty-orm/decorators/workspace-field.decorator';
import { WorkspaceIsFieldUIReadOnly } from 'src/engine/twenty-orm/decorators/workspace-is-field-ui-readonly.decorator';
import { WorkspaceIsNullable } from 'src/engine/twenty-orm/decorators/workspace-is-nullable.decorator';
import { WorkspaceIsSearchable } from 'src/engine/twenty-orm/decorators/workspace-is-searchable.decorator';
import { WorkspaceIsSystem } from 'src/engine/twenty-orm/decorators/workspace-is-system.decorator';
import { WorkspaceJoinColumn } from 'src/engine/twenty-orm/decorators/workspace-join-column.decorator';
import { WorkspaceRelation } from 'src/engine/twenty-orm/decorators/workspace-relation.decorator';
import {
  type FieldTypeAndNameMetadata,
  getTsVectorColumnExpressionFromFields,
} from 'src/engine/workspace-manager/workspace-sync-metadata/utils/get-ts-vector-column-expression.util';
import { EmployeeWorkspaceEntity } from 'src/modules/employee/standard-objects/employee.workspace-entity';

const NAME_FIELD_NAME = 'name';
const YEAR_FIELD_NAME = 'year';

export const SEARCH_FIELDS_FOR_EMPLOYEE_AWARD: FieldTypeAndNameMetadata[] = [
  { name: NAME_FIELD_NAME, type: FieldMetadataType.TEXT },
  { name: YEAR_FIELD_NAME, type: FieldMetadataType.TEXT },
];

@WorkspaceEntity({
  standardId: '2fd9f2c6-cb97-4258-ac39-f84b0e017f6b',
  namePlural: 'employeeAwards',
  labelSingular: msg`Employee Award`,
  labelPlural: msg`Employee Awards`,
  description: msg`Awards and recognitions given to employees`,
  icon: 'IconAward',
  shortcut: 'EA',
  labelIdentifierStandardId: '1ff4526f-163f-4cf7-ab1a-71f7eb1cd169',
})
@WorkspaceIsSearchable()
export class EmployeeAwardWorkspaceEntity extends BaseWorkspaceEntity {
  @WorkspaceField({
    standardId: '1ff4526f-163f-4cf7-ab1a-71f7eb1cd169',
    type: FieldMetadataType.TEXT,
    label: msg`Name`,
    description: msg`Award name`,
    icon: 'IconAward',
  })
  name: string;

  @WorkspaceField({
    standardId: 'fa279d82-8ccc-40ee-94a8-c14798494a48',
    type: FieldMetadataType.TEXT,
    label: msg`Year`,
    description: msg`Year the award was received`,
    icon: 'IconCalendar',
  })
  year: string;

  @WorkspaceField({
    standardId: '063db34e-8cb2-458a-be6d-f0b9b1490adb',
    type: FieldMetadataType.POSITION,
    label: msg`Position`,
    description: msg`Employee award record position`,
    icon: 'IconHierarchy2',
    defaultValue: 0,
  })
  @WorkspaceIsSystem()
  position: number;

  @WorkspaceField({
    standardId: 'a6c26ec9-ff59-4386-8267-f7a89744e100',
    type: FieldMetadataType.ACTOR,
    label: msg`Created by`,
    icon: 'IconCreativeCommonsSa',
    description: msg`The creator of the record`,
  })
  @WorkspaceIsFieldUIReadOnly()
  createdBy: ActorMetadata;

  // Relations
  @WorkspaceRelation({
    standardId: 'f35500c2-705a-4c64-9de6-16919ac9a2ba',
    type: RelationType.MANY_TO_ONE,
    label: msg`Employee`,
    description: msg`Employee who received the award`,
    icon: 'IconUser',
    inverseSideTarget: () => EmployeeWorkspaceEntity,
    inverseSideFieldKey: 'awards',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsNullable()
  employee: Relation<EmployeeWorkspaceEntity> | null;

  @WorkspaceJoinColumn('employee')
  employeeId: string | null;

  @WorkspaceField({
    standardId: 'e07b9483-feb9-4c87-8862-17324bf4464c',
    type: FieldMetadataType.TS_VECTOR,
    label: SEARCH_VECTOR_FIELD.label,
    description: SEARCH_VECTOR_FIELD.description,
    icon: 'IconAward',
    generatedType: 'STORED',
    asExpression: getTsVectorColumnExpressionFromFields(
      SEARCH_FIELDS_FOR_EMPLOYEE_AWARD,
    ),
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  @WorkspaceFieldIndex({ indexType: IndexType.GIN })
  searchVector: string;
}

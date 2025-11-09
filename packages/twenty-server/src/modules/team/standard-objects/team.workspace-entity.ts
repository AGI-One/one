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
import { WorkspaceRelation } from 'src/engine/twenty-orm/decorators/workspace-relation.decorator';
import {
  type FieldTypeAndNameMetadata,
  getTsVectorColumnExpressionFromFields,
} from 'src/engine/workspace-manager/workspace-sync-metadata/utils/get-ts-vector-column-expression.util';
import { EmployeeWorkspaceEntity } from 'src/modules/employee/standard-objects/employee.workspace-entity';

const NAME_FIELD_NAME = 'name';

export const SEARCH_FIELDS_FOR_TEAM: FieldTypeAndNameMetadata[] = [
  { name: NAME_FIELD_NAME, type: FieldMetadataType.TEXT },
];

@WorkspaceEntity({
  standardId: '50cf852c-59ae-4681-9baf-e81395fee42c',
  namePlural: 'teams',
  labelSingular: msg`Team`,
  labelPlural: msg`Teams`,
  description: msg`An organizational team`,
  icon: 'IconUsers',
  shortcut: 'T',
  labelIdentifierStandardId: '32c939bb-f238-4aae-adca-665599f1ad05',
})
@WorkspaceIsSearchable()
export class TeamWorkspaceEntity extends BaseWorkspaceEntity {
  @WorkspaceField({
    standardId: '32c939bb-f238-4aae-adca-665599f1ad05',
    type: FieldMetadataType.TEXT,
    label: msg`Name`,
    description: msg`Team name`,
    icon: 'IconUsers',
  })
  name: string;

  @WorkspaceField({
    standardId: '5dea6fa8-5de5-4b87-a487-eafa4a7f492e',
    type: FieldMetadataType.TEXT,
    label: msg`Color`,
    description: msg`Team color for visual identification`,
    icon: 'IconPalette',
  })
  @WorkspaceIsNullable()
  color: string | null;

  @WorkspaceField({
    standardId: '0d78cdd5-9056-41fe-99e3-27e0f5fccc11',
    type: FieldMetadataType.TEXT,
    label: msg`Emoji`,
    description: msg`Team emoji icon`,
    icon: 'IconMoodSmile',
  })
  @WorkspaceIsNullable()
  emoji: string | null;

  @WorkspaceField({
    standardId: 'a8925405-ac20-49f8-b1ce-7ab95f9f79ad',
    type: FieldMetadataType.TEXT,
    label: msg`Team Size`,
    description: msg`Expected team size`,
    icon: 'IconUsers',
  })
  @WorkspaceIsNullable()
  teamSize: string | null;

  @WorkspaceField({
    standardId: '1001d5db-0fdd-46f5-9fd0-fdacf5220331',
    type: FieldMetadataType.TEXT,
    label: msg`Logo`,
    description: msg`Team logo URL`,
    icon: 'IconPhoto',
  })
  @WorkspaceIsNullable()
  logo: string | null;

  @WorkspaceField({
    standardId: '70ca6c41-a5f7-4fb9-bb21-b44fa70e44f3',
    type: FieldMetadataType.TEXT,
    label: msg`Prefix`,
    description: msg`Team prefix for identifiers`,
    icon: 'IconHash',
  })
  @WorkspaceIsNullable()
  prefix: string | null;

  @WorkspaceField({
    standardId: 'bb0f2d99-e140-4831-9fd8-791825853d56',
    type: FieldMetadataType.BOOLEAN,
    label: msg`Share Profile View`,
    description: msg`Whether team members can view each other's profiles`,
    icon: 'IconEye',
    defaultValue: true,
  })
  shareProfileView: boolean;

  @WorkspaceField({
    standardId: '27a575a4-1b9f-449e-94e3-4e0a7f03c886',
    type: FieldMetadataType.BOOLEAN,
    label: msg`Require Plan To Track`,
    description: msg`Whether team requires a daily plan for time tracking`,
    icon: 'IconClipboardList',
    defaultValue: false,
  })
  requirePlanToTrack: boolean;

  @WorkspaceField({
    standardId: '63be4164-afcb-48af-aee0-0d4b9fd9abe9',
    type: FieldMetadataType.BOOLEAN,
    label: msg`Public`,
    description: msg`Whether the team is public or private`,
    icon: 'IconWorld',
    defaultValue: false,
  })
  public: boolean;

  @WorkspaceField({
    standardId: 'a16d54df-89ed-4f24-a5c2-328f7c4fc56c',
    type: FieldMetadataType.TEXT,
    label: msg`Profile Link`,
    description: msg`Team profile link`,
    icon: 'IconLink',
  })
  @WorkspaceIsNullable()
  profileLink: string | null;

  @WorkspaceField({
    standardId: '67ee4fa0-52f6-44c1-89a1-09a2c41e9121',
    type: FieldMetadataType.POSITION,
    label: msg`Position`,
    description: msg`Team record position`,
    icon: 'IconHierarchy2',
    defaultValue: 0,
  })
  @WorkspaceIsSystem()
  position: number;

  @WorkspaceField({
    standardId: '721686f8-e3b0-49fb-85a3-70cdf5a57f31',
    type: FieldMetadataType.ACTOR,
    label: msg`Created by`,
    icon: 'IconCreativeCommonsSa',
    description: msg`The creator of the record`,
  })
  @WorkspaceIsFieldUIReadOnly()
  createdBy: ActorMetadata;

  // Relations
  @WorkspaceRelation({
    standardId: '6f06dbe8-4116-4afb-a5bf-ecfc02f02361',
    type: RelationType.ONE_TO_MANY,
    label: msg`Members`,
    description: msg`Team members`,
    icon: 'IconUsers',
    inverseSideTarget: () => EmployeeWorkspaceEntity,
    inverseSideFieldKey: 'team',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  members: Relation<EmployeeWorkspaceEntity[]>;

  @WorkspaceField({
    standardId: '50c3e537-d617-4e8d-9a13-eed2fd9d1890',
    type: FieldMetadataType.TS_VECTOR,
    label: SEARCH_VECTOR_FIELD.label,
    description: SEARCH_VECTOR_FIELD.description,
    icon: 'IconUsers',
    generatedType: 'STORED',
    asExpression: getTsVectorColumnExpressionFromFields(SEARCH_FIELDS_FOR_TEAM),
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  @WorkspaceFieldIndex({ indexType: IndexType.GIN })
  searchVector: string;
}

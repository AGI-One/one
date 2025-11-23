import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class AddSharePointObjectListMapping1732280000000
  implements MigrationInterface
{
  name = 'AddSharePointObjectListMapping1732280000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "core"."sharepoint_object_list_mapping" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "workspaceId" uuid NOT NULL,
        "objectName" character varying NOT NULL,
        "listId" character varying NOT NULL,
        "listTitle" character varying NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_sharepoint_mapping_workspace_object" UNIQUE ("workspaceId", "objectName"),
        CONSTRAINT "PK_sharepoint_object_list_mapping" PRIMARY KEY ("id")
      )`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_sharepoint_mapping_workspace" ON "core"."sharepoint_object_list_mapping" ("workspaceId")`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_sharepoint_mapping_object" ON "core"."sharepoint_object_list_mapping" ("objectName")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "core"."IDX_sharepoint_mapping_object"`,
    );
    await queryRunner.query(
      `DROP INDEX "core"."IDX_sharepoint_mapping_workspace"`,
    );
    await queryRunner.query(
      `DROP TABLE "core"."sharepoint_object_list_mapping"`,
    );
  }
}

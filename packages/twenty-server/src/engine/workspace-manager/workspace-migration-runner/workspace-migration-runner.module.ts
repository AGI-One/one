import { Module } from '@nestjs/common';

import { SharePointModule } from 'src/engine/core-modules/sharepoint/sharepoint.module';
import { DataSourceModule } from 'src/engine/metadata-modules/data-source/data-source.module';
import { WorkspaceMigrationModule } from 'src/engine/metadata-modules/workspace-migration/workspace-migration.module';
import { WorkspaceDataSourceModule } from 'src/engine/workspace-datasource/workspace-datasource.module';
import { WorkspaceMigrationColumnService } from 'src/engine/workspace-manager/workspace-migration-runner/services/workspace-migration-column.service';
import { WorkspaceMigrationEnumService } from 'src/engine/workspace-manager/workspace-migration-runner/services/workspace-migration-enum.service';
import { WorkspaceMigrationSharePointService } from 'src/engine/workspace-manager/workspace-migration-runner/services/workspace-migration-sharepoint.service';
import { WorkspaceMigrationTypeService } from 'src/engine/workspace-manager/workspace-migration-runner/services/workspace-migration-type.service';

import { WorkspaceMigrationRunnerService } from './workspace-migration-runner.service';

@Module({
  imports: [
    WorkspaceDataSourceModule,
    WorkspaceMigrationModule,
    DataSourceModule,
    SharePointModule,
  ],
  providers: [
    WorkspaceMigrationRunnerService,
    WorkspaceMigrationEnumService,
    WorkspaceMigrationTypeService,
    WorkspaceMigrationColumnService,
    WorkspaceMigrationSharePointService,
  ],
  exports: [WorkspaceMigrationRunnerService],
})
export class WorkspaceMigrationRunnerModule {}

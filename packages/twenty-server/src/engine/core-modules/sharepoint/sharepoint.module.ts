import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { SharePointSchemaService } from 'src/engine/core-modules/sharepoint/sharepoint-schema.service';
import { SharePointWorkspaceInitService } from 'src/engine/core-modules/sharepoint/sharepoint-workspace-init.service';
import sharePointConfig from 'src/engine/core-modules/sharepoint/sharepoint.config';
import { SharePointService } from 'src/engine/core-modules/sharepoint/sharepoint.service';

@Module({
  imports: [ConfigModule.forFeature(sharePointConfig)],
  providers: [
    SharePointService,
    SharePointSchemaService,
    SharePointWorkspaceInitService,
  ],
  exports: [
    SharePointService,
    SharePointSchemaService,
    SharePointWorkspaceInitService,
  ],
})
export class SharePointModule {}

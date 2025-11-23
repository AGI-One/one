import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharePointObjectListMappingEntity } from 'src/engine/core-modules/sharepoint/sharepoint-object-list-mapping.entity';
import { SharePointObjectListMappingService } from 'src/engine/core-modules/sharepoint/sharepoint-object-list-mapping.service';
import { SharePointSchemaService } from 'src/engine/core-modules/sharepoint/sharepoint-schema.service';
import { SharePointWorkspaceInitService } from 'src/engine/core-modules/sharepoint/sharepoint-workspace-init.service';
import sharePointConfig from 'src/engine/core-modules/sharepoint/sharepoint.config';
import { SharePointService } from 'src/engine/core-modules/sharepoint/sharepoint.service';

@Module({
  imports: [
    ConfigModule.forFeature(sharePointConfig),
    TypeOrmModule.forFeature([SharePointObjectListMappingEntity]),
  ],
  providers: [
    SharePointService,
    SharePointSchemaService,
    SharePointWorkspaceInitService,
    SharePointObjectListMappingService,
  ],
  exports: [
    SharePointService,
    SharePointSchemaService,
    SharePointWorkspaceInitService,
    SharePointObjectListMappingService,
  ],
})
export class SharePointModule {}

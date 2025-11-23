import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
} from 'typeorm';

/**
 * Entity to store mapping between Twenty.one objects and SharePoint Lists
 * Maps object metadata name to SharePoint list ID for runtime resolution
 */
@Entity('sharepoint_object_list_mapping')
@Unique(['workspaceId', 'objectName'])
export class SharePointObjectListMappingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  workspaceId: string;

  @Column({ type: 'varchar' })
  objectName: string; // objectMetadata.nameSingular

  @Column({ type: 'varchar' })
  listId: string; // SharePoint List GUID

  @Column({ type: 'varchar' })
  listTitle: string; // SharePoint List display name

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

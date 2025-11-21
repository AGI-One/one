import { Injectable, Logger } from '@nestjs/common';

import { Readable } from 'stream';

import { type StorageDriver } from 'src/engine/core-modules/file-storage/drivers/interfaces/storage-driver.interface';
import {
  FileStorageException,
  FileStorageExceptionCode,
} from 'src/engine/core-modules/file-storage/interfaces/file-storage-exception';

import { type Sources } from 'src/engine/core-modules/file-storage/types/source.type';
import { SharePointService } from 'src/engine/core-modules/sharepoint/sharepoint.service';

interface SharePointError {
  response?: {
    status: number;
  };
}

export interface SharePointDriverOptions {
  tenantId: string;
  siteId: string;
  sharePointService: SharePointService;
}

/**
 * SharePoint Storage Driver for Twenty.one
 * Uses SharePoint Document Libraries as file storage backend
 *
 * File structure mapping:
 * - Each workspace gets its own Document Library
 * - folderPath → SharePoint folders
 * - filename → SharePoint files
 *
 * Example:
 * folderPath: "workspace-123/attachments"
 * filename: "document.pdf"
 * → SharePoint: /sites/{siteId}/drive/root:/workspace-123/attachments/document.pdf
 */
@Injectable()
export class SharePointDriver implements StorageDriver {
  private readonly logger = new Logger(SharePointDriver.name);
  private readonly tenantId: string;
  private readonly siteId: string;
  private readonly sharePointService: SharePointService;
  private driveId: string | null = null;

  constructor(options: SharePointDriverOptions) {
    this.tenantId = options.tenantId;
    this.siteId = options.siteId;
    this.sharePointService = options.sharePointService;
  }

  /**
   * Get or create the default Document Library drive for file storage
   */
  private async getDriveId(token: string): Promise<string> {
    if (this.driveId) {
      return this.driveId;
    }

    try {
      // Get default drive for the site
      this.driveId = await this.sharePointService.getDefaultDrive(
        this.siteId,
        token,
      );

      return this.driveId;
    } catch (error) {
      this.logger.error('Failed to get SharePoint drive', { error });
      throw new FileStorageException(
        'Could not access SharePoint document library',
        FileStorageExceptionCode.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Get authentication token
   */
  private async getToken(): Promise<string> {
    try {
      return await this.sharePointService.getAppOnlyToken(this.tenantId);
    } catch (error) {
      this.logger.error('Failed to get SharePoint token', { error });
      throw new FileStorageException(
        'SharePoint authentication failed',
        FileStorageExceptionCode.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Build SharePoint item path
   */
  private buildItemPath(folderPath: string, filename?: string): string {
    const parts = [folderPath];

    if (filename) {
      parts.push(filename);
    }

    return parts.join('/');
  }

  /**
   * Write a file to SharePoint Document Library
   */
  async write(params: {
    file: Buffer | Uint8Array | string;
    name: string;
    folder: string;
    mimeType: string | undefined;
  }): Promise<void> {
    const token = await this.getToken();
    const driveId = await this.getDriveId(token);
    const itemPath = this.buildItemPath(params.folder, params.name);

    try {
      // Convert file to Buffer if it's a string
      const fileBuffer =
        typeof params.file === 'string'
          ? Buffer.from(params.file)
          : params.file;

      await this.sharePointService.uploadFile(
        this.siteId,
        driveId,
        itemPath,
        fileBuffer,
        params.mimeType,
        token,
      );

      this.logger.debug(`File written to SharePoint: ${itemPath}`);
    } catch (error) {
      this.logger.error(`Failed to write file to SharePoint: ${itemPath}`, {
        error,
      });
      throw new FileStorageException(
        `Failed to write file: ${params.name}`,
        FileStorageExceptionCode.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Write multiple files organized in folders
   */
  async writeFolder(sources: Sources, folderPath: string): Promise<void> {
    for (const key of Object.keys(sources)) {
      const value = sources[key];

      if (typeof value === 'object' && !Buffer.isBuffer(value)) {
        // Recursive folder
        await this.writeFolder(value as Sources, `${folderPath}/${key}`);
      } else {
        // File
        await this.write({
          file: value,
          name: key,
          folder: folderPath,
          mimeType: undefined,
        });
      }
    }
  }

  /**
   * Read a file from SharePoint Document Library
   */
  async read(params: {
    folderPath: string;
    filename: string;
  }): Promise<Readable> {
    const token = await this.getToken();
    const driveId = await this.getDriveId(token);
    const itemPath = this.buildItemPath(params.folderPath, params.filename);

    try {
      const stream = await this.sharePointService.downloadFile(
        this.siteId,
        driveId,
        itemPath,
        token,
      );

      this.logger.debug(`File read from SharePoint: ${itemPath}`);

      return stream;
    } catch (error) {
      if ((error as SharePointError).response?.status === 404) {
        throw new FileStorageException(
          `File not found: ${params.filename}`,
          FileStorageExceptionCode.FILE_NOT_FOUND,
        );
      }

      this.logger.error(`Failed to read file from SharePoint: ${itemPath}`, {
        error,
      });
      throw new FileStorageException(
        `Failed to read file: ${params.filename}`,
        FileStorageExceptionCode.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Read all files in a folder
   */
  async readFolder(folderPath: string): Promise<Sources> {
    const token = await this.getToken();
    const driveId = await this.getDriveId(token);

    try {
      const items = await this.sharePointService.listDriveItems(
        this.siteId,
        driveId,
        folderPath,
        token,
      );

      const sources: Sources = {};

      for (const item of items) {
        if (item.folder) {
          // Recursive folder
          sources[item.name] = await this.readFolder(
            `${folderPath}/${item.name}`,
          );
        } else {
          // File - read content
          const stream = await this.read({
            folderPath,
            filename: item.name,
          });

          // Convert stream to buffer
          const chunks: Buffer[] = [];

          for await (const chunk of stream) {
            chunks.push(Buffer.from(chunk));
          }

          sources[item.name] = Buffer.concat(chunks).toString('base64');
        }
      }

      return sources;
    } catch (error) {
      this.logger.error(
        `Failed to read folder from SharePoint: ${folderPath}`,
        {
          error,
        },
      );
      throw new FileStorageException(
        `Failed to read folder: ${folderPath}`,
        FileStorageExceptionCode.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Delete a file or folder from SharePoint
   */
  async delete(params: {
    folderPath: string;
    filename?: string;
  }): Promise<void> {
    const token = await this.getToken();
    const driveId = await this.getDriveId(token);
    const itemPath = this.buildItemPath(params.folderPath, params.filename);

    try {
      await this.sharePointService.deleteFile(
        this.siteId,
        driveId,
        itemPath,
        token,
      );

      this.logger.debug(`File/folder deleted from SharePoint: ${itemPath}`);
    } catch (error) {
      if ((error as SharePointError).response?.status === 404) {
        throw new FileStorageException(
          `File not found: ${params.filename || params.folderPath}`,
          FileStorageExceptionCode.FILE_NOT_FOUND,
        );
      }

      this.logger.error(
        `Failed to delete file/folder from SharePoint: ${itemPath}`,
        { error },
      );
      throw new FileStorageException(
        `Failed to delete: ${params.filename || params.folderPath}`,
        FileStorageExceptionCode.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Move a file or folder within SharePoint
   */
  async move(params: {
    from: { folderPath: string; filename?: string };
    to: { folderPath: string; filename?: string };
  }): Promise<void> {
    const token = await this.getToken();
    const driveId = await this.getDriveId(token);
    const fromPath = this.buildItemPath(
      params.from.folderPath,
      params.from.filename,
    );
    const toPath = this.buildItemPath(params.to.folderPath, params.to.filename);

    try {
      await this.sharePointService.moveFile(
        this.siteId,
        driveId,
        fromPath,
        toPath,
        token,
      );

      this.logger.debug(
        `File/folder moved in SharePoint: ${fromPath} → ${toPath}`,
      );
    } catch (error) {
      if ((error as SharePointError).response?.status === 404) {
        throw new FileStorageException(
          `Source file not found: ${params.from.filename || params.from.folderPath}`,
          FileStorageExceptionCode.FILE_NOT_FOUND,
        );
      }

      this.logger.error(
        `Failed to move file/folder in SharePoint: ${fromPath} → ${toPath}`,
        { error },
      );
      throw new FileStorageException(
        `Failed to move: ${params.from.filename || params.from.folderPath}`,
        FileStorageExceptionCode.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Copy a file or folder within SharePoint
   */
  async copy(params: {
    from: { folderPath: string; filename?: string };
    to: { folderPath: string; filename?: string };
  }): Promise<void> {
    const token = await this.getToken();
    const driveId = await this.getDriveId(token);
    const fromPath = this.buildItemPath(
      params.from.folderPath,
      params.from.filename,
    );
    const toPath = this.buildItemPath(params.to.folderPath, params.to.filename);

    try {
      await this.sharePointService.copyFile(
        this.siteId,
        driveId,
        fromPath,
        toPath,
        token,
      );

      this.logger.debug(
        `File/folder copied in SharePoint: ${fromPath} → ${toPath}`,
      );
    } catch (error) {
      if ((error as SharePointError).response?.status === 404) {
        throw new FileStorageException(
          `Source file not found: ${params.from.filename || params.from.folderPath}`,
          FileStorageExceptionCode.FILE_NOT_FOUND,
        );
      }

      this.logger.error(
        `Failed to copy file/folder in SharePoint: ${fromPath} → ${toPath}`,
        { error },
      );
      throw new FileStorageException(
        `Failed to copy: ${params.from.filename || params.from.folderPath}`,
        FileStorageExceptionCode.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Download a file from SharePoint to local filesystem
   * (For compatibility with StorageDriver interface)
   */
  async download(params: {
    from: { folderPath: string; filename?: string };
    to: { folderPath: string; filename?: string };
  }): Promise<void> {
    // For SharePoint, download is just a copy operation
    await this.copy(params);
  }

  /**
   * Check if a file exists in SharePoint
   */
  async checkFileExists(params: {
    folderPath: string;
    filename: string;
  }): Promise<boolean> {
    const token = await this.getToken();
    const driveId = await this.getDriveId(token);
    const itemPath = this.buildItemPath(params.folderPath, params.filename);

    try {
      await this.sharePointService.getFileMetadata(
        this.siteId,
        driveId,
        itemPath,
        token,
      );

      return true;
    } catch (error) {
      if ((error as SharePointError).response?.status === 404) {
        return false;
      }

      this.logger.error(
        `Failed to check file existence in SharePoint: ${itemPath}`,
        { error },
      );
      throw new FileStorageException(
        `Failed to check file existence: ${params.filename}`,
        FileStorageExceptionCode.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Check if a folder exists in SharePoint
   */
  async checkFolderExists(folderPath: string): Promise<boolean> {
    const token = await this.getToken();
    const driveId = await this.getDriveId(token);

    try {
      await this.sharePointService.getFileMetadata(
        this.siteId,
        driveId,
        folderPath,
        token,
      );

      return true;
    } catch (error) {
      if ((error as SharePointError).response?.status === 404) {
        return false;
      }

      this.logger.error(
        `Failed to check folder existence in SharePoint: ${folderPath}`,
        { error },
      );
      throw new FileStorageException(
        `Failed to check folder existence: ${folderPath}`,
        FileStorageExceptionCode.INTERNAL_ERROR,
      );
    }
  }
}

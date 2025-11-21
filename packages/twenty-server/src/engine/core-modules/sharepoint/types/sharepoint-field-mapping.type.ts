import { FieldMetadataType } from 'twenty-shared/types';

/**
 * SharePoint field type mapping
 * Maps Twenty.one field types to SharePoint column types
 */
export const SHAREPOINT_FIELD_TYPE_MAP: Record<FieldMetadataType, string> = {
  // Text types
  [FieldMetadataType.TEXT]: 'Text',
  [FieldMetadataType.PHONES]: 'Note', // JSON as multi-line text
  [FieldMetadataType.EMAILS]: 'Note', // JSON as multi-line text
  [FieldMetadataType.FULL_NAME]: 'Text',
  [FieldMetadataType.ADDRESS]: 'Text',
  [FieldMetadataType.RICH_TEXT]: 'Note', // Multi-line text
  [FieldMetadataType.RICH_TEXT_V2]: 'Note', // Multi-line text v2

  // Number types
  [FieldMetadataType.NUMBER]: 'Number',
  [FieldMetadataType.NUMERIC]: 'Number',
  [FieldMetadataType.CURRENCY]: 'Currency',
  [FieldMetadataType.RATING]: 'Number',
  [FieldMetadataType.POSITION]: 'Number',

  // Boolean
  [FieldMetadataType.BOOLEAN]: 'Boolean',

  // Date/Time
  [FieldMetadataType.DATE_TIME]: 'DateTime',
  [FieldMetadataType.DATE]: 'DateTime',

  // Select/Lookup
  [FieldMetadataType.SELECT]: 'Choice',
  [FieldMetadataType.MULTI_SELECT]: 'MultiChoice',
  [FieldMetadataType.RELATION]: 'Lookup',
  [FieldMetadataType.MORPH_RELATION]: 'Lookup', // Polymorphic relation

  // Special types
  [FieldMetadataType.UUID]: 'Text',
  [FieldMetadataType.LINKS]: 'Note', // JSON as multi-line text
  [FieldMetadataType.RAW_JSON]: 'Note', // JSON as multi-line text
  [FieldMetadataType.ACTOR]: 'Note', // JSON as multi-line text
  [FieldMetadataType.ARRAY]: 'Note', // JSON as multi-line text
  [FieldMetadataType.TS_VECTOR]: 'Note', // Not supported, store as text
};

/**
 * SharePoint column definition for list creation
 */
export interface SharePointColumnSchema {
  name: string;
  displayName: string;
  type: string;
  required?: boolean;
  indexed?: boolean;
  defaultValue?: unknown;
  description?: string;
  choices?: string[]; // For Choice/MultiChoice types
  lookupListId?: string; // For Lookup types
  lookupField?: string; // For Lookup types
}

/**
 * SharePoint list schema definition
 */
export interface SharePointListSchema {
  displayName: string;
  description?: string;
  template: string; // e.g., 'genericList', 'documentLibrary'
  columns: SharePointColumnSchema[];
}

/**
 * Field type conversion result
 */
export interface FieldTypeConversionResult {
  sharePointType: string;
  requiresSpecialHandling: boolean;
  additionalConfig?: {
    choices?: string[];
    lookupListId?: string;
    lookupField?: string;
  };
}

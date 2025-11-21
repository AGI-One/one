export interface SharePointList {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  createdDateTime?: string;
  lastModifiedDateTime?: string;
  list?: {
    template: string;
    hidden: boolean;
  };
}

export interface SharePointListItem {
  id: string;
  fields: Record<string, unknown>;
  createdDateTime?: string;
  lastModifiedDateTime?: string;
}

export interface SharePointListCreationRequest {
  displayName: string;
  description?: string;
  template?: string;
  columns?: SharePointColumnDefinition[];
}

export interface SharePointColumnDefinition {
  name: string;
  displayName?: string;
  type: SharePointColumnType;
  required?: boolean;
  indexed?: boolean;
  lookupListId?: string;
  lookupColumnName?: string;
  choices?: string[];
  allowMultipleValues?: boolean;
}

export enum SharePointColumnType {
  TEXT = 'text',
  NOTE = 'note', // Multi-line text
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  DATETIME = 'dateTime',
  CHOICE = 'choice',
  LOOKUP = 'lookup',
  PERSON = 'personOrGroup',
  URL = 'url',
  CURRENCY = 'currency',
}

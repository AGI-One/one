export interface SharePointQueryOptions {
  filter?: string; // OData $filter
  select?: string[]; // OData $select
  expand?: string[]; // OData $expand
  orderby?: string; // OData $orderby
  top?: number; // OData $top
  skip?: number; // OData $skip
}

export interface SharePointBatchRequest {
  id: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  url: string;
  headers?: Record<string, string>;
  body?: any;
}

export interface SharePointBatchResponse {
  id: string;
  status: number;
  headers?: Record<string, string>;
  body?: any;
}

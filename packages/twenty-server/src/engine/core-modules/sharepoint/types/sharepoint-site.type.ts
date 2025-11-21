export interface SharePointSite {
  id: string;
  webUrl: string;
  displayName: string;
  name: string;
  createdDateTime?: string;
  lastModifiedDateTime?: string;
  siteCollection?: {
    hostname?: string;
  };
}

export interface SharePointSiteCreationRequest {
  displayName: string;
  name: string;
  description?: string;
}

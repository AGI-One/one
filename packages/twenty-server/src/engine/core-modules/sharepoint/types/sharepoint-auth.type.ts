export interface SharePointAuthToken {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  expiresAt: Date;
  scope?: string;
}

export interface SharePointTenantInfo {
  tenantId: string;
  tenantName?: string;
  tenantDomain?: string;
}

export interface SharePointAuthConfig {
  clientId: string;
  clientSecret: string;
  tenantId: string;
  scope?: string;
}

import { registerAs } from '@nestjs/config';

export interface SharePointConfig {
  clientId: string;
  clientSecret: string;
  defaultSiteTemplate: string;
  tokenCacheTTL: number;
  graphApiBaseUrl: string;
  loginBaseUrl: string;
  defaultScope: string;
}

export default registerAs('sharepoint', (): SharePointConfig => {
  return {
    clientId: process.env.AUTH_MICROSOFT_CLIENT_ID || '',
    clientSecret: process.env.AUTH_MICROSOFT_CLIENT_SECRET || '',
    defaultSiteTemplate:
      process.env.SHAREPOINT_DEFAULT_SITE_TEMPLATE || 'STS#3', // Team Site template
    tokenCacheTTL: parseInt(
      process.env.SHAREPOINT_TOKEN_CACHE_TTL || '3600',
      10,
    ),
    graphApiBaseUrl: 'https://graph.microsoft.com/v1.0',
    loginBaseUrl: 'https://login.microsoftonline.com',
    defaultScope: 'https://graph.microsoft.com/.default',
  };
});

import { ReactNode } from 'react'
import {
  AirtableIcon,
  ConfluenceIcon,
  GithubIcon,
  GmailIcon,
  GoogleCalendarIcon,
  GoogleDocsIcon,
  GoogleDriveIcon,
  GoogleIcon,
  GoogleSheetsIcon,
  SupabaseIcon,
  xIcon,
} from '@/components/icons'
import { createLogger } from '@/lib/logs/console-logger'

const logger = createLogger('OAuth')

// Define the base OAuth provider type
export type OAuthProvider =
  | 'google'
  | 'github'
  | 'x'
  | 'supabase'
  | 'confluence'
  | 'airtable'
  | string
export type OAuthService =
  | 'google'
  | 'google-email'
  | 'google-drive'
  | 'google-docs'
  | 'google-sheets'
  | 'github'
  | 'x'
  | 'supabase'
  | 'confluence'
  | 'airtable'

// Define the interface for OAuth provider configuration
export interface OAuthProviderConfig {
  id: OAuthProvider
  name: string
  icon: (props: { className?: string }) => ReactNode
  services: Record<string, OAuthServiceConfig>
  defaultService: string
}

// Define the interface for OAuth service configuration
export interface OAuthServiceConfig {
  id: string
  name: string
  description: string
  providerId: string
  icon: (props: { className?: string }) => ReactNode
  baseProviderIcon: (props: { className?: string }) => ReactNode
  scopes: string[]
}

// Define the available OAuth providers
export const OAUTH_PROVIDERS: Record<string, OAuthProviderConfig> = {
  google: {
    id: 'google',
    name: 'Google',
    icon: (props) => GoogleIcon(props),
    services: {
      gmail: {
        id: 'gmail',
        name: 'Gmail',
        description: 'Automate email workflows and enhance communication efficiency.',
        providerId: 'google-email',
        icon: (props) => GmailIcon(props),
        baseProviderIcon: (props) => GoogleIcon(props),
        scopes: [
          'https://www.googleapis.com/auth/gmail.send',
          // 'https://www.googleapis.com/auth/gmail.readonly',
          'https://www.googleapis.com/auth/gmail.labels',
        ],
      },
      'google-drive': {
        id: 'google-drive',
        name: 'Google Drive',
        description: 'Streamline file organization and document workflows.',
        providerId: 'google-drive',
        icon: (props) => GoogleDriveIcon(props),
        baseProviderIcon: (props) => GoogleIcon(props),
        scopes: ['https://www.googleapis.com/auth/drive.file'],
      },
      'google-docs': {
        id: 'google-docs',
        name: 'Google Docs',
        description: 'Create, read, and edit Google Documents programmatically.',
        providerId: 'google-docs',
        icon: (props) => GoogleDocsIcon(props),
        baseProviderIcon: (props) => GoogleIcon(props),
        scopes: ['https://www.googleapis.com/auth/drive.file'],
      },
      'google-sheets': {
        id: 'google-sheets',
        name: 'Google Sheets',
        description: 'Manage and analyze data with Google Sheets integration.',
        providerId: 'google-sheets',
        icon: (props) => GoogleSheetsIcon(props),
        baseProviderIcon: (props) => GoogleIcon(props),
        scopes: [
          'https://www.googleapis.com/auth/spreadsheets',
          'https://www.googleapis.com/auth/drive.file',
        ],
      },
      'google-calendar': {
        id: 'google-calendar',
        name: 'Google Calendar',
        description: 'Schedule and manage events with Google Calendar.',
        providerId: 'google-calendar',
        icon: (props) => GoogleCalendarIcon(props),
        baseProviderIcon: (props) => GoogleIcon(props),
        scopes: ['https://www.googleapis.com/auth/calendar'],
      },
    },
    defaultService: 'gmail',
  },
  github: {
    id: 'github',
    name: 'GitHub',
    icon: (props) => GithubIcon(props),
    services: {
      github: {
        id: 'github',
        name: 'GitHub',
        description: 'Manage repositories, issues, and pull requests.',
        providerId: 'github-repo',
        icon: (props) => GithubIcon(props),
        baseProviderIcon: (props) => GithubIcon(props),
        scopes: ['repo', 'user'],
      },
      'github-workflow': {
        id: 'github-workflow',
        name: 'GitHub Actions',
        description: 'Trigger and manage GitHub Actions workflows.',
        providerId: 'github-workflow',
        icon: (props) => GithubIcon(props),
        baseProviderIcon: (props) => GithubIcon(props),
        scopes: ['repo', 'workflow'],
      },
    },
    defaultService: 'github',
  },
  x: {
    id: 'x',
    name: 'X',
    icon: (props) => xIcon(props),
    services: {
      x: {
        id: 'x',
        name: 'X',
        description: 'Read and post tweets on X (formerly Twitter).',
        providerId: 'x',
        icon: (props) => xIcon(props),
        baseProviderIcon: (props) => xIcon(props),
        scopes: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'],
      },
    },
    defaultService: 'x',
  },
  supabase: {
    id: 'supabase',
    name: 'Supabase',
    icon: (props) => SupabaseIcon(props),
    services: {
      supabase: {
        id: 'supabase',
        name: 'Supabase',
        description: 'Connect to your Supabase projects and manage data.',
        providerId: 'supabase',
        icon: (props) => SupabaseIcon(props),
        baseProviderIcon: (props) => SupabaseIcon(props),
        scopes: ['database.read', 'database.write', 'projects.read'],
      },
    },
    defaultService: 'supabase',
  },
  confluence: {
    id: 'confluence',
    name: 'Confluence',
    icon: (props) => ConfluenceIcon(props),
    services: {
      confluence: {
        id: 'confluence',
        name: 'Confluence',
        description: 'Access Confluence content and documentation.',
        providerId: 'confluence',
        icon: (props) => ConfluenceIcon(props),
        baseProviderIcon: (props) => ConfluenceIcon(props),
        scopes: [
          'read:page:confluence',
          'read:confluence-content.all',
          'read:me',
          'offline_access',
          'write:confluence-content',
        ],
      },
    },
    defaultService: 'confluence',
  },
  airtable: {
    id: 'airtable',
    name: 'Airtable',
    icon: (props) => AirtableIcon(props),
    services: {
      airtable: {
        id: 'airtable',
        name: 'Airtable',
        description: 'Manage Airtable bases, tables, and records.',
        providerId: 'airtable',
        icon: (props) => AirtableIcon(props),
        baseProviderIcon: (props) => AirtableIcon(props),
        scopes: ['data.records:read', 'data.records:write'],
      },
    },
    defaultService: 'airtable',
  },
}

// Helper function to get a service by provider and service ID
export function getServiceByProviderAndId(
  provider: OAuthProvider,
  serviceId?: string
): OAuthServiceConfig {
  const providerConfig = OAUTH_PROVIDERS[provider]
  if (!providerConfig) {
    throw new Error(`Provider ${provider} not found`)
  }

  if (!serviceId) {
    return providerConfig.services[providerConfig.defaultService]
  }

  return (
    providerConfig.services[serviceId] || providerConfig.services[providerConfig.defaultService]
  )
}

// Helper function to determine service ID from scopes
export function getServiceIdFromScopes(provider: OAuthProvider, scopes: string[]): string {
  const providerConfig = OAUTH_PROVIDERS[provider]
  if (!providerConfig) {
    return provider
  }

  if (provider === 'google') {
    if (scopes.some((scope) => scope.includes('gmail') || scope.includes('mail'))) {
      return 'gmail'
    } else if (scopes.some((scope) => scope.includes('drive'))) {
      return 'google-drive'
    } else if (scopes.some((scope) => scope.includes('docs'))) {
      return 'google-docs'
    } else if (scopes.some((scope) => scope.includes('sheets'))) {
      return 'google-sheets'
    } else if (scopes.some((scope) => scope.includes('calendar'))) {
      return 'google-calendar'
    }
  } else if (provider === 'github') {
    if (scopes.some((scope) => scope.includes('workflow'))) {
      return 'github-workflow'
    }
  } else if (provider === 'supabase') {
    return 'supabase'
  } else if (provider === 'x') {
    return 'x'
  } else if (provider === 'confluence') {
    return 'confluence'
  } else if (provider === 'airtable') {
    return 'airtable'
  }

  return providerConfig.defaultService
}

// Helper function to get provider ID from service ID
export function getProviderIdFromServiceId(serviceId: string): string {
  for (const provider of Object.values(OAUTH_PROVIDERS)) {
    for (const [id, service] of Object.entries(provider.services)) {
      if (id === serviceId) {
        return service.providerId
      }
    }
  }

  // Default fallback
  return serviceId
}

// Interface for credential objects
export interface Credential {
  id: string
  name: string
  provider: OAuthProvider
  serviceId?: string
  lastUsed?: string
  isDefault?: boolean
}

// Interface for provider configuration
export interface ProviderConfig {
  baseProvider: string
  featureType: string
}

/**
 * Parse a provider string into its base provider and feature type
 * This is a server-safe utility that can be used in both client and server code
 */
export function parseProvider(provider: OAuthProvider): ProviderConfig {
  // Handle compound providers (e.g., 'google-email' -> { baseProvider: 'google', featureType: 'email' })
  const [base, feature] = provider.split('-')

  if (feature) {
    return {
      baseProvider: base,
      featureType: feature,
    }
  }

  // For simple providers, use 'default' as feature type
  return {
    baseProvider: provider,
    featureType: 'default',
  }
}

/**
 * Refresh an OAuth token
 * This is a server-side utility function to refresh OAuth tokens
 * @param providerId The provider ID (e.g., 'google-drive')
 * @param refreshToken The refresh token to use
 * @returns Object containing the new access token and expiration time in seconds, or null if refresh failed
 */
export async function refreshOAuthToken(
  providerId: string,
  refreshToken: string
): Promise<{ accessToken: string; expiresIn: number; refreshToken: string } | null> {
  try {
    // Get the provider from the providerId (e.g., 'google-drive' -> 'google')
    const provider = providerId.split('-')[0]

    // Determine the token endpoint based on the provider
    let tokenEndpoint: string
    let clientId: string | undefined
    let clientSecret: string | undefined
    let useBasicAuth = false

    switch (provider) {
      case 'google':
        tokenEndpoint = 'https://oauth2.googleapis.com/token'
        clientId = process.env.GOOGLE_CLIENT_ID
        clientSecret = process.env.GOOGLE_CLIENT_SECRET
        break
      case 'github':
        tokenEndpoint = 'https://github.com/login/oauth/access_token'
        clientId = process.env.GITHUB_CLIENT_ID
        clientSecret = process.env.GITHUB_CLIENT_SECRET
        break
      case 'x':
        tokenEndpoint = 'https://api.x.com/2/oauth2/token'
        clientId = process.env.X_CLIENT_ID
        clientSecret = process.env.X_CLIENT_SECRET
        break
      case 'confluence':
        tokenEndpoint = 'https://auth.atlassian.com/oauth/token'
        clientId = process.env.CONFLUENCE_CLIENT_ID
        clientSecret = process.env.CONFLUENCE_CLIENT_SECRET
        break
      case 'airtable':
        tokenEndpoint = 'https://airtable.com/oauth2/v1/token'
        clientId = process.env.AIRTABLE_CLIENT_ID
        clientSecret = process.env.AIRTABLE_CLIENT_SECRET
        useBasicAuth = true
        break
      case 'supabase':
        tokenEndpoint = 'https://api.supabase.com/v1/oauth/token'
        clientId = process.env.SUPABASE_CLIENT_ID
        clientSecret = process.env.SUPABASE_CLIENT_SECRET
        break
      default:
        throw new Error(`Unsupported provider: ${provider}`)
    }

    if (!clientId || !clientSecret) {
      throw new Error(`Missing client credentials for provider: ${provider}`)
    }

    // Prepare request headers and body
    const headers: Record<string, string> = {
      'Content-Type': 'application/x-www-form-urlencoded',
      ...(provider === 'github' && {
        Accept: 'application/json',
      }),
    }

    // Prepare request body
    const bodyParams: Record<string, string> = {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }

    // For Airtable, check if we have both client ID and secret
    if (provider === 'airtable') {
      // Airtable requires Basic Auth with client ID and secret in the Authorization header
      // Do not include client_id or client_secret in the body when using Basic Auth
      if (clientId && clientSecret) {
        const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
        headers['Authorization'] = `Basic ${basicAuth}`

        // Make sure to include refresh_token in body params but not client_id/client_secret
        // This ensures we're not sending credentials in both header and body
        delete bodyParams.client_id
        delete bodyParams.client_secret
      } else {
        throw new Error('Both client ID and client secret are required for Airtable OAuth')
      }
    } else {
      // For other providers, use the general approach
      if (useBasicAuth) {
        const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
        headers['Authorization'] = `Basic ${basicAuth}`
      }

      if (!useBasicAuth) {
        bodyParams.client_id = clientId
        bodyParams.client_secret = clientSecret
      }
    }

    // Refresh the token
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers,
      body: new URLSearchParams(bodyParams).toString(),
    })

    if (!response.ok) {
      const errorText = await response.text()
      logger.error('Token refresh failed:', {
        status: response.status,
        error: errorText,
        provider,
        headers: JSON.stringify(headers, null, 2).replace(
          /"Authorization":"[^"]*"/,
          '"Authorization":"[REDACTED]"'
        ),
        bodyParams: JSON.stringify(bodyParams),
      })
      throw new Error(`Failed to refresh token: ${response.status} ${errorText}`)
    }

    const data = await response.json()

    // Extract token and expiration (different providers may use different field names)
    const accessToken = data.access_token

    // For Airtable, also capture the new refresh token if provided
    // Airtable may rotate refresh tokens
    let newRefreshToken = null
    if (provider === 'airtable' && data.refresh_token) {
      newRefreshToken = data.refresh_token
      logger.info('Received new refresh token from Airtable')
    }

    // Get expiration time - use provider's value or default to 1 hour (3600 seconds)
    // Different providers use different names for this field
    const expiresIn = data.expires_in || data.expiresIn || 3600

    if (!accessToken) {
      logger.warn('No access token found in refresh response', data)
      return null
    }

    logger.info('Token refreshed successfully with expiration', {
      expiresIn,
      hasNewRefreshToken: !!newRefreshToken,
      provider,
    })

    return {
      accessToken,
      expiresIn,
      refreshToken: newRefreshToken || refreshToken, // Return new refresh token if available
    }
  } catch (error) {
    logger.error('Error refreshing token:', { error })
    return null
  }
}

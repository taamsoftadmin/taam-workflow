import { NextRequest, NextResponse } from 'next/server'
import { and, eq } from 'drizzle-orm'
import { getSession } from '@/lib/auth'
import { createLogger } from '@/lib/logs/console-logger'
import { db } from '@/db'
import { account } from '@/db/schema'
import { refreshAccessTokenIfNeeded } from '../../utils'

const logger = createLogger('GmailLabelsAPI')

export async function GET(request: NextRequest) {
  const requestId = crypto.randomUUID().slice(0, 8)

  try {
    // Get the session
    const session = await getSession()

    // Check if the user is authenticated
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthenticated labels request rejected`)
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const credentialId = searchParams.get('credentialId')
    const query = searchParams.get('query')

    if (!credentialId) {
      logger.warn(`[${requestId}] Missing credentialId parameter`)
      return NextResponse.json({ error: 'Credential ID is required' }, { status: 400 })
    }

    // Get the credential from the database
    const credentials = await db
      .select()
      .from(account)
      .where(and(eq(account.id, credentialId), eq(account.userId, session.user.id)))
      .limit(1)

    if (!credentials.length) {
      logger.warn(`[${requestId}] Credential not found`)
      return NextResponse.json({ error: 'Credential not found' }, { status: 404 })
    }

    const credential = credentials[0]

    // Log the credential info (without exposing sensitive data)
    logger.info(
      `[${requestId}] Using credential: ${credential.id}, provider: ${credential.providerId}`
    )

    // Refresh access token if needed using the utility function
    const accessToken = await refreshAccessTokenIfNeeded(credentialId, session.user.id, requestId)

    if (!accessToken) {
      return NextResponse.json({ error: 'Failed to obtain valid access token' }, { status: 401 })
    }

    // Fetch labels from Gmail API
    logger.info(`[${requestId}] Fetching labels from Gmail API`)
    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/labels', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    // Log the response status
    logger.info(`[${requestId}] Gmail API response status: ${response.status}`)

    if (!response.ok) {
      const errorText = await response.text()
      logger.error(`[${requestId}] Gmail API error response: ${errorText}`)

      try {
        const error = JSON.parse(errorText)
        return NextResponse.json({ error }, { status: response.status })
      } catch (e) {
        return NextResponse.json({ error: errorText }, { status: response.status })
      }
    }

    const data = await response.json()

    // Log the number of labels received
    logger.info(`[${requestId}] Received ${data.labels?.length || 0} labels from Gmail API`)

    // Transform the labels to a more usable format
    const labels = data.labels.map((label: any) => {
      // Format the label name with proper capitalization
      let formattedName = label.name

      // Handle system labels (INBOX, SENT, etc.)
      if (label.type === 'system') {
        // Convert to title case (first letter uppercase, rest lowercase)
        formattedName = label.name.charAt(0).toUpperCase() + label.name.slice(1).toLowerCase()
      }

      return {
        id: label.id,
        name: formattedName,
        type: label.type,
        messagesTotal: label.messagesTotal || 0,
        messagesUnread: label.messagesUnread || 0,
      }
    })

    // Filter labels if a query is provided
    const filteredLabels = query
      ? labels.filter((label: any) =>
          label.name.toLowerCase().includes((query as string).toLowerCase())
        )
      : labels

    return NextResponse.json({ labels: filteredLabels }, { status: 200 })
  } catch (error) {
    logger.error(`[${requestId}] Error fetching Gmail labels:`, error)
    return NextResponse.json({ error: 'Failed to fetch Gmail labels' }, { status: 500 })
  }
}

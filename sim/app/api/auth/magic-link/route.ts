import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth, getLastGeneratedMagicLink } from '@/lib/auth'
import { createLogger } from '@/lib/logs/console-logger'

const logger = createLogger('MagicLink')

const MAGIC_LINK_API_KEY = process.env.MAGIC_LINK_API_KEY

// Validate API key middleware
function validateApiKey(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false
  }
  const providedApiKey = authHeader.split(' ')[1]
  return providedApiKey === MAGIC_LINK_API_KEY
}

export async function POST(request: NextRequest) {
  try {
    // Check API key authorization
    if (!validateApiKey(request)) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Unauthorized - Invalid or missing API key' 
        }, 
        { status: 401 }
      )
    }

    const body = await request.json()
    const { email, callbackUrl } = body

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 })
    }

    // Convert headers to plain object
    const headersList = await headers()
    const headersObject = {
      'Content-Type': headersList.get('content-type') || 'application/json',
      Cookie: headersList.get('cookie') || '',
      Host: headersList.get('host') || '',
    }

    // Sign in with magic link
    await auth.api.signInMagicLink({
      body: {
        email,
        callbackURL: callbackUrl || '/w',
      },
      method: 'POST',
      headers: headersObject,
    })

    // Get the captured magic link
    const magicLink = getLastGeneratedMagicLink()

    return NextResponse.json({
      success: true,
      message: 'Magic link generated',
      magicLink
    })

  } catch (error) {
    logger.error('Error generating magic link:', { error })
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to generate magic link',
      },
      { status: 500 }
    )
  }
}

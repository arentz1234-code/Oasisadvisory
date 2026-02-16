import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

// Parse time string like "9:00 AM" to { hour, minute } in 24h format
function parseTime(timeStr: string): { hour: number; minute: number } {
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!match) {
    throw new Error(`Invalid time format: ${timeStr}`)
  }

  let hour = parseInt(match[1], 10)
  const minute = parseInt(match[2], 10)
  const period = match[3].toUpperCase()

  if (period === 'PM' && hour !== 12) {
    hour += 12
  } else if (period === 'AM' && hour === 12) {
    hour = 0
  }

  return { hour, minute }
}

// Create Google OAuth2 client
function createOAuthClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Missing Google OAuth credentials. Please set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REFRESH_TOKEN environment variables.')
  }

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    'https://developers.google.com/oauthplayground' // Redirect URI used for refresh token
  )

  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  })

  return oauth2Client
}

// POST - Add a booking to Google Calendar
export async function POST(request: NextRequest) {
  try {
    // Verify admin authorization
    const authHeader = request.headers.get('authorization')
    const adminPassword = process.env.ADMIN_PASSWORD || 'oasis2024'

    if (authHeader !== `Bearer ${adminPassword}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { booking } = body

    if (!booking || !booking.date || !booking.time || !booking.name || !booking.email) {
      return NextResponse.json(
        { error: 'Missing required booking details: date, time, name, email' },
        { status: 400 }
      )
    }

    // Parse the booking date and time
    const bookingDate = new Date(booking.date)
    const { hour, minute } = parseTime(booking.time)

    // Create start and end times (30-minute consultation)
    const startDateTime = new Date(bookingDate)
    startDateTime.setHours(hour, minute, 0, 0)

    const endDateTime = new Date(startDateTime)
    endDateTime.setMinutes(endDateTime.getMinutes() + 30)

    // Create OAuth client and calendar instance
    const auth = createOAuthClient()
    const calendar = google.calendar({ version: 'v3', auth })

    // Create the calendar event with Google Meet
    const event = {
      summary: `Oasis Advisory Consultation - ${booking.name}`,
      description: `Consultation with ${booking.name}${booking.businessName ? ` from ${booking.businessName}` : ''}\n\nContact:\nEmail: ${booking.email}\nPhone: ${booking.phone || 'Not provided'}\n\nBooked via Oasis Advisory website.`,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'America/New_York', // EST
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'America/New_York',
      },
      attendees: [
        { email: booking.email, displayName: booking.name },
      ],
      conferenceData: {
        createRequest: {
          requestId: `oasis-${booking.id || Date.now()}`,
          conferenceSolutionKey: {
            type: 'hangoutsMeet',
          },
        },
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 day before
          { method: 'popup', minutes: 30 }, // 30 minutes before
        ],
      },
    }

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
      conferenceDataVersion: 1,
      sendUpdates: 'all', // Send email invitations to attendees
    })

    const createdEvent = response.data

    return NextResponse.json({
      success: true,
      message: 'Event created successfully',
      event: {
        id: createdEvent.id,
        htmlLink: createdEvent.htmlLink,
        meetLink: createdEvent.conferenceData?.entryPoints?.find(
          (ep) => ep.entryPointType === 'video'
        )?.uri,
        summary: createdEvent.summary,
        start: createdEvent.start?.dateTime,
        end: createdEvent.end?.dateTime,
      },
    })
  } catch (error) {
    console.error('Google Calendar error:', error)

    // Provide helpful error messages
    if (error instanceof Error) {
      if (error.message.includes('Missing Google OAuth credentials')) {
        return NextResponse.json(
          { error: 'Google Calendar integration not configured. Please contact the administrator.' },
          { status: 500 }
        )
      }

      if (error.message.includes('invalid_grant')) {
        return NextResponse.json(
          { error: 'Google Calendar authentication expired. Please re-authorize the application.' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to add event to Google Calendar. Please try again.' },
      { status: 500 }
    )
  }
}

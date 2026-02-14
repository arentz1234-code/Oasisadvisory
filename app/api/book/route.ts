import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

// Environment variables needed:
// GOOGLE_CLIENT_EMAIL - Service account email
// GOOGLE_PRIVATE_KEY - Service account private key
// GOOGLE_CALENDAR_ID - Calendar ID (usually your email)

const SCOPES = ['https://www.googleapis.com/auth/calendar']

async function getGoogleCalendarClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: SCOPES,
  })

  const calendar = google.calendar({ version: 'v3', auth })
  return calendar
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, company, message, date, time } = body

    // Validate required fields
    if (!name || !email || !date || !time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Parse the date and time
    const [timePart, ampm] = time.split(' ')
    const [hourStr, minStr] = timePart.split(':')
    let hour = parseInt(hourStr)
    if (ampm === 'PM' && hour !== 12) hour += 12
    if (ampm === 'AM' && hour === 12) hour = 0

    const startDate = new Date(date)
    startDate.setHours(hour, parseInt(minStr), 0, 0)

    const endDate = new Date(startDate)
    endDate.setMinutes(endDate.getMinutes() + 30)

    // Check if Google credentials are configured
    if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      // Return success without creating calendar event (for testing)
      console.log('Google credentials not configured. Booking details:', {
        name,
        email,
        company,
        message,
        date,
        time,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      })

      return NextResponse.json({
        success: true,
        message: 'Booking received (Google Calendar not configured)',
        meetLink: null,
        eventId: null,
      })
    }

    const calendar = await getGoogleCalendarClient()

    // Create calendar event with Google Meet
    const event = {
      summary: `Oasis Advisory - Consultation with ${name}`,
      description: `
Consultation call with ${name}
${company ? `Company: ${company}` : ''}
Email: ${email}
${message ? `\nNotes: ${message}` : ''}

Booked via Oasis Advisory website.
      `.trim(),
      start: {
        dateTime: startDate.toISOString(),
        timeZone: 'America/New_York',
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: 'America/New_York',
      },
      attendees: [
        { email: email, displayName: name },
        { email: process.env.GOOGLE_CALENDAR_ID || 'oasisadvisoryteam@gmail.com' },
      ],
      conferenceData: {
        createRequest: {
          requestId: `oasis-${Date.now()}`,
          conferenceSolutionKey: {
            type: 'hangoutsMeet',
          },
        },
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 day before
          { method: 'email', minutes: 60 }, // 1 hour before
          { method: 'popup', minutes: 10 }, // 10 minutes before
        ],
      },
    }

    const response = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
      requestBody: event,
      conferenceDataVersion: 1,
      sendUpdates: 'all', // Send email invites to attendees
    })

    const meetLink = response.data.conferenceData?.entryPoints?.find(
      (ep) => ep.entryPointType === 'video'
    )?.uri

    return NextResponse.json({
      success: true,
      message: 'Booking confirmed!',
      meetLink: meetLink || null,
      eventId: response.data.id,
      htmlLink: response.data.htmlLink,
    })
  } catch (error) {
    console.error('Booking error:', error)
    return NextResponse.json(
      { error: 'Failed to create booking. Please try again or email us directly.' },
      { status: 500 }
    )
  }
}

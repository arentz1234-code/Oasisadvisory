import { NextRequest, NextResponse } from 'next/server'

// Email templates
function getConfirmationEmailHtml(booking: {
  name: string
  date: string
  time: string
  cancelToken?: string
}) {
  const formattedDate = new Date(booking.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const cancelUrl = booking.cancelToken
    ? `${process.env.NEXT_PUBLIC_BASE_URL || 'https://oasisadvisory.com'}/cancel?token=${booking.cancelToken}`
    : null

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0f1a; color: #e2e8f0; margin: 0; padding: 40px 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #111827; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
    <div style="background: linear-gradient(135deg, #5B8DEF, #4A7BD4); padding: 30px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px;">Booking Confirmed!</h1>
    </div>
    <div style="padding: 30px;">
      <p style="color: #e2e8f0; font-size: 16px; margin-bottom: 20px;">
        Hi ${booking.name},
      </p>
      <p style="color: #94a3b8; font-size: 16px; margin-bottom: 30px;">
        Thank you for booking a consultation with Oasis Advisory! We're looking forward to speaking with you.
      </p>

      <div style="background-color: rgba(91, 141, 239, 0.1); border: 1px solid rgba(91, 141, 239, 0.3); border-radius: 12px; padding: 20px; margin-bottom: 30px;">
        <h2 style="color: #5B8DEF; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 15px 0;">Your Appointment</h2>
        <p style="color: #e2e8f0; font-size: 18px; margin: 0 0 5px 0; font-weight: 600;">${formattedDate}</p>
        <p style="color: #94a3b8; font-size: 16px; margin: 0;">${booking.time} EST</p>
        <p style="color: #94a3b8; font-size: 14px; margin: 15px 0 0 0;">30-minute consultation</p>
      </div>

      <p style="color: #94a3b8; font-size: 14px; margin-bottom: 20px;">
        We'll send you a reminder email 24 hours before your consultation with the meeting link.
      </p>

      ${cancelUrl ? `
      <p style="color: #64748b; font-size: 13px; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
        Need to cancel or reschedule? <a href="${cancelUrl}" style="color: #5B8DEF; text-decoration: none;">Click here</a>
      </p>
      ` : ''}
    </div>
    <div style="background-color: rgba(0,0,0,0.3); padding: 20px; text-align: center;">
      <p style="color: #64748b; font-size: 13px; margin: 0;">
        Oasis Advisory - AI Solutions for Small Business
      </p>
    </div>
  </div>
</body>
</html>
`
}

function getReminderEmailHtml(booking: {
  name: string
  date: string
  time: string
  meetLink?: string
}) {
  const formattedDate = new Date(booking.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0f1a; color: #e2e8f0; margin: 0; padding: 40px 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #111827; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
    <div style="background: linear-gradient(135deg, #5B8DEF, #4A7BD4); padding: 30px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px;">Reminder: Your Consultation is Tomorrow!</h1>
    </div>
    <div style="padding: 30px;">
      <p style="color: #e2e8f0; font-size: 16px; margin-bottom: 20px;">
        Hi ${booking.name},
      </p>
      <p style="color: #94a3b8; font-size: 16px; margin-bottom: 30px;">
        This is a friendly reminder about your upcoming consultation with Oasis Advisory.
      </p>

      <div style="background-color: rgba(91, 141, 239, 0.1); border: 1px solid rgba(91, 141, 239, 0.3); border-radius: 12px; padding: 20px; margin-bottom: 30px;">
        <h2 style="color: #5B8DEF; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 15px 0;">Your Appointment</h2>
        <p style="color: #e2e8f0; font-size: 18px; margin: 0 0 5px 0; font-weight: 600;">${formattedDate}</p>
        <p style="color: #94a3b8; font-size: 16px; margin: 0;">${booking.time} EST</p>
      </div>

      ${booking.meetLink ? `
      <div style="text-align: center; margin-bottom: 30px;">
        <a href="${booking.meetLink}" style="display: inline-block; background: linear-gradient(135deg, #5B8DEF, #4A7BD4); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: 600; font-size: 16px;">
          Join Meeting
        </a>
      </div>
      ` : ''}

      <p style="color: #94a3b8; font-size: 14px;">
        See you tomorrow!
      </p>
    </div>
    <div style="background-color: rgba(0,0,0,0.3); padding: 20px; text-align: center;">
      <p style="color: #64748b; font-size: 13px; margin: 0;">
        Oasis Advisory - AI Solutions for Small Business
      </p>
    </div>
  </div>
</body>
</html>
`
}

// Send email using Resend (or fallback to logging)
async function sendEmail(to: string, subject: string, html: string) {
  const resendApiKey = process.env.RESEND_API_KEY

  if (!resendApiKey) {
    // Log email for development/testing
    console.log('=== EMAIL (No API key configured) ===')
    console.log(`To: ${to}`)
    console.log(`Subject: ${subject}`)
    console.log('HTML email would be sent')
    console.log('=====================================')
    return { success: true, message: 'Email logged (no API key)' }
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || 'Oasis Advisory <hello@oasisadvisory.com>',
        to: [to],
        subject,
        html,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to send email')
    }

    const data = await response.json()
    return { success: true, id: data.id }
  } catch (error) {
    console.error('Email send error:', error)
    throw error
  }
}

// POST - Send an email
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const adminPassword = process.env.ADMIN_PASSWORD || 'oasis2024'

    // Allow both admin and internal calls
    const isAdmin = authHeader === `Bearer ${adminPassword}`
    const isInternal = request.headers.get('x-internal-call') === 'true'

    if (!isAdmin && !isInternal) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { type, booking, to } = body

    if (!type || !booking) {
      return NextResponse.json(
        { error: 'Missing required fields: type, booking' },
        { status: 400 }
      )
    }

    const recipientEmail = to || booking.email

    let subject: string
    let html: string

    switch (type) {
      case 'confirmation':
        subject = 'Your Oasis Advisory Consultation is Confirmed!'
        html = getConfirmationEmailHtml(booking)
        break
      case 'reminder':
        subject = 'Reminder: Your Consultation is Tomorrow!'
        html = getReminderEmailHtml(booking)
        break
      default:
        return NextResponse.json(
          { error: `Unknown email type: ${type}` },
          { status: 400 }
        )
    }

    const result = await sendEmail(recipientEmail, subject, html)

    return NextResponse.json({
      message: 'Email sent successfully',
      ...result,
    })
  } catch (error) {
    console.error('Email API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send email' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'

// In-memory storage fallback (for when Redis isn't configured)
// Note: This won't persist between serverless function invocations
// but allows the booking form to work and logs bookings
let memoryBookings: Booking[] = []

// Try to use Redis if configured
let redis: any = null
try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    const { Redis } = require('@upstash/redis')
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  }
} catch (e) {
  console.log('Redis not available, using memory storage')
}

const BOOKINGS_KEY = 'oasis:bookings'

interface Booking {
  id: string
  name: string
  email: string
  phone: string
  businessName: string
  date: string
  time: string
  meetLink?: string
  createdAt: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
}

async function getBookings(): Promise<Booking[]> {
  try {
    if (redis) {
      const bookings = await redis.get(BOOKINGS_KEY)
      return bookings || []
    }
    return memoryBookings
  } catch (error) {
    console.error('Error reading bookings:', error)
    return memoryBookings
  }
}

async function saveBookings(bookings: Booking[]) {
  try {
    if (redis) {
      await redis.set(BOOKINGS_KEY, bookings)
    } else {
      memoryBookings = bookings
    }
  } catch (error) {
    console.error('Error saving bookings:', error)
    // Fallback to memory
    memoryBookings = bookings
  }
}

// Send email notification for new bookings
async function sendNotification(booking: Booking) {
  // Log the booking details (visible in Vercel function logs)
  console.log('=== NEW BOOKING ===')
  console.log(`Name: ${booking.name}`)
  console.log(`Email: ${booking.email}`)
  console.log(`Phone: ${booking.phone}`)
  console.log(`Business: ${booking.businessName || 'N/A'}`)
  console.log(`Date: ${booking.date}`)
  console.log(`Time: ${booking.time}`)
  console.log('==================')
}

// GET - Retrieve bookings
// With auth: returns all booking details (for admin)
// Without auth + ?booked=true: returns just booked date/time slots (for calendar)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const bookedOnly = searchParams.get('booked') === 'true'

  // Public endpoint: just return booked slots (date + time only)
  if (bookedOnly) {
    const bookings = await getBookings()
    const bookedSlots = bookings
      .filter(b => b.status !== 'cancelled')
      .map(b => ({
        date: b.date.split('T')[0], // Just the date part
        time: b.time,
      }))
    return NextResponse.json({ bookedSlots })
  }

  // Admin endpoint: requires auth, returns full details
  const authHeader = request.headers.get('authorization')
  const adminPassword = process.env.ADMIN_PASSWORD || 'oasis2024'

  if (authHeader !== `Bearer ${adminPassword}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const bookings = await getBookings()
  return NextResponse.json({ bookings, storageType: redis ? 'redis' : 'memory' })
}

// POST - Create a new booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, businessName, date, time } = body

    // Validate required fields
    if (!name || !email || !phone || !date || !time) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, phone, date, time' },
        { status: 400 }
      )
    }

    // Create new booking
    const booking: Booking = {
      id: `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      email,
      phone,
      businessName: businessName || '',
      date,
      time,
      createdAt: new Date().toISOString(),
      status: 'pending',
    }

    // Save to storage
    const bookings = await getBookings()
    bookings.unshift(booking) // Add to beginning (newest first)
    await saveBookings(bookings)

    // Send notification
    await sendNotification(booking)

    return NextResponse.json({
      success: true,
      message: 'Booking created successfully',
      booking,
      storageType: redis ? 'redis' : 'memory',
    })
  } catch (error) {
    console.error('Booking error:', error)
    return NextResponse.json(
      { error: 'Failed to create booking. Please try again or email us directly at oasisadvisoryteam@gmail.com' },
      { status: 500 }
    )
  }
}

// PATCH - Update booking status
export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const adminPassword = process.env.ADMIN_PASSWORD || 'oasis2024'

    if (authHeader !== `Bearer ${adminPassword}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, status } = body

    const bookings = await getBookings()
    const index = bookings.findIndex(b => b.id === id)

    if (index === -1) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    bookings[index].status = status
    await saveBookings(bookings)

    return NextResponse.json({ success: true, booking: bookings[index] })
  } catch (error) {
    console.error('Update error:', error)
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 })
  }
}

// DELETE - Delete a booking
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const adminPassword = process.env.ADMIN_PASSWORD || 'oasis2024'

    if (authHeader !== `Bearer ${adminPassword}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Booking ID required' }, { status: 400 })
    }

    const bookings = await getBookings()
    const filtered = bookings.filter(b => b.id !== id)

    if (filtered.length === bookings.length) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    await saveBookings(filtered)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

// Initialize Redis client
// Set up Upstash Redis at https://console.upstash.com and add:
// UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to your Vercel environment variables
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
})

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
    const bookings = await redis.get<Booking[]>(BOOKINGS_KEY)
    return bookings || []
  } catch (error) {
    console.error('Error reading bookings:', error)
    return []
  }
}

async function saveBookings(bookings: Booking[]) {
  try {
    await redis.set(BOOKINGS_KEY, bookings)
  } catch (error) {
    console.error('Error saving bookings:', error)
    throw error
  }
}

// GET - Retrieve all bookings (for admin)
export async function GET(request: NextRequest) {
  // Check for admin auth
  const authHeader = request.headers.get('authorization')
  const adminPassword = process.env.ADMIN_PASSWORD || 'oasis2024'

  if (authHeader !== `Bearer ${adminPassword}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const bookings = await getBookings()
  return NextResponse.json({ bookings })
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

    return NextResponse.json({
      success: true,
      message: 'Booking created successfully',
      booking,
    })
  } catch (error) {
    console.error('Booking error:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
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

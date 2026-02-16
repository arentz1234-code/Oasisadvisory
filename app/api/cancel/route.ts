import { NextRequest, NextResponse } from 'next/server'

// Storage functions - duplicated here since we can't import from bookings
let redis: any = null
try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    const { Redis } = require('@upstash/redis')
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  }
} catch {
  console.log('Redis not available')
}

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
  notes?: string
  cancelToken?: string
}

const BOOKINGS_KEY = 'oasis:bookings'
let memoryBookings: Booking[] = []

async function getBookings(): Promise<Booking[]> {
  try {
    if (redis) {
      const bookings = await redis.get(BOOKINGS_KEY)
      return bookings || []
    }
    return memoryBookings
  } catch {
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
  } catch {
    memoryBookings = bookings
  }
}

// GET - Cancel a booking via token
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json({ error: 'Missing cancel token' }, { status: 400 })
    }

    const bookings = await getBookings()
    const bookingIndex = bookings.findIndex(b => b.cancelToken === token)

    if (bookingIndex === -1) {
      return NextResponse.json({
        error: 'Invalid or expired cancellation link'
      }, { status: 404 })
    }

    const booking = bookings[bookingIndex]

    // Check if already cancelled
    if (booking.status === 'cancelled') {
      return NextResponse.json({
        message: 'This booking has already been cancelled',
        booking: {
          name: booking.name,
          date: booking.date,
          time: booking.time,
        }
      })
    }

    // Cancel the booking
    bookings[bookingIndex].status = 'cancelled'
    await saveBookings(bookings)

    return NextResponse.json({
      success: true,
      message: 'Booking cancelled successfully',
      booking: {
        name: booking.name,
        date: booking.date,
        time: booking.time,
      }
    })
  } catch (error) {
    console.error('Cancel error:', error)
    return NextResponse.json({ error: 'Failed to cancel booking' }, { status: 500 })
  }
}

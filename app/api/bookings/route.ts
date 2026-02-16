import { NextRequest, NextResponse } from 'next/server'

// In-memory storage fallback (for when Redis isn't configured)
// Note: This won't persist between serverless function invocations
// but allows the booking form to work and logs bookings
let memoryBookings: Booking[] = []
let memoryBlockedSlots: BlockedSlot[] = []

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
const BLOCKED_KEY = 'oasis:blocked'
const SETTINGS_KEY = 'oasis:settings'

interface Settings {
  availableDays: number[] // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
}

const DEFAULT_SETTINGS: Settings = {
  availableDays: [1, 2, 3, 4, 5] // Mon-Fri by default
}

let memorySettings: Settings = { ...DEFAULT_SETTINGS }

interface BlockedSlot {
  id: string
  date: string
  time?: string // If no time, entire day is blocked
  createdAt: string
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

async function getBlockedSlots(): Promise<BlockedSlot[]> {
  try {
    if (redis) {
      const blocked = await redis.get(BLOCKED_KEY)
      return blocked || []
    }
    return memoryBlockedSlots
  } catch (error) {
    console.error('Error reading blocked slots:', error)
    return memoryBlockedSlots
  }
}

async function saveBlockedSlots(blocked: BlockedSlot[]) {
  try {
    if (redis) {
      await redis.set(BLOCKED_KEY, blocked)
    } else {
      memoryBlockedSlots = blocked
    }
  } catch (error) {
    console.error('Error saving blocked slots:', error)
    memoryBlockedSlots = blocked
  }
}

async function getSettings(): Promise<Settings> {
  try {
    if (redis) {
      const settings = await redis.get(SETTINGS_KEY)
      return settings || { ...DEFAULT_SETTINGS }
    }
    return memorySettings
  } catch (error) {
    console.error('Error reading settings:', error)
    return memorySettings
  }
}

async function saveSettings(settings: Settings) {
  try {
    if (redis) {
      await redis.set(SETTINGS_KEY, settings)
    } else {
      memorySettings = settings
    }
  } catch (error) {
    console.error('Error saving settings:', error)
    memorySettings = settings
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

  // Public endpoint: just return booked and blocked slots (date + time only) plus settings
  if (bookedOnly) {
    const bookings = await getBookings()
    const blocked = await getBlockedSlots()
    const settings = await getSettings()
    const bookedSlots = bookings
      .filter(b => b.status !== 'cancelled')
      .map(b => ({
        date: b.date.split('T')[0], // Just the date part
        time: b.time,
      }))
    const blockedSlots = blocked.map(b => ({
      date: b.date,
      time: b.time,
    }))
    return NextResponse.json({ bookedSlots, blockedSlots, settings })
  }

  // Admin endpoint: requires auth, returns full details
  const authHeader = request.headers.get('authorization')
  const adminPassword = process.env.ADMIN_PASSWORD || 'oasis2024'

  if (authHeader !== `Bearer ${adminPassword}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const bookings = await getBookings()
  const blockedSlots = await getBlockedSlots()
  const settings = await getSettings()
  return NextResponse.json({ bookings, blockedSlots, settings, storageType: redis ? 'redis' : 'memory' })
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

// PATCH - Update booking status or block/unblock slots
export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const adminPassword = process.env.ADMIN_PASSWORD || 'oasis2024'

    if (authHeader !== `Bearer ${adminPassword}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, status, action, date, time, availableDays } = body

    // Handle settings update
    if (action === 'updateSettings') {
      const settings = await getSettings()
      if (availableDays !== undefined) {
        settings.availableDays = availableDays
      }
      await saveSettings(settings)
      return NextResponse.json({ success: true, settings })
    }

    // Handle block/unblock actions
    if (action === 'block') {
      const blocked = await getBlockedSlots()
      const newBlock: BlockedSlot = {
        id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        date,
        time: time || undefined,
        createdAt: new Date().toISOString(),
      }
      blocked.push(newBlock)
      await saveBlockedSlots(blocked)
      return NextResponse.json({ success: true, blocked: newBlock })
    }

    if (action === 'unblock') {
      const blocked = await getBlockedSlots()
      const filtered = blocked.filter(b => !(b.date === date && b.time === time))
      await saveBlockedSlots(filtered)
      return NextResponse.json({ success: true })
    }

    // Handle booking status update
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
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
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
// Deployed: Sun Feb 15 22:00:52 CST 2026

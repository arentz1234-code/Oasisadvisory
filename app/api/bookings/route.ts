import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

// Simple file-based storage for bookings
// In production, use a proper database (Vercel Postgres, Supabase, etc.)
const BOOKINGS_FILE = join(process.cwd(), 'bookings.json')

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

function getBookings(): Booking[] {
  try {
    if (existsSync(BOOKINGS_FILE)) {
      const data = readFileSync(BOOKINGS_FILE, 'utf-8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error reading bookings:', error)
  }
  return []
}

function saveBookings(bookings: Booking[]) {
  try {
    writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2))
  } catch (error) {
    console.error('Error saving bookings:', error)
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

  const bookings = getBookings()
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
    const bookings = getBookings()
    bookings.unshift(booking) // Add to beginning (newest first)
    saveBookings(bookings)

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

    const bookings = getBookings()
    const index = bookings.findIndex(b => b.id === id)

    if (index === -1) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    bookings[index].status = status
    saveBookings(bookings)

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

    const bookings = getBookings()
    const filtered = bookings.filter(b => b.id !== id)

    if (filtered.length === bookings.length) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    saveBookings(filtered)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 })
  }
}

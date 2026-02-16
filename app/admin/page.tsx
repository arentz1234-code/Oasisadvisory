'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface Booking {
  id: string
  name: string
  email: string
  phone: string
  businessName: string
  date: string
  time: string
  createdAt: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  notes?: string
}

interface BlockedSlot {
  id: string
  date: string
  time?: string
  createdAt: string
}

// Generate 30-minute time slots for given hour range
function generateTimeSlots(startHour: number, endHour: number) {
  const slots = []
  for (let hour = startHour; hour < endHour; hour++) {
    for (let min = 0; min < 60; min += 30) {
      const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
      const ampm = hour >= 12 ? 'PM' : 'AM'
      const timeStr = `${hour12}:${min.toString().padStart(2, '0')} ${ampm}`
      slots.push(timeStr)
    }
  }
  return slots
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getWeekDates(weekOffset: number = 0) {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - dayOfWeek + (weekOffset * 7))
  startOfWeek.setHours(0, 0, 0, 0)

  const dates: Date[] = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + i)
    dates.push(date)
  }
  return dates
}

const IconLogout = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)

const IconRefresh = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
  </svg>
)

const IconTrash = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
  </svg>
)

const IconDownload = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

const IconCalendar = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

const IconUsers = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87" />
    <path d="M16 3.13a4 4 0 010 7.75" />
  </svg>
)

const IconMail = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
)

const IconPhone = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
  </svg>
)

const IconHome = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)

const IconCalendarPlus = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <line x1="12" y1="14" x2="12" y2="18" />
    <line x1="10" y1="16" x2="14" y2="16" />
  </svg>
)

const IconCheck = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const IconSpinner = () => (
  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
)

const statusColors = {
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  confirmed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  completed: 'bg-green-500/20 text-green-400 border-green-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [authToken, setAuthToken] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'date' | 'created'>('created')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [activeTab, setActiveTab] = useState<'bookings' | 'block' | 'settings'>('bookings')
  const [blockWeekOffset, setBlockWeekOffset] = useState(0)
  const [availableDays, setAvailableDays] = useState<number[]>([1, 2, 3, 4, 5])
  const [startHour, setStartHour] = useState<number>(9)
  const [endHour, setEndHour] = useState<number>(16)

  // Drag selection state
  const [isDragging, setIsDragging] = useState(false)
  const [dragAction, setDragAction] = useState<'block' | 'unblock' | null>(null)
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set())

  // Google Calendar state
  const [calendarLoading, setCalendarLoading] = useState<string | null>(null)
  const [calendarSuccess, setCalendarSuccess] = useState<string | null>(null)

  // Dynamic time slots based on settings
  const timeSlots = useMemo(() => generateTimeSlots(startHour, endHour), [startHour, endHour])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')

    try {
      const response = await fetch('/api/bookings', {
        headers: { 'Authorization': `Bearer ${password}` }
      })

      if (response.ok) {
        setAuthToken(password)
        setIsLoggedIn(true)
        const data = await response.json()
        setBookings(data.bookings || [])
        setBlockedSlots(data.blockedSlots || [])
        if (data.settings?.availableDays) {
          setAvailableDays(data.settings.availableDays)
        }
        if (data.settings?.startHour !== undefined) {
          setStartHour(data.settings.startHour)
        }
        if (data.settings?.endHour !== undefined) {
          setEndHour(data.settings.endHour)
        }
      } else {
        setLoginError('Invalid password')
      }
    } catch {
      setLoginError('Failed to connect. Please try again.')
    }
  }

  const fetchBookings = async () => {
    if (!authToken) return
    setIsLoading(true)
    try {
      const response = await fetch('/api/bookings', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      })
      if (response.ok) {
        const data = await response.json()
        setBookings(data.bookings || [])
        setBlockedSlots(data.blockedSlots || [])
        if (data.settings?.availableDays) {
          setAvailableDays(data.settings.availableDays)
        }
        if (data.settings?.startHour !== undefined) {
          setStartHour(data.settings.startHour)
        }
        if (data.settings?.endHour !== undefined) {
          setEndHour(data.settings.endHour)
        }
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleAvailableDay = async (day: number) => {
    const newDays = availableDays.includes(day)
      ? availableDays.filter(d => d !== day)
      : [...availableDays, day].sort((a, b) => a - b)

    try {
      const response = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          action: 'updateSettings',
          availableDays: newDays
        })
      })
      if (response.ok) {
        setAvailableDays(newDays)
      }
    } catch (error) {
      console.error('Failed to update settings:', error)
    }
  }

  const updateTimeSettings = async (newStartHour: number, newEndHour: number) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          action: 'updateSettings',
          startHour: newStartHour,
          endHour: newEndHour
        })
      })
      if (response.ok) {
        setStartHour(newStartHour)
        setEndHour(newEndHour)
      }
    } catch (error) {
      console.error('Failed to update time settings:', error)
    }
  }

  // Helper to format hour to 12h time string
  const formatHour = (hour: number) => {
    const h = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    const ampm = hour >= 12 ? 'PM' : 'AM'
    return `${h}:00 ${ampm}`
  }

  // Generate hour options for dropdown
  const hourOptions = Array.from({ length: 15 }, (_, i) => i + 6) // 6 AM to 8 PM

  const isAvailableDay = (date: Date) => {
    return availableDays.includes(date.getDay())
  }

  const toggleBlockSlot = async (date: string, time?: string) => {
    const isBlocked = blockedSlots.some(b => b.date === date && b.time === time)

    try {
      const response = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          action: isBlocked ? 'unblock' : 'block',
          date,
          time
        })
      })
      if (response.ok) {
        fetchBookings()
      }
    } catch (error) {
      console.error('Failed to toggle block:', error)
    }
  }

  const isSlotBlocked = (date: string, time: string) => {
    return blockedSlots.some(b => b.date === date && (!b.time || b.time === time))
  }

  const isSlotBooked = (date: string, time: string) => {
    return bookings.some(b =>
      b.date.split('T')[0] === date &&
      b.time === time &&
      b.status !== 'cancelled'
    )
  }

  // Drag selection handlers
  const handleDragStart = (date: string, time: string, isBlocked: boolean) => {
    setIsDragging(true)
    setDragAction(isBlocked ? 'unblock' : 'block')
    setSelectedSlots(new Set([`${date}|${time}`]))
  }

  const handleDragEnter = (date: string, time: string) => {
    if (isDragging) {
      setSelectedSlots(prev => new Set([...Array.from(prev), `${date}|${time}`]))
    }
  }

  const handleDragEnd = useCallback(async () => {
    if (!isDragging || selectedSlots.size === 0) {
      setIsDragging(false)
      setSelectedSlots(new Set())
      setDragAction(null)
      return
    }

    // Apply action to all selected slots
    for (const slot of Array.from(selectedSlots)) {
      const [date, time] = slot.split('|')
      const isBooked = isSlotBooked(date, time)
      if (!isBooked) {
        try {
          await fetch('/api/bookings', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
              action: dragAction,
              date,
              time
            })
          })
        } catch (error) {
          console.error('Failed to update slot:', error)
        }
      }
    }

    // Refresh and reset
    fetchBookings()
    setIsDragging(false)
    setSelectedSlots(new Set())
    setDragAction(null)
  }, [isDragging, selectedSlots, dragAction, authToken])

  // Handle mouse up anywhere on the page
  useEffect(() => {
    const handleMouseUp = () => {
      if (isDragging) {
        handleDragEnd()
      }
    }
    window.addEventListener('mouseup', handleMouseUp)
    return () => window.removeEventListener('mouseup', handleMouseUp)
  }, [isDragging, handleDragEnd])

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ id, status })
      })
      if (response.ok) {
        fetchBookings()
      }
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const deleteBooking = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) return
    try {
      const response = await fetch(`/api/bookings?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` }
      })
      if (response.ok) {
        fetchBookings()
        setSelectedBooking(null)
      }
    } catch (error) {
      console.error('Failed to delete booking:', error)
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setAuthToken('')
    setPassword('')
    setBookings([])
  }

  const addToGoogleCalendar = async (booking: Booking) => {
    setCalendarLoading(booking.id)
    setCalendarSuccess(null)

    try {
      const response = await fetch('/api/calendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ booking })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add to calendar')
      }

      setCalendarSuccess(booking.id)
      // Clear success indicator after 3 seconds
      setTimeout(() => setCalendarSuccess(null), 3000)
    } catch (error) {
      console.error('Calendar error:', error)
      alert(error instanceof Error ? error.message : 'Failed to add to Google Calendar')
    } finally {
      setCalendarLoading(null)
    }
  }

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Business', 'Date', 'Time', 'Status', 'Booked On']
    const rows = bookings.map(b => [
      b.name,
      b.email,
      b.phone,
      b.businessName || '',
      new Date(b.date).toLocaleDateString(),
      b.time,
      b.status,
      new Date(b.createdAt).toLocaleDateString()
    ])

    const csvContent = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `oasis-bookings-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatCreatedAt = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  // Filter and sort bookings
  const filteredBookings = bookings
    .filter(b => filterStatus === 'all' || b.status === filterStatus)
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

  // Get upcoming bookings (next 7 days)
  const upcomingBookings = bookings.filter(b => {
    const bookingDate = new Date(b.date)
    const now = new Date()
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    return bookingDate >= now && bookingDate <= weekFromNow && b.status !== 'cancelled'
  })

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-navy">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-soft mb-2">Admin Portal</h1>
            <p className="text-soft-muted text-sm">Enter your password to access the dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-navy-50 border border-white/10 text-soft placeholder-soft-muted/50 focus:outline-none focus:border-accent/50 transition-colors"
                placeholder="Password"
                autoFocus
              />
            </div>

            {loginError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
                {loginError}
              </div>
            )}

            <button type="submit" className="btn-primary w-full">
              Login
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-soft-muted hover:text-accent text-sm transition-colors">
              Back to website
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-navy">
      {/* Top Bar */}
      <div className="bg-navy-50 border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-soft">Oasis Admin</h1>
              <span className="text-soft-muted text-sm hidden sm:block">Bookings Dashboard</span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="p-2 rounded-lg hover:bg-white/5 transition-colors text-soft-muted hover:text-accent"
                title="View Website"
              >
                <IconHome />
              </Link>
              <button
                onClick={fetchBookings}
                disabled={isLoading}
                className={`p-2 rounded-lg hover:bg-white/5 transition-colors text-soft-muted hover:text-accent disabled:opacity-50 ${isLoading ? 'animate-spin' : ''}`}
                title="Refresh"
              >
                <IconRefresh />
              </button>
              <button
                onClick={exportToCSV}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors text-soft-muted hover:text-accent"
                title="Export CSV"
              >
                <IconDownload />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/5 transition-colors text-soft-muted hover:text-red-400"
              >
                <IconLogout />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'bookings'
                ? 'bg-accent text-white'
                : 'bg-white/5 text-soft-muted hover:bg-white/10'
            }`}
          >
            Bookings
          </button>
          <button
            onClick={() => setActiveTab('block')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'block'
                ? 'bg-accent text-white'
                : 'bg-white/5 text-soft-muted hover:bg-white/10'
            }`}
          >
            Block Times
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'settings'
                ? 'bg-accent text-white'
                : 'bg-white/5 text-soft-muted hover:bg-white/10'
            }`}
          >
            Settings
          </button>
        </div>

        {activeTab === 'bookings' ? (
          <>
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                <IconUsers />
              </div>
              <div>
                <div className="text-2xl font-bold text-soft">{bookings.length}</div>
                <div className="text-soft-muted text-xs">Total Bookings</div>
              </div>
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center text-yellow-400">
                <IconCalendar />
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">{bookings.filter(b => b.status === 'pending').length}</div>
                <div className="text-soft-muted text-xs">Pending</div>
              </div>
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                <IconCalendar />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">{bookings.filter(b => b.status === 'confirmed').length}</div>
                <div className="text-soft-muted text-xs">Confirmed</div>
              </div>
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400">
                <IconCalendar />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">{bookings.filter(b => b.status === 'completed').length}</div>
                <div className="text-soft-muted text-xs">Completed</div>
              </div>
            </div>
          </div>
          <div className="glass-card p-4 col-span-2 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center text-accent">
                <IconCalendar />
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">{upcomingBookings.length}</div>
                <div className="text-soft-muted text-xs">Next 7 Days</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex items-center gap-2">
            <label className="text-soft-muted text-sm">Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 rounded-lg bg-navy-50 border border-white/10 text-soft text-sm focus:outline-none focus:border-accent/50"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-soft-muted text-sm">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'created')}
              className="px-3 py-2 rounded-lg bg-navy-50 border border-white/10 text-soft text-sm focus:outline-none focus:border-accent/50"
            >
              <option value="created">Booking Date</option>
              <option value="date">Call Date</option>
            </select>
          </div>
          <div className="sm:ml-auto text-soft-muted text-sm">
            Showing {filteredBookings.length} of {bookings.length} bookings
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bookings Table */}
          <div className="lg:col-span-2">
            <div className="glass-card overflow-hidden">
              {filteredBookings.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                    <IconCalendar />
                  </div>
                  <p className="text-soft-muted">No bookings found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/5 bg-navy-50/50">
                        <th className="text-left p-4 text-soft-muted text-xs font-medium uppercase tracking-wider">Contact</th>
                        <th className="text-left p-4 text-soft-muted text-xs font-medium uppercase tracking-wider">Scheduled</th>
                        <th className="text-left p-4 text-soft-muted text-xs font-medium uppercase tracking-wider">Status</th>
                        <th className="text-right p-4 text-soft-muted text-xs font-medium uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.map((booking) => (
                        <tr
                          key={booking.id}
                          className={`border-b border-white/5 hover:bg-white/[0.02] cursor-pointer transition-colors ${selectedBooking?.id === booking.id ? 'bg-accent/5' : ''}`}
                          onClick={() => setSelectedBooking(booking)}
                        >
                          <td className="p-4">
                            <div className="text-soft font-medium">{booking.name}</div>
                            <div className="text-soft-muted text-xs">{booking.businessName || 'No business name'}</div>
                          </td>
                          <td className="p-4">
                            <div className="text-soft text-sm">{formatDate(booking.date)}</div>
                            <div className="text-soft-muted text-xs">{booking.time} EST</div>
                          </td>
                          <td className="p-4">
                            <select
                              value={booking.status}
                              onChange={(e) => {
                                e.stopPropagation()
                                updateStatus(booking.id, e.target.value)
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className={`px-3 py-1 rounded-full text-xs font-medium border bg-transparent cursor-pointer ${statusColors[booking.status]}`}
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  addToGoogleCalendar(booking)
                                }}
                                disabled={calendarLoading === booking.id || calendarSuccess === booking.id}
                                className={`p-2 rounded-lg transition-colors ${
                                  calendarSuccess === booking.id
                                    ? 'bg-green-500/10 text-green-400'
                                    : 'hover:bg-accent/10 text-soft-muted hover:text-accent'
                                } disabled:cursor-not-allowed`}
                                title="Add to Google Calendar"
                              >
                                {calendarLoading === booking.id ? (
                                  <IconSpinner />
                                ) : calendarSuccess === booking.id ? (
                                  <IconCheck />
                                ) : (
                                  <IconCalendarPlus />
                                )}
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteBooking(booking.id)
                                }}
                                className="p-2 rounded-lg hover:bg-red-500/10 text-soft-muted hover:text-red-400 transition-colors"
                                title="Delete"
                              >
                                <IconTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Booking Details Panel */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 sticky top-24">
              {selectedBooking ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-soft">Booking Details</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[selectedBooking.status]}`}>
                      {selectedBooking.status}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-soft-muted text-xs uppercase tracking-wider">Name</label>
                      <p className="text-soft font-medium mt-1">{selectedBooking.name}</p>
                    </div>

                    {selectedBooking.businessName && (
                      <div>
                        <label className="text-soft-muted text-xs uppercase tracking-wider">Business</label>
                        <p className="text-soft mt-1">{selectedBooking.businessName}</p>
                      </div>
                    )}

                    <div>
                      <label className="text-soft-muted text-xs uppercase tracking-wider">Contact</label>
                      <div className="mt-1 space-y-1">
                        <a href={`mailto:${selectedBooking.email}`} className="flex items-center gap-2 text-accent hover:underline text-sm">
                          <IconMail />
                          {selectedBooking.email}
                        </a>
                        <a href={`tel:${selectedBooking.phone}`} className="flex items-center gap-2 text-accent hover:underline text-sm">
                          <IconPhone />
                          {selectedBooking.phone}
                        </a>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/5">
                      <label className="text-soft-muted text-xs uppercase tracking-wider">Scheduled Call</label>
                      <p className="text-soft font-medium mt-1">{formatDate(selectedBooking.date)}</p>
                      <p className="text-soft-muted text-sm">{selectedBooking.time} EST</p>
                    </div>

                    <div>
                      <label className="text-soft-muted text-xs uppercase tracking-wider">Booked On</label>
                      <p className="text-soft-muted text-sm mt-1">{formatCreatedAt(selectedBooking.createdAt)}</p>
                    </div>

                    <div className="pt-4 border-t border-white/5 space-y-2">
                      <div className="flex gap-2">
                        <a
                          href={`mailto:${selectedBooking.email}?subject=Your Oasis Advisory Consultation&body=Hi ${selectedBooking.name},%0D%0A%0D%0AThank you for booking a consultation with Oasis Advisory!%0D%0A%0D%0AYour call is scheduled for ${formatDate(selectedBooking.date)} at ${selectedBooking.time} EST.%0D%0A%0D%0ABest regards,%0D%0AOasis Advisory Team`}
                          className="btn-primary text-sm !py-2 !px-4 flex-1 text-center"
                        >
                          Send Email
                        </a>
                        <button
                          onClick={() => addToGoogleCalendar(selectedBooking)}
                          disabled={calendarLoading === selectedBooking.id || calendarSuccess === selectedBooking.id}
                          className={`px-4 py-2 rounded-full text-sm flex items-center gap-2 transition-colors ${
                            calendarSuccess === selectedBooking.id
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                              : 'border border-accent/30 text-accent hover:bg-accent/10'
                          } disabled:cursor-not-allowed`}
                        >
                          {calendarLoading === selectedBooking.id ? (
                            <>
                              <IconSpinner />
                              Adding...
                            </>
                          ) : calendarSuccess === selectedBooking.id ? (
                            <>
                              <IconCheck />
                              Added
                            </>
                          ) : (
                            <>
                              <IconCalendarPlus />
                              Add to Calendar
                            </>
                          )}
                        </button>
                      </div>
                      <button
                        onClick={() => deleteBooking(selectedBooking.id)}
                        className="w-full px-4 py-2 rounded-full border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors text-sm"
                      >
                        Delete Booking
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                    <IconCalendar />
                  </div>
                  <p className="text-soft-muted text-sm">Select a booking to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
          </>
        ) : activeTab === 'block' ? (
          /* Block Times Tab */
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-soft">Block Time Slots</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setBlockWeekOffset(Math.max(0, blockWeekOffset - 1))}
                  disabled={blockWeekOffset === 0}
                  className="p-2 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-30"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setBlockWeekOffset(0)}
                  className="px-3 py-1 text-sm text-accent hover:bg-accent/10 rounded-lg transition-colors"
                >
                  This Week
                </button>
                <button
                  onClick={() => setBlockWeekOffset(blockWeekOffset + 1)}
                  className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            <p className="text-soft-muted text-sm mb-4">
              Click or drag across time slots to block/unblock multiple at once. Available days: {availableDays.map(d => DAY_NAMES[d]).join(', ') || 'None'}.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-2 text-left text-soft-muted text-xs font-medium">Time</th>
                    {getWeekDates(blockWeekOffset).map((date, i) => {
                      const available = isAvailableDay(date)
                      const dateStr = date.toISOString().split('T')[0]
                      return (
                        <th
                          key={i}
                          className={`p-2 text-center text-xs font-medium ${
                            available ? 'text-soft' : 'text-soft-muted/50'
                          }`}
                        >
                          <div>{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                          <div className="text-lg">{date.getDate()}</div>
                        </th>
                      )
                    })}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map((time, timeIndex) => (
                    <tr key={timeIndex}>
                      <td className="p-2 text-soft-muted text-xs whitespace-nowrap">{time}</td>
                      {getWeekDates(blockWeekOffset).map((date, dayIndex) => {
                        const available = isAvailableDay(date)
                        const dateStr = date.toISOString().split('T')[0]
                        const blocked = isSlotBlocked(dateStr, time)
                        const booked = isSlotBooked(dateStr, time)

                        if (!available) {
                          return (
                            <td key={dayIndex} className="p-1">
                              <div className="w-full h-8 bg-white/5 rounded opacity-30" />
                            </td>
                          )
                        }

                        const slotKey = `${dateStr}|${time}`
                        const isSelected = selectedSlots.has(slotKey)

                        return (
                          <td key={dayIndex} className="p-1">
                            <button
                              onMouseDown={(e) => {
                                e.preventDefault()
                                if (!booked) handleDragStart(dateStr, time, blocked)
                              }}
                              onMouseEnter={() => {
                                if (!booked) handleDragEnter(dateStr, time)
                              }}
                              disabled={booked}
                              className={`w-full h-8 rounded text-xs font-medium transition-all select-none ${
                                booked
                                  ? 'bg-blue-500/20 text-blue-400 cursor-not-allowed'
                                  : isSelected
                                    ? 'bg-accent/40 text-white ring-2 ring-accent'
                                    : blocked
                                      ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                      : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                              }`}
                            >
                              {booked ? 'Booked' : blocked ? 'Blocked' : 'Open'}
                            </button>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-500/20" />
                <span className="text-soft-muted">Open</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-500/20" />
                <span className="text-soft-muted">Blocked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-blue-500/20" />
                <span className="text-soft-muted">Booked</span>
              </div>
            </div>
          </div>
        ) : activeTab === 'settings' ? (
          /* Settings Tab */
          <div className="glass-card p-6 max-w-2xl">
            <h2 className="text-xl font-bold text-soft mb-6">Booking Settings</h2>

            <div className="space-y-6">
              {/* Available Days */}
              <div>
                <h3 className="text-soft font-medium mb-3">Available Days</h3>
                <p className="text-soft-muted text-sm mb-4">
                  Select which days of the week clients can book consultations.
                </p>
                <div className="flex flex-wrap gap-2">
                  {DAY_NAMES.map((day, index) => (
                    <button
                      key={day}
                      onClick={() => toggleAvailableDay(index)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        availableDays.includes(index)
                          ? 'bg-accent text-white'
                          : 'bg-white/5 text-soft-muted hover:bg-white/10'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Available Hours */}
              <div className="pt-6 border-t border-white/5">
                <h3 className="text-soft font-medium mb-3">Available Hours</h3>
                <p className="text-soft-muted text-sm mb-4">
                  Set the time range when clients can book consultations.
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-soft-muted text-sm">Start:</label>
                    <select
                      value={startHour}
                      onChange={(e) => {
                        const newStart = parseInt(e.target.value)
                        if (newStart < endHour) {
                          updateTimeSettings(newStart, endHour)
                        }
                      }}
                      className="px-3 py-2 rounded-lg bg-navy-50 border border-white/10 text-soft text-sm focus:outline-none focus:border-accent/50"
                    >
                      {hourOptions.map(h => (
                        <option key={h} value={h} disabled={h >= endHour}>
                          {formatHour(h)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-soft-muted text-sm">End:</label>
                    <select
                      value={endHour}
                      onChange={(e) => {
                        const newEnd = parseInt(e.target.value)
                        if (newEnd > startHour) {
                          updateTimeSettings(startHour, newEnd)
                        }
                      }}
                      className="px-3 py-2 rounded-lg bg-navy-50 border border-white/10 text-soft text-sm focus:outline-none focus:border-accent/50"
                    >
                      {hourOptions.map(h => (
                        <option key={h} value={h} disabled={h <= startHour}>
                          {formatHour(h)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <p className="text-soft-muted text-xs mt-2">
                  Last booking slot will be 30 minutes before end time.
                </p>
              </div>

              {/* Current Schedule Summary */}
              <div className="pt-6 border-t border-white/5">
                <h3 className="text-soft font-medium mb-3">Current Schedule</h3>
                <div className="glass-card p-4 bg-white/5">
                  <p className="text-soft-muted text-sm">
                    <span className="text-soft font-medium">Available: </span>
                    {availableDays.length > 0
                      ? availableDays.map(d => DAY_NAMES[d]).join(', ')
                      : 'No days selected'}
                  </p>
                  <p className="text-soft-muted text-sm mt-2">
                    <span className="text-soft font-medium">Hours: </span>
                    {formatHour(startHour)} - {formatHour(endHour - 1).replace(':00', ':30')} EST (30-min slots)
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

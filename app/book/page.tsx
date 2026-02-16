'use client'

import { useRef, useState, useMemo, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
}

function AnimatedSection({
  children,
  className = ''
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={fadeUpVariants}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const IconChevronLeft = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
)

const IconChevronRight = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
)

const IconClose = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
)

// Generate 30-minute time slots from 9am to 4pm
function generateTimeSlots() {
  const slots = []
  for (let hour = 9; hour < 16; hour++) {
    for (let min = 0; min < 60; min += 30) {
      const hour12 = hour > 12 ? hour - 12 : hour
      const ampm = hour >= 12 ? 'PM' : 'AM'
      const timeStr = `${hour12}:${min.toString().padStart(2, '0')} ${ampm}`
      slots.push({
        time: timeStr,
        hour24: hour,
        minute: min,
      })
    }
  }
  return slots
}

const timeSlots = generateTimeSlots()

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getMonthStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function getMonthEnd(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

function getCalendarGrid(date: Date) {
  const monthStart = getMonthStart(date)
  const monthEnd = getMonthEnd(date)
  const startDay = monthStart.getDay()
  const daysInMonth = monthEnd.getDate()

  const grid: (Date | null)[] = []

  // Add empty cells for days before the month starts
  for (let i = 0; i < startDay; i++) {
    grid.push(null)
  }

  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    grid.push(new Date(date.getFullYear(), date.getMonth(), day))
  }

  // Fill remaining cells to complete the grid (up to 42 cells for 6 rows)
  while (grid.length < 42) {
    grid.push(null)
  }

  return grid
}

function formatMonthYear(date: Date) {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

function isSameDay(date1: Date, date2: Date) {
  return date1.toDateString() === date2.toDateString()
}

function isToday(date: Date) {
  return isSameDay(date, new Date())
}

function isPast(date: Date) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const compareDate = new Date(date)
  compareDate.setHours(0, 0, 0, 0)
  return compareDate < today
}

interface BookedSlot {
  date: string
  time: string
}

interface BlockedSlot {
  date: string
  time?: string // If no time, entire day is blocked
}

export default function BookPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [bookingComplete, setBookingComplete] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', businessName: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingError, setBookingError] = useState<string | null>(null)
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([])
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([])
  const [availableDays, setAvailableDays] = useState<number[]>([1, 2, 3, 4, 5]) // Default Mon-Fri

  const calendarGrid = useMemo(() => getCalendarGrid(currentMonth), [currentMonth])

  // Fetch booked and blocked slots on mount and after booking
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await fetch('/api/bookings?booked=true')
        if (response.ok) {
          const data = await response.json()
          setBookedSlots(data.bookedSlots || [])
          setBlockedSlots(data.blockedSlots || [])
          if (data.settings?.availableDays) {
            setAvailableDays(data.settings.availableDays)
          }
        }
      } catch (error) {
        console.error('Failed to fetch slots:', error)
      }
    }
    fetchSlots()
  }, [bookingComplete]) // Refetch after a booking is made

  // Check if day is available (configured via admin)
  const isAvailableDay = (date: Date) => {
    return availableDays.includes(date.getDay())
  }

  // Check if a specific date has any available slots
  const hasAvailableSlots = (date: Date) => {
    if (!isAvailableDay(date) || isPast(date)) return false
    const dateStr = date.toISOString().split('T')[0]
    // Check if entire day is blocked
    const dayBlocked = blockedSlots.some(slot => slot.date === dateStr && !slot.time)
    if (dayBlocked) return false
    // Check if at least one time slot is available
    return timeSlots.some(slot => {
      const booked = bookedSlots.some(b => b.date === dateStr && b.time === slot.time)
      const blocked = blockedSlots.some(b => b.date === dateStr && b.time === slot.time)
      return !booked && !blocked
    })
  }

  // Check if a specific date/time is booked
  const isSlotBooked = (date: Date, time: string) => {
    const dateStr = date.toISOString().split('T')[0]
    return bookedSlots.some(slot => slot.date === dateStr && slot.time === time)
  }

  // Check if a specific date/time is blocked by admin
  const isSlotBlocked = (date: Date, time: string) => {
    const dateStr = date.toISOString().split('T')[0]
    return blockedSlots.some(slot =>
      slot.date === dateStr && (!slot.time || slot.time === time)
    )
  }

  // Get available time slots for selected date
  const availableTimeSlots = useMemo(() => {
    if (!selectedDate) return []
    return timeSlots.filter(slot => {
      const booked = isSlotBooked(selectedDate, slot.time)
      const blocked = isSlotBlocked(selectedDate, slot.time)
      return !booked && !blocked
    })
  }, [selectedDate, bookedSlots, blockedSlots])

  const handleDateSelect = (date: Date) => {
    if (isPast(date) || !isAvailableDay(date) || !hasAvailableSlots(date)) return
    setSelectedDate(date)
    setSelectedTime(null)
    setShowForm(false)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    setShowForm(true)
  }

  const handlePrevMonth = () => {
    const today = new Date()
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    // Don't go before current month
    if (newMonth.getFullYear() < today.getFullYear() ||
        (newMonth.getFullYear() === today.getFullYear() && newMonth.getMonth() < today.getMonth())) {
      return
    }
    setCurrentMonth(newMonth)
    setSelectedDate(null)
    setSelectedTime(null)
  }

  const handleNextMonth = () => {
    const maxMonths = 2 // Allow booking up to 2 months ahead
    const today = new Date()
    const maxMonth = new Date(today.getFullYear(), today.getMonth() + maxMonths, 1)
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    if (newMonth > maxMonth) return
    setCurrentMonth(newMonth)
    setSelectedDate(null)
    setSelectedTime(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setBookingError(null)

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          date: selectedDate?.toISOString(),
          time: selectedTime,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to book')
      }

      setBookingComplete(true)
      setShowForm(false)
    } catch (error) {
      console.error('Booking error:', error)
      setBookingError(error instanceof Error ? error.message : 'Failed to book. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetBooking = () => {
    setSelectedDate(null)
    setSelectedTime(null)
    setShowForm(false)
    setBookingComplete(false)
    setBookingError(null)
    setFormData({ name: '', email: '', phone: '', businessName: '' })
    setCurrentMonth(new Date())
  }

  // Check if we can go to previous month
  const today = new Date()
  const canGoPrev = currentMonth.getFullYear() > today.getFullYear() ||
    (currentMonth.getFullYear() === today.getFullYear() && currentMonth.getMonth() > today.getMonth())

  return (
    <div className="pt-32 pb-20">
      {/* Hero */}
      <section className="container-custom mb-8">
        <AnimatedSection className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-soft mb-4">
            Book a <span className="gradient-text">Free Consultation</span>
          </h1>
          <p className="text-lg text-soft-muted text-balance">
            30 minutes. No pressure. No pitch — just a conversation about what AI can do for your business.
          </p>
        </AnimatedSection>
      </section>

      {/* Calendar Section */}
      <section className="container-custom">
        <AnimatedSection>
          <div className="glass-card p-4 md:p-8 max-w-4xl mx-auto">
            {bookingComplete ? (
              /* Success State */
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-soft mb-2">You&apos;re Booked!</h3>
                <p className="text-soft-muted mb-2">
                  {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {selectedTime} EST
                </p>
                <p className="text-soft-muted text-sm mb-6">
                  We&apos;ll send a confirmation email to {formData.email} with the meeting details.
                </p>
                <button onClick={resetBooking} className="btn-secondary">
                  Book Another Time
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: Month Calendar */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-soft">Select a Date</h3>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={handlePrevMonth}
                        disabled={!canGoPrev}
                        className="p-2 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Previous month"
                      >
                        <IconChevronLeft />
                      </button>
                      <span className="text-soft font-medium min-w-[140px] text-center">
                        {formatMonthYear(currentMonth)}
                      </span>
                      <button
                        onClick={handleNextMonth}
                        className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                        aria-label="Next month"
                      >
                        <IconChevronRight />
                      </button>
                    </div>
                  </div>

                  {/* Day Names Header */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {DAY_NAMES.map(day => (
                      <div key={day} className="text-center text-xs font-medium text-soft-muted py-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {calendarGrid.slice(0, 35).map((date, index) => {
                      if (!date) {
                        return <div key={index} className="aspect-square" />
                      }

                      const past = isPast(date)
                      const available = isAvailableDay(date)
                      const hasSlots = hasAvailableSlots(date)
                      const isSelected = selectedDate && isSameDay(date, selectedDate)
                      const today = isToday(date)
                      const clickable = !past && available && hasSlots

                      return (
                        <button
                          key={index}
                          onClick={() => clickable && handleDateSelect(date)}
                          disabled={!clickable}
                          className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all relative
                            ${!clickable
                              ? 'text-soft-muted/40 cursor-not-allowed'
                              : isSelected
                                ? 'bg-accent text-white shadow-lg shadow-accent/30'
                                : 'text-soft hover:bg-accent/20 hover:text-accent'
                            }
                            ${today && !isSelected ? 'ring-2 ring-accent/50' : ''}
                          `}
                        >
                          {date.getDate()}
                          {clickable && !isSelected && (
                            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent" />
                          )}
                        </button>
                      )
                    })}
                  </div>

                  {/* Legend */}
                  <div className="mt-4 flex items-center gap-4 text-xs text-soft-muted">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                      <span>Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded ring-2 ring-accent/50 flex items-center justify-center text-[10px]">
                        {today.getDate()}
                      </div>
                      <span>Today</span>
                    </div>
                  </div>
                </div>

                {/* Right: Time Slots */}
                <div>
                  <h3 className="text-lg font-semibold text-soft mb-4">
                    {selectedDate
                      ? `Available Times for ${selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}`
                      : 'Select a date to see times'
                    }
                  </h3>

                  {selectedDate ? (
                    availableTimeSlots.length > 0 ? (
                      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                        {availableTimeSlots.map(slot => {
                          const isSelected = selectedTime === slot.time
                          return (
                            <button
                              key={slot.time}
                              onClick={() => handleTimeSelect(slot.time)}
                              className={`w-full py-3 px-4 rounded-lg text-left transition-all flex items-center justify-between
                                ${isSelected
                                  ? 'bg-accent text-white shadow-lg shadow-accent/30'
                                  : 'bg-accent/15 border border-accent/30 text-accent hover:bg-accent/25 hover:border-accent/50'
                                }
                              `}
                            >
                              <span className="font-medium">{slot.time}</span>
                              <span className={`text-sm ${isSelected ? 'text-white/90' : 'opacity-70'}`}>
                                {isSelected ? '✓ Selected' : 'Available'}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-soft-muted">
                        <p>No available times for this date.</p>
                        <p className="text-sm mt-2">Please select another date.</p>
                      </div>
                    )
                  ) : (
                    <div className="text-center py-12 text-soft-muted">
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                      </div>
                      <p>Select a date from the calendar</p>
                      <p className="text-sm mt-1">to view available time slots</p>
                    </div>
                  )}

                  {/* Time zone note */}
                  <p className="text-soft-muted text-xs mt-4 text-center">
                    All times shown in Eastern Time (EST)
                  </p>
                </div>
              </div>
            )}
          </div>
        </AnimatedSection>
      </section>

      {/* Booking Modal */}
      {showForm && selectedDate && selectedTime && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => {
            setShowForm(false)
            setSelectedTime(null)
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="glass-card p-6 md:p-8 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-soft mb-1">Complete Your Booking</h3>
                <p className="text-accent font-medium">
                  {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
                <p className="text-soft-muted text-sm">{selectedTime} EST</p>
              </div>
              <button
                onClick={() => {
                  setShowForm(false)
                  setSelectedTime(null)
                }}
                className="p-2 rounded-lg hover:bg-white/5 text-soft-muted hover:text-soft transition-colors"
              >
                <IconClose />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-navy-50 border border-white/10 text-soft placeholder-soft-muted/50 focus:outline-none focus:border-accent/50 transition-colors"
                placeholder="Name *"
                autoFocus
              />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-navy-50 border border-white/10 text-soft placeholder-soft-muted/50 focus:outline-none focus:border-accent/50 transition-colors"
                placeholder="Email *"
              />
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-navy-50 border border-white/10 text-soft placeholder-soft-muted/50 focus:outline-none focus:border-accent/50 transition-colors"
                placeholder="Phone *"
              />
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-navy-50 border border-white/10 text-soft placeholder-soft-muted/50 focus:outline-none focus:border-accent/50 transition-colors"
                placeholder="Business Name (optional)"
              />
              {bookingError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {bookingError}
                </div>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full !py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Booking...
                  </span>
                ) : (
                  'Confirm Booking'
                )}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

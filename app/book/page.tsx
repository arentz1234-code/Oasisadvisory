'use client'

import { useRef, useState, useMemo } from 'react'
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

const IconEmail = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
)

const IconCheck = () => (
  <svg className="w-5 h-5 text-accent flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
)

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

// Get the start of the current week (Sunday)
function getWeekStart(date: Date) {
  const d = new Date(date)
  const day = d.getDay()
  d.setDate(d.getDate() - day)
  d.setHours(0, 0, 0, 0)
  return d
}

// Get 2 weeks of dates starting from current week
function getCalendarDates(weekOffset: number = 0) {
  const today = new Date()
  const weekStart = getWeekStart(today)
  weekStart.setDate(weekStart.getDate() + (weekOffset * 7))

  const dates: Date[] = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart)
    date.setDate(weekStart.getDate() + i)
    dates.push(date)
  }
  return dates
}

function formatMonthYear(date: Date) {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

function formatDayName(date: Date) {
  return date.toLocaleDateString('en-US', { weekday: 'short' })
}

function formatDayNumber(date: Date) {
  return date.getDate()
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

function isWeekend(date: Date) {
  const day = date.getDay()
  return day === 0 || day === 6
}

const expectations = [
  'A friendly, no-pressure conversation',
  'Understanding of your current challenges',
  'Initial assessment of AI opportunities',
  'Clear next steps (if there\'s a fit)',
]

export default function BookPage() {
  const [weekOffset, setWeekOffset] = useState(0)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [bookingComplete, setBookingComplete] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '' })

  const calendarDates = useMemo(() => getCalendarDates(weekOffset), [weekOffset])
  const currentMonth = formatMonthYear(calendarDates[3]) // Middle of week for month name

  const handleDateSelect = (date: Date) => {
    if (isPast(date) || isWeekend(date)) return
    setSelectedDate(date)
    setSelectedTime(null)
    setShowForm(false)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    setShowForm(true)
  }

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [meetLink, setMeetLink] = useState<string | null>(null)
  const [bookingError, setBookingError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setBookingError(null)

    try {
      const response = await fetch('/api/book', {
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

      setMeetLink(data.meetLink)
      setBookingComplete(true)
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
    setMeetLink(null)
    setBookingError(null)
    setFormData({ name: '', email: '', company: '', message: '' })
  }

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
          <div className="glass-card p-4 md:p-6 max-w-5xl mx-auto">
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
                {meetLink ? (
                  <div className="mb-6">
                    <p className="text-soft-muted text-sm mb-3">
                      Your Google Meet link:
                    </p>
                    <a
                      href={meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 rounded-lg text-accent hover:bg-accent/20 transition-colors"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C6.48 0 2 4.48 2 10c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 18.16 22 14.42 22 10 22 4.48 17.52 0 12 0z"/>
                      </svg>
                      Join Google Meet
                    </a>
                    <p className="text-soft-muted text-xs mt-3">
                      A calendar invite has been sent to your email.
                    </p>
                  </div>
                ) : (
                  <p className="text-soft-muted text-sm mb-6">
                    We&apos;ll send a confirmation email with the meeting link shortly.
                  </p>
                )}
                <button onClick={resetBooking} className="btn-secondary">
                  Book Another Time
                </button>
              </div>
            ) : (
              <>
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-soft">{currentMonth}</h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setWeekOffset(Math.max(0, weekOffset - 1))}
                      disabled={weekOffset === 0}
                      className="p-2 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      aria-label="Previous week"
                    >
                      <IconChevronLeft />
                    </button>
                    <button
                      onClick={() => setWeekOffset(0)}
                      className="px-3 py-1 text-sm text-accent hover:bg-accent/10 rounded-lg transition-colors"
                    >
                      Today
                    </button>
                    <button
                      onClick={() => setWeekOffset(Math.min(1, weekOffset + 1))}
                      disabled={weekOffset >= 1}
                      className="p-2 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      aria-label="Next week"
                    >
                      <IconChevronRight />
                    </button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-8 gap-px bg-white/5 rounded-lg overflow-hidden">
                  {/* Time column header */}
                  <div className="bg-navy p-2 text-center">
                    <span className="text-xs text-soft-muted">EST</span>
                  </div>

                  {/* Day headers */}
                  {calendarDates.map((date, i) => {
                    const weekend = isWeekend(date)
                    const today = isToday(date)
                    const selected = selectedDate && isSameDay(date, selectedDate)

                    return (
                      <div
                        key={i}
                        className={`bg-navy p-2 text-center ${weekend ? 'opacity-40' : ''}`}
                      >
                        <div className="text-xs text-soft-muted uppercase tracking-wider">
                          {formatDayName(date)}
                        </div>
                        <div
                          className={`text-lg font-semibold mt-1 w-8 h-8 mx-auto flex items-center justify-center rounded-full
                            ${today ? 'bg-accent text-white' : ''}
                            ${selected && !today ? 'bg-accent/20 text-accent' : ''}
                            ${!today && !selected ? 'text-soft' : ''}
                          `}
                        >
                          {formatDayNumber(date)}
                        </div>
                      </div>
                    )
                  })}

                  {/* Time slots */}
                  {timeSlots.map((slot, slotIndex) => (
                    <>
                      {/* Time label */}
                      <div key={`time-${slotIndex}`} className="bg-navy p-2 text-right pr-3 border-t border-white/5">
                        <span className="text-xs text-soft-muted">{slot.time}</span>
                      </div>

                      {/* Day cells */}
                      {calendarDates.map((date, dayIndex) => {
                        const weekend = isWeekend(date)
                        const past = isPast(date)
                        const disabled = weekend || past
                        const selected = selectedDate && isSameDay(date, selectedDate)
                        const timeSelected = selected && selectedTime === slot.time

                        return (
                          <div
                            key={`${slotIndex}-${dayIndex}`}
                            className={`bg-navy border-t border-white/5 p-1
                              ${disabled ? 'opacity-30' : ''}
                            `}
                          >
                            {!disabled && (
                              <button
                                onClick={() => {
                                  handleDateSelect(date)
                                  handleTimeSelect(slot.time)
                                }}
                                className={`w-full h-full min-h-[32px] rounded text-xs transition-all
                                  ${timeSelected
                                    ? 'bg-accent text-white'
                                    : 'hover:bg-accent/20 text-transparent hover:text-accent'
                                  }
                                `}
                              >
                                {timeSelected ? slot.time : 'Select'}
                              </button>
                            )}
                          </div>
                        )
                      })}
                    </>
                  ))}
                </div>

                {/* Selected Time & Form */}
                {showForm && selectedDate && selectedTime && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 pt-6 border-t border-white/10"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Selected info */}
                      <div className="bg-accent/5 border border-accent/20 rounded-xl p-4">
                        <h3 className="font-semibold text-soft mb-2">Selected Time</h3>
                        <p className="text-accent text-lg font-medium">
                          {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </p>
                        <p className="text-soft-muted">{selectedTime} EST</p>
                        <button
                          onClick={() => {
                            setShowForm(false)
                            setSelectedTime(null)
                          }}
                          className="mt-3 text-sm text-soft-muted hover:text-accent transition-colors"
                        >
                          Change time
                        </button>
                      </div>

                      {/* Form */}
                      <form onSubmit={handleSubmit} className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="px-4 py-2.5 rounded-lg bg-navy-50 border border-white/10 text-soft placeholder-soft-muted/50 focus:outline-none focus:border-accent/50 transition-colors text-sm"
                            placeholder="Name *"
                          />
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="px-4 py-2.5 rounded-lg bg-navy-50 border border-white/10 text-soft placeholder-soft-muted/50 focus:outline-none focus:border-accent/50 transition-colors text-sm"
                            placeholder="Email *"
                          />
                        </div>
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg bg-navy-50 border border-white/10 text-soft placeholder-soft-muted/50 focus:outline-none focus:border-accent/50 transition-colors text-sm"
                          placeholder="Company (optional)"
                        />
                        <textarea
                          rows={2}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg bg-navy-50 border border-white/10 text-soft placeholder-soft-muted/50 focus:outline-none focus:border-accent/50 transition-colors resize-none text-sm"
                          placeholder="What would you like to discuss? (optional)"
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
                              Creating Google Meet...
                            </span>
                          ) : (
                            'Confirm Booking'
                          )}
                        </button>
                      </form>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </AnimatedSection>

        {/* Info below calendar */}
        <AnimatedSection className="mt-8 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            {[
              { icon: '🕐', text: '30 minutes' },
              { icon: '📹', text: 'Video call' },
              { icon: '💰', text: '100% free' },
              { icon: '📧', text: 'oasisadvisoryteam@gmail.com' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-center gap-2 text-soft-muted text-sm">
                <span>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>
    </div>
  )
}

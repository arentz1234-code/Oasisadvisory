'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function CancelPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [status, setStatus] = useState<'loading' | 'success' | 'already' | 'error'>('loading')
  const [booking, setBooking] = useState<{ name: string; date: string; time: string } | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setError('No cancellation token provided')
      return
    }

    const cancelBooking = async () => {
      try {
        const response = await fetch(`/api/cancel?token=${token}`)
        const data = await response.json()

        if (data.success) {
          setStatus('success')
          setBooking(data.booking)
        } else if (data.message?.includes('already been cancelled')) {
          setStatus('already')
          setBooking(data.booking)
        } else {
          setStatus('error')
          setError(data.error || 'Failed to cancel booking')
        }
      } catch {
        setStatus('error')
        setError('Failed to cancel booking. Please try again.')
      }
    }

    cancelBooking()
  }, [token])

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-navy">
      <div className="glass-card p-8 w-full max-w-md text-center">
        {status === 'loading' && (
          <>
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-accent animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-soft mb-2">Cancelling Booking...</h1>
            <p className="text-soft-muted">Please wait while we process your request.</p>
          </>
        )}

        {status === 'success' && booking && (
          <>
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-soft mb-2">Booking Cancelled</h1>
            <p className="text-soft-muted mb-4">
              Your consultation has been cancelled successfully.
            </p>
            <div className="bg-white/5 rounded-lg p-4 mb-6">
              <p className="text-soft font-medium">{formatDate(booking.date)}</p>
              <p className="text-soft-muted">{booking.time} EST</p>
            </div>
            <p className="text-soft-muted text-sm mb-6">
              Changed your mind? Feel free to book a new consultation anytime.
            </p>
            <Link href="/book" className="btn-primary">
              Book New Consultation
            </Link>
          </>
        )}

        {status === 'already' && booking && (
          <>
            <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-soft mb-2">Already Cancelled</h1>
            <p className="text-soft-muted mb-6">
              This booking was already cancelled.
            </p>
            <Link href="/book" className="btn-primary">
              Book New Consultation
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-soft mb-2">Unable to Cancel</h1>
            <p className="text-soft-muted mb-6">{error}</p>
            <div className="space-y-3">
              <Link href="/book" className="btn-primary block">
                Book New Consultation
              </Link>
              <Link href="/" className="text-soft-muted hover:text-accent text-sm transition-colors block">
                Return to Homepage
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

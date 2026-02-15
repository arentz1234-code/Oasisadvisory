'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

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
  const [isLoading, setIsLoading] = useState(false)
  const [authToken, setAuthToken] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')

    // Test the password by trying to fetch bookings
    try {
      const response = await fetch('/api/bookings', {
        headers: { 'Authorization': `Bearer ${password}` }
      })

      if (response.ok) {
        setAuthToken(password)
        setIsLoggedIn(true)
        const data = await response.json()
        setBookings(data.bookings || [])
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
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
    } finally {
      setIsLoading(false)
    }
  }

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

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-soft mb-2">Admin Login</h1>
            <p className="text-soft-muted text-sm">Enter your admin password to continue</p>
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

          <p className="text-soft-muted/50 text-xs text-center mt-6">
            Default password: oasis2024
          </p>
        </motion.div>
      </div>
    )
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container-custom">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-soft">Bookings Dashboard</h1>
            <p className="text-soft-muted">{bookings.length} total bookings</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchBookings}
              disabled={isLoading}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors text-soft-muted hover:text-accent disabled:opacity-50"
              title="Refresh"
            >
              <IconRefresh />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/5 transition-colors text-soft-muted hover:text-red-400"
            >
              <IconLogout />
              Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Pending', count: bookings.filter(b => b.status === 'pending').length, color: 'text-yellow-400' },
            { label: 'Confirmed', count: bookings.filter(b => b.status === 'confirmed').length, color: 'text-blue-400' },
            { label: 'Completed', count: bookings.filter(b => b.status === 'completed').length, color: 'text-green-400' },
            { label: 'Cancelled', count: bookings.filter(b => b.status === 'cancelled').length, color: 'text-red-400' },
          ].map((stat, i) => (
            <div key={i} className="glass-card p-4 text-center">
              <div className={`text-3xl font-bold ${stat.color}`}>{stat.count}</div>
              <div className="text-soft-muted text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Bookings Table */}
        <div className="glass-card overflow-hidden">
          {bookings.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-soft-muted">No bookings yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left p-4 text-soft-muted text-sm font-medium">Date/Time</th>
                    <th className="text-left p-4 text-soft-muted text-sm font-medium">Contact</th>
                    <th className="text-left p-4 text-soft-muted text-sm font-medium">Business</th>
                    <th className="text-left p-4 text-soft-muted text-sm font-medium">Status</th>
                    <th className="text-left p-4 text-soft-muted text-sm font-medium">Booked</th>
                    <th className="text-right p-4 text-soft-muted text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="p-4">
                        <div className="text-soft font-medium">{formatDate(booking.date)}</div>
                        <div className="text-soft-muted text-sm">{booking.time} EST</div>
                      </td>
                      <td className="p-4">
                        <div className="text-soft font-medium">{booking.name}</div>
                        <div className="text-soft-muted text-sm">{booking.email}</div>
                        <div className="text-soft-muted text-sm">{booking.phone}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-soft">{booking.businessName || '-'}</div>
                      </td>
                      <td className="p-4">
                        <select
                          value={booking.status}
                          onChange={(e) => updateStatus(booking.id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-xs font-medium border bg-transparent cursor-pointer ${statusColors[booking.status]}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <div className="text-soft-muted text-sm">{formatCreatedAt(booking.createdAt)}</div>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => deleteBooking(booking.id)}
                          className="p-2 rounded-lg hover:bg-red-500/10 text-soft-muted hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <IconTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

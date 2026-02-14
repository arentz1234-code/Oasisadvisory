'use client'

import Link from 'next/link'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function Logo({ className = '', size = 'md' }: LogoProps) {
  const sizes = {
    sm: { ring: 'w-8 h-8', text: 'text-lg', sub: 'text-xs' },
    md: { ring: 'w-10 h-10', text: 'text-xl', sub: 'text-sm' },
    lg: { ring: 'w-14 h-14', text: 'text-2xl', sub: 'text-base' },
  }

  const { ring, text, sub } = sizes[size]

  return (
    <Link
      href="/"
      className={`flex items-center gap-3 group ${className}`}
      aria-label="Oasis Advisory - Home"
    >
      {/* Logo Ring - Matching the blue gradient circle from the logo */}
      <div className={`${ring} relative flex-shrink-0`}>
        <div className="absolute inset-0 rounded-full logo-ring opacity-90 group-hover:opacity-100 transition-opacity" />
        <div className="absolute inset-[3px] rounded-full bg-navy" />
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent-400/20 to-transparent" />
      </div>

      {/* Logo Text */}
      <div className="flex flex-col leading-none">
        <span className={`${text} font-bold text-accent group-hover:text-accent-light transition-colors tracking-wide`}>
          OASIS
        </span>
        <span className={`${sub} font-medium text-soft-muted group-hover:text-soft transition-colors tracking-[0.2em]`}>
          ADVISORY
        </span>
      </div>
    </Link>
  )
}

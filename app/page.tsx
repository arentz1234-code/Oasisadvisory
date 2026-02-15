'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'

// Animation variants
const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
}

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8 }
  }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
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

// Animated AI Graphic Component
function AnimatedAIGraphic() {
  return (
    <div className="relative w-full max-w-lg mx-auto aspect-square">
      {/* Central brain/node */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-gradient-to-br from-accent to-accent-600 shadow-lg shadow-accent/30"
        animate={{
          scale: [1, 1.05, 1],
          boxShadow: [
            '0 0 20px rgba(59, 130, 246, 0.3)',
            '0 0 40px rgba(59, 130, 246, 0.5)',
            '0 0 20px rgba(59, 130, 246, 0.3)',
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
          </svg>
        </div>
      </motion.div>

      {/* Orbiting rings */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border border-accent/20"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-accent/15"
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-accent/10"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      />

      {/* Floating nodes */}
      {[
        { x: '20%', y: '20%', delay: 0, icon: 'chart' },
        { x: '75%', y: '25%', delay: 0.5, icon: 'mail' },
        { x: '85%', y: '60%', delay: 1, icon: 'clock' },
        { x: '70%', y: '80%', delay: 1.5, icon: 'users' },
        { x: '25%', y: '75%', delay: 2, icon: 'doc' },
        { x: '10%', y: '45%', delay: 2.5, icon: 'chat' },
      ].map((node, i) => (
        <motion.div
          key={i}
          className="absolute w-12 h-12 rounded-xl bg-navy-50 border border-accent/20 flex items-center justify-center text-accent shadow-lg"
          style={{ left: node.x, top: node.y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [0, -8, 0],
          }}
          transition={{
            opacity: { delay: node.delay, duration: 0.5 },
            scale: { delay: node.delay, duration: 0.5 },
            y: { delay: node.delay + 0.5, duration: 3, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          {node.icon === 'chart' && (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
          )}
          {node.icon === 'mail' && (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          )}
          {node.icon === 'clock' && (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {node.icon === 'users' && (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          )}
          {node.icon === 'doc' && (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          )}
          {node.icon === 'chat' && (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
          )}
        </motion.div>
      ))}

      {/* Connecting lines (animated dashes) */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0)" />
            <stop offset="50%" stopColor="rgba(59, 130, 246, 0.5)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
          </linearGradient>
        </defs>
        {[
          { x1: 80, y1: 80, x2: 180, y2: 180 },
          { x1: 300, y1: 100, x2: 220, y2: 180 },
          { x1: 340, y1: 240, x2: 220, y2: 200 },
          { x1: 280, y1: 320, x2: 200, y2: 220 },
          { x1: 100, y1: 300, x2: 180, y2: 220 },
          { x1: 40, y1: 180, x2: 180, y2: 200 },
        ].map((line, i) => (
          <motion.line
            key={i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="url(#lineGradient)"
            strokeWidth="1"
            strokeDasharray="5 5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: i * 0.3, duration: 1 }}
          />
        ))}
      </svg>
    </div>
  )
}

// Pain Points Component
function PainPoints() {
  const painPoints = [
    'Spending hours on repetitive tasks',
    'Losing customers to slow response times',
    'Watching competitors pull ahead with AI',
    'Feeling overwhelmed by new technology',
  ]

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="space-y-3"
    >
      {painPoints.map((point, i) => (
        <motion.div
          key={i}
          variants={fadeUpVariants}
          className="flex items-center gap-3 text-soft-muted"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-red-400/60 flex-shrink-0" />
          <span className="text-sm md:text-base">{point}</span>
        </motion.div>
      ))}
    </motion.div>
  )
}

// Icons
const IconStrategy = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
  </svg>
)

const IconImplement = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
  </svg>
)

const IconIntegration = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z" />
  </svg>
)

const IconSupport = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
  </svg>
)

const services = [
  {
    icon: IconStrategy,
    title: 'AI Strategy & Audit',
    description: 'We assess your current workflows and identify where AI can have the highest impact.',
  },
  {
    icon: IconImplement,
    title: 'Custom AI Implementation',
    description: 'From chatbots to automation pipelines, we build and deploy AI tools tailored to your business.',
  },
  {
    icon: IconIntegration,
    title: 'Tool Selection & Integration',
    description: 'We help you choose the right AI tools and integrate them into your existing tech stack.',
  },
  {
    icon: IconSupport,
    title: 'Training & Support',
    description: 'We train your team to use AI confidently and provide ongoing support as you scale.',
  },
]

// Hero Section with Problem/Solution narrative
function HeroSection() {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 150])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-50" aria-hidden="true" />

      {/* Animated Gradient Orb */}
      <motion.div
        className="absolute w-[600px] h-[600px] gradient-orb left-1/4 top-1/3"
        style={{ y }}
        aria-hidden="true"
      />

      {/* Content */}
      <motion.div
        className="container-custom relative z-10"
        style={{ opacity }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Problem/Solution Text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              AI Consulting for Small Business
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-soft leading-tight mb-6"
            >
              Your competitors are using AI.{' '}
              <span className="gradient-text">Are you?</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6"
            >
              <p className="text-soft-muted text-lg mb-4">
                Small businesses are falling behind because AI feels too complex, too expensive, or too risky. Sound familiar?
              </p>
              <PainPoints />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="p-4 rounded-xl bg-accent/5 border border-accent/20 mb-8"
            >
              <p className="text-soft font-medium">
                We make AI simple. We find the quick wins, build the tools, and train your team — so you can focus on running your business.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/book" className="btn-primary inline-block text-center">
                Book a Free Consultation
              </Link>
              <Link href="/services" className="btn-secondary inline-block text-center">
                See How We Help
              </Link>
            </motion.div>
          </div>

          {/* Right: Animated AI Graphic */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block"
          >
            <AnimatedAIGraphic />
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        aria-hidden="true"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-soft-muted/30 flex items-start justify-center p-2"
        >
          <motion.div
            className="w-1 h-2 bg-accent rounded-full"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  )
}

// Stats Section
function StatsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const stats = [
    { value: '40%', label: 'Average time saved on repetitive tasks' },
    { value: '3x', label: 'Faster customer response times' },
    { value: '100%', label: 'Free initial consultation' },
  ]

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.02] to-transparent" aria-hidden="true" />

      <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={staggerContainer}
        className="container-custom"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              variants={fadeUpVariants}
              className="text-center"
            >
              <motion.div
                className="text-4xl md:text-5xl font-bold gradient-text mb-2"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: i * 0.2, duration: 0.5, type: 'spring' }}
              >
                {stat.value}
              </motion.div>
              <p className="text-soft-muted text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

// Services Preview Section
function ServicesPreview() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="section-padding relative">
      <div className="container-custom">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-soft mb-4">
            What We Do
          </h2>
          <p className="text-soft-muted max-w-2xl mx-auto">
            From strategy to implementation, we handle the technical complexity so you get results.
          </p>
          <div className="w-16 h-1 bg-accent mx-auto rounded-full mt-6" />
        </AnimatedSection>

        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={fadeUpVariants}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="glass-card glow-border p-8 group cursor-default"
            >
              <motion.div
                className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-6"
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(59, 130, 246, 0.2)' }}
                transition={{ duration: 0.2 }}
              >
                <service.icon />
              </motion.div>
              <h3 className="text-xl font-semibold text-soft mb-3">
                {service.title}
              </h3>
              <p className="text-soft-muted text-sm leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <AnimatedSection className="text-center mt-12">
          <Link href="/services" className="btn-secondary inline-block">
            Learn More About Our Services
          </Link>
        </AnimatedSection>
      </div>
    </section>
  )
}

// How It Works Section
const steps = [
  {
    number: '01',
    title: 'Discovery Call',
    description: 'We learn about your business, goals, and pain points — no pressure, no pitch.',
  },
  {
    number: '02',
    title: 'Custom Roadmap',
    description: 'We build a tailored AI implementation plan with clear ROI projections.',
  },
  {
    number: '03',
    title: 'Build & Launch',
    description: 'We implement, test, and launch — then train your team to use it confidently.',
  },
]

function HowItWorks() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/[0.02] to-transparent" aria-hidden="true" />

      <div className="container-custom relative">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-soft mb-4">
            How It Works
          </h2>
          <p className="text-soft-muted max-w-2xl mx-auto">
            Getting started is simple. Here&apos;s what to expect.
          </p>
          <div className="w-16 h-1 bg-accent mx-auto rounded-full mt-6" />
        </AnimatedSection>

        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="relative"
        >
          {/* Connecting line - desktop */}
          <div className="hidden lg:block absolute top-[60px] left-[16.67%] right-[16.67%] h-[2px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" aria-hidden="true" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={fadeUpVariants}
                className="relative text-center"
              >
                <motion.div
                  className="relative inline-flex items-center justify-center mb-6"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-6xl md:text-7xl font-bold text-accent/20">
                    {step.number}
                  </span>
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ delay: index * 0.2 + 0.3, type: 'spring' }}
                  >
                    <div className="w-4 h-4 bg-accent rounded-full shadow-lg shadow-accent/50" />
                  </motion.div>
                </motion.div>

                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center my-4" aria-hidden="true">
                    <motion.svg
                      className="w-6 h-6 text-accent/30"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      animate={{ y: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </motion.svg>
                  </div>
                )}

                <h3 className="text-xl font-semibold text-soft mb-3">
                  {step.title}
                </h3>
                <p className="text-soft-muted text-sm max-w-xs mx-auto">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <AnimatedSection className="text-center mt-16">
          <Link href="/book" className="btn-primary inline-block">
            Start Your Journey
          </Link>
        </AnimatedSection>
      </div>
    </section>
  )
}

// CTA Section
function CTASection() {
  return (
    <section className="section-padding relative">
      <div className="absolute inset-0 bg-gradient-to-t from-accent/[0.03] to-transparent" aria-hidden="true" />

      <div className="container-custom relative">
        <AnimatedSection className="glass-card p-12 md:p-16 text-center max-w-4xl mx-auto relative overflow-hidden">
          {/* Decorative elements */}
          <motion.div
            className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-accent/10 blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
            aria-hidden="true"
          />
          <motion.div
            className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-accent/10 blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
            transition={{ duration: 4, repeat: Infinity }}
            aria-hidden="true"
          />

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-soft mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-soft-muted max-w-xl mx-auto mb-8">
              Book a free 30-minute consultation. No pressure, no pitch — just a conversation about what AI can do for your business.
            </p>
            <Link href="/book" className="btn-primary inline-block">
              Book a Free Consultation
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <ServicesPreview />
      <HowItWorks />
      <CTASection />
    </>
  )
}

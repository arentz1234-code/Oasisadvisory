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

// Hero Section
function HeroSection() {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 150])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-50" aria-hidden="true" />

      {/* Animated Gradient Orb */}
      <motion.div
        className="absolute w-[600px] h-[600px] gradient-orb"
        style={{ y }}
        aria-hidden="true"
      />

      {/* Secondary orb */}
      <motion.div
        className="absolute w-[300px] h-[300px] -right-20 top-1/4 gradient-orb opacity-40"
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <motion.div
        className="container-custom relative z-10 text-center"
        style={{ opacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-soft leading-tight mb-6 text-balance">
            AI Solutions for{' '}
            <span className="gradient-text">Small Business</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-lg md:text-xl text-soft-muted max-w-2xl mx-auto mb-10 text-balance"
        >
          We help small businesses implement AI tools that save time, reduce costs,
          and scale operations — without the enterprise price tag.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link href="/book" className="btn-primary inline-block">
            Book a Free Consultation
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
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
          <div className="w-16 h-1 bg-accent mx-auto rounded-full" />
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
              className="glass-card glow-border p-8 group cursor-default transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-6 group-hover:bg-accent/20 transition-colors">
                <service.icon />
              </div>
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
    description: 'We learn about your business, goals, and pain points.',
  },
  {
    number: '02',
    title: 'Custom Roadmap',
    description: 'We build a tailored AI implementation plan with clear ROI.',
  },
  {
    number: '03',
    title: 'Build & Launch',
    description: 'We implement, test, and launch — then train your team.',
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
          <div className="w-16 h-1 bg-accent mx-auto rounded-full" />
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
                <div className="relative inline-flex items-center justify-center mb-6">
                  <span className="text-6xl md:text-7xl font-bold text-accent/20">
                    {step.number}
                  </span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 bg-accent rounded-full shadow-lg shadow-accent/50" />
                  </div>
                </div>

                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center my-4" aria-hidden="true">
                    <svg className="w-6 h-6 text-accent/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
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
        <AnimatedSection className="glass-card p-12 md:p-16 text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-soft mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-soft-muted max-w-xl mx-auto mb-8">
            Book a free 30-minute consultation. No pressure, no pitch — just a conversation about what AI can do for your business.
          </p>
          <Link href="/book" className="btn-primary inline-block">
            Book a Free Consultation
          </Link>
        </AnimatedSection>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <HeroSection />
      <ServicesPreview />
      <HowItWorks />
      <CTASection />
    </>
  )
}

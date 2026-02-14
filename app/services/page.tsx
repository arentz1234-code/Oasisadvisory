'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'

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
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
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
  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
  </svg>
)

const IconImplement = () => (
  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
  </svg>
)

const IconIntegration = () => (
  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z" />
  </svg>
)

const IconSupport = () => (
  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
  </svg>
)

const IconCheck = () => (
  <svg className="w-5 h-5 text-accent flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
)

const services = [
  {
    icon: IconStrategy,
    title: 'AI Strategy & Audit',
    description: 'We assess your current workflows and identify where AI can have the highest impact on your business.',
    features: [
      'Comprehensive workflow analysis',
      'AI opportunity identification',
      'ROI projections and prioritization',
      'Technology stack assessment',
      'Competitive landscape review',
    ],
  },
  {
    icon: IconImplement,
    title: 'Custom AI Implementation',
    description: 'From chatbots to automation pipelines, we build and deploy AI tools tailored to your specific business needs.',
    features: [
      'Custom chatbot development',
      'Process automation pipelines',
      'AI-powered analytics dashboards',
      'Document processing systems',
      'Predictive modeling solutions',
    ],
  },
  {
    icon: IconIntegration,
    title: 'Tool Selection & Integration',
    description: 'We help you choose the right AI tools and seamlessly integrate them into your existing tech stack.',
    features: [
      'Vendor evaluation and selection',
      'API integrations',
      'Data pipeline setup',
      'Legacy system compatibility',
      'Security and compliance review',
    ],
  },
  {
    icon: IconSupport,
    title: 'Training & Support',
    description: 'We train your team to use AI confidently and provide ongoing support as you scale.',
    features: [
      'Team training workshops',
      'Documentation and playbooks',
      'Ongoing technical support',
      'Performance monitoring',
      'Quarterly strategy reviews',
    ],
  },
]

export default function ServicesPage() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <div className="pt-32 pb-20">
      {/* Hero */}
      <section className="container-custom mb-20">
        <AnimatedSection className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-soft mb-6">
            Our <span className="gradient-text">Services</span>
          </h1>
          <p className="text-lg md:text-xl text-soft-muted text-balance">
            Comprehensive AI solutions designed specifically for small businesses.
            No enterprise complexity, no unnecessary features — just what you need to grow.
          </p>
        </AnimatedSection>
      </section>

      {/* Services Grid */}
      <section className="container-custom">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="space-y-8"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={fadeUpVariants}
              className="glass-card glow-border p-8 md:p-10 lg:p-12"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Left: Icon, Title, Description */}
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-6">
                    <service.icon />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-soft mb-4">
                    {service.title}
                  </h2>
                  <p className="text-soft-muted leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Right: Features */}
                <div>
                  <h3 className="text-sm font-semibold text-accent uppercase tracking-wider mb-4">
                    What&apos;s Included
                  </h3>
                  <ul className="space-y-3">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <IconCheck />
                        <span className="text-soft-muted">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="container-custom mt-20">
        <AnimatedSection className="glass-card p-12 md:p-16 text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-soft mb-4">
            Not Sure Where to Start?
          </h2>
          <p className="text-soft-muted max-w-xl mx-auto mb-8">
            Book a free discovery call and we&apos;ll help you identify the best opportunities
            for AI in your business.
          </p>
          <Link href="/book" className="btn-primary inline-block">
            Book a Free Consultation
          </Link>
        </AnimatedSection>
      </section>
    </div>
  )
}

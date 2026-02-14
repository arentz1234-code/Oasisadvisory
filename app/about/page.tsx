'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
    transition: { staggerChildren: 0.2, delayChildren: 0.1 }
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

const IconLinkedIn = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const team = [
  {
    name: 'Andrew Rentz',
    role: 'Business Strategy & Client Relations',
    image: '/andrew.png',
    bio: 'Andrew brings a unique combination of business acumen and technical understanding to Oasis Advisory. With a Finance degree from Auburn University\'s Harbert College of Business, he bridges the gap between AI capabilities and real business outcomes. As Founder and Chief Pilot of Southland Aerials, a commercial drone imaging company, Andrew understands the challenges small business owners face and the transformative potential of emerging technology. Based in Auburn, AL, he\'s passionate about making AI accessible to businesses that don\'t have enterprise budgets.',
    linkedin: 'https://www.linkedin.com/in/andrew-rentz/',
    credentials: [
      'Auburn University, Harbert College of Business - Finance',
      'Founder & Chief Pilot, Southland Aerials',
      'Certified Flight Instructor (CFI/CFII)',
    ],
  },
  {
    name: 'Charlie Knott',
    role: 'AI Engineering & Technical Implementation',
    image: '/charlie.png',
    bio: 'Charlie is the technical powerhouse behind Oasis Advisory\'s AI implementations. Currently pursuing his Master\'s in Information Technology Strategy (MITS) at Carnegie Mellon University with a focus on machine learning, he brings cutting-edge AI knowledge directly from one of the world\'s top programs. His experience at UltronAI, where he worked on retail computer vision and product recognition systems, gives him hands-on expertise in deploying AI solutions that deliver measurable results. Charlie and Andrew met at Auburn University, where their shared vision for making AI accessible to small businesses planted the seed for Oasis Advisory.',
    linkedin: 'https://www.linkedin.com/in/charlieknott/',
    credentials: [
      'Carnegie Mellon University - MITS, Machine Learning',
      'Auburn University Alumni',
      'Former AI Engineer, UltronAI',
    ],
  },
]

export default function AboutPage() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <div className="pt-32 pb-20">
      {/* Hero */}
      <section className="container-custom mb-20">
        <AnimatedSection className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-soft mb-6">
            Meet the <span className="gradient-text">Team</span>
          </h1>
          <p className="text-lg md:text-xl text-soft-muted text-balance">
            We&apos;re two Auburn grads who believe small businesses deserve access to the same
            AI tools that Fortune 500 companies use — without the Fortune 500 price tag.
          </p>
        </AnimatedSection>
      </section>

      {/* Our Story */}
      <section className="container-custom mb-20">
        <AnimatedSection className="glass-card p-8 md:p-12 max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-soft mb-6 text-center">
            Our Story
          </h2>
          <div className="prose prose-invert max-w-none text-soft-muted leading-relaxed space-y-4">
            <p>
              Oasis Advisory was born from a simple observation: small businesses are being left behind
              in the AI revolution. While large enterprises deploy sophisticated AI systems to automate
              workflows, analyze data, and serve customers, most small businesses are still figuring out
              where to start.
            </p>
            <p>
              We met at Auburn University — Andrew studying finance at the Harbert College of Business,
              Charlie diving deep into technology. After graduation, our paths took us in different
              directions: Andrew built Southland Aerials, learning firsthand the challenges of running
              a small business, while Charlie pursued advanced AI studies at Carnegie Mellon and gained
              real-world experience deploying computer vision systems at UltronAI.
            </p>
            <p>
              But we stayed connected, and we kept coming back to the same conversation: why is it so
              hard for small businesses to benefit from AI? The tools exist. The technology is mature.
              What&apos;s missing is a bridge — someone who understands both the technology and the
              reality of running a small business.
            </p>
            <p>
              That&apos;s Oasis Advisory. We&apos;re here to be that bridge.
            </p>
          </div>
        </AnimatedSection>
      </section>

      {/* Team Cards */}
      <section className="container-custom">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {team.map((member, index) => (
            <motion.div
              key={index}
              variants={fadeUpVariants}
              className="glass-card glow-border overflow-hidden"
            >
              {/* Header with avatar */}
              <div className="p-8 pb-0">
                <div className="flex items-start gap-6">
                  {/* Avatar */}
                  <div className="w-24 h-24 flex-shrink-0 rounded-full overflow-hidden bg-gradient-to-br from-accent/20 to-accent/5 border-2 border-accent/20">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-3xl font-bold text-accent">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Name and role */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-soft mb-1">
                      {member.name}
                    </h3>
                    <p className="text-accent font-medium mb-3">
                      {member.role}
                    </p>
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-soft-muted hover:text-accent transition-colors text-sm"
                    >
                      <IconLinkedIn />
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="p-8 pt-6">
                <p className="text-soft-muted leading-relaxed mb-6">
                  {member.bio}
                </p>

                {/* Credentials */}
                <div className="pt-6 border-t border-white/5">
                  <h4 className="text-xs font-semibold text-accent uppercase tracking-wider mb-3">
                    Background
                  </h4>
                  <ul className="space-y-2">
                    {member.credentials.map((credential, credIndex) => (
                      <li key={credIndex} className="text-soft-muted text-sm flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent/50 mt-2 flex-shrink-0" />
                        {credential}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Values */}
      <section className="container-custom mt-20">
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-soft mb-4">
            What We Believe
          </h2>
          <div className="w-16 h-1 bg-accent mx-auto rounded-full" />
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              title: 'AI Should Be Accessible',
              description: 'Every business, regardless of size, should have access to AI tools that can transform their operations.',
            },
            {
              title: 'Results Over Hype',
              description: 'We focus on practical implementations that deliver measurable ROI, not flashy demos that never ship.',
            },
            {
              title: 'Partnership, Not Just Projects',
              description: 'We succeed when you succeed. That means ongoing support, training, and strategy — not just one-time deployments.',
            },
          ].map((value, index) => (
            <AnimatedSection key={index} className="glass-card p-8 text-center">
              <h3 className="text-xl font-semibold text-soft mb-3">{value.title}</h3>
              <p className="text-soft-muted text-sm leading-relaxed">{value.description}</p>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-custom mt-20">
        <AnimatedSection className="glass-card p-12 md:p-16 text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-soft mb-4">
            Let&apos;s Work Together
          </h2>
          <p className="text-soft-muted max-w-xl mx-auto mb-8">
            Ready to see what AI can do for your business? Book a free call and let&apos;s talk.
          </p>
          <Link href="/book" className="btn-primary inline-block">
            Book a Free Consultation
          </Link>
        </AnimatedSection>
      </section>
    </div>
  )
}

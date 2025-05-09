import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import About from '@/components/about/About'
import Contact from '@/components/contact/Contact'
import Experience from '@/components/experience/Experience'
import Home from '@/components/home/Home'
import Qualification from '@/components/qualification/Qualification'
import Skill from '@/components/skill/Skill'

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: i * 0.1,
      ease: [0.25, 0.1, 0.25, 1]
    }
  })
}

const ScrollAnimationWrapper = ({ children, className = '', delay = 0 }) => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.15,
    rootMargin: '-50px 0px'
  })

  return (
    <motion.div ref={ref} className={className} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeInUpVariants} custom={delay}>
      {children}
    </motion.div>
  )
}

const Portfolio = () => {
  const [currentSeason, setCurrentSeason] = useState('')
  const [mounted, setMounted] = useState(false)
  const { scrollY } = useScroll()

  const parallaxY1 = useTransform(scrollY, [0, 1000], [0, -150])
  const parallaxY2 = useTransform(scrollY, [0, 1000], [0, -100])
  const parallaxY3 = useTransform(scrollY, [0, 1000], [0, -50])
  const opacity = useTransform(scrollY, [0, 200], [1, 0])

  useEffect(() => {
    const date = new Date()
    const month = date.getMonth() + 1

    switch (true) {
      case month >= 2 && month <= 4:
        setCurrentSeason('spring')
        break
      case month >= 5 && month <= 7:
        setCurrentSeason('summer')
        break
      case month >= 8 && month <= 10:
        setCurrentSeason('autumn')
        break
      default:
        setCurrentSeason('winter')
    }

    document.documentElement.style.scrollBehavior = 'smooth'

    setMounted(true)

    return () => {
      document.documentElement.style.scrollBehavior = ''
    }
  }, [])

  const seasonThemes = {
    spring: {
      message: 'Welcome to Spring',
      primaryColor: 'rgba(136, 212, 152, 0.95)',
      secondaryColor: 'rgba(255, 230, 230, 0.2)',
      textColor: '#ffffff',
      emoji: '🌸'
    },
    summer: {
      message: 'Summer Vibes',
      primaryColor: 'rgba(249, 200, 14, 0.9)',
      secondaryColor: 'rgba(255, 166, 43, 0.2)',
      textColor: '#ffffff',
      emoji: '☀️'
    },
    autumn: {
      message: 'Autumn Greetings',
      primaryColor: 'rgba(217, 93, 57, 0.9)',
      secondaryColor: 'rgba(255, 236, 179, 0.2)',
      textColor: '#ffffff',
      emoji: '🍂'
    },
    winter: {
      message: 'Winter Wonderland',
      primaryColor: 'rgba(61, 90, 128, 0.95)',
      secondaryColor: 'rgba(220, 240, 255, 0.2)',
      textColor: '#ffffff',
      emoji: '❄️'
    }
  }

  const theme = seasonThemes[currentSeason]

  const renderSeasonalElements = () => {
    switch (currentSeason) {
      case 'spring':
        return [...Array(12)].map((_, i) => (
          <motion.div
            key={`spring-element-${i}`}
            initial={{
              top: `${Math.random() * -10}%`,
              left: `${Math.random() * 100}%`,
              rotate: 0,
              opacity: 0,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{
              top: '100%',
              rotate: Math.random() * 360,
              opacity: [0, 0.7, 0],
              x: Math.sin(i) * 100
            }}
            transition={{
              duration: 10 + Math.random() * 5,
              delay: Math.random() * 3,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: 'loop',
              ease: [0.1, 0.4, 0.05, 0.9]
            }}
          >
            {['🌸', '🌿', '🌷', '🦋'][i % 4]}
          </motion.div>
        ))
      case 'summer':
        return (
          <>
            <motion.div
              key="summer-gradient"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ duration: 1 }}
              style={{
                background: 'radial-gradient(circle, rgba(255,215,0,0.3) 0%, rgba(255,215,0,0) 70%)',
                transform: 'translate(30%, -30%)'
              }}
            />
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`summer-element-${i}`}
                initial={{
                  bottom: 0,
                  left: `${Math.random() * 100}%`,
                  opacity: 0,
                  scale: Math.random() * 0.5 + 0.7
                }}
                animate={{
                  bottom: `${50 + Math.random() * 50}%`,
                  opacity: [0, 0.8, 0],
                  x: Math.sin(i * 0.5) * 50
                }}
                transition={{
                  duration: 4 + Math.random() * 3,
                  delay: Math.random() * 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: 'loop',
                  ease: [0, 0.55, 0.45, 1]
                }}
              >
                {['🏄‍♂️', '🌊', '🏝️', '🍹', '🌴', '✨', '🌞', '🐚'][i % 8]}
              </motion.div>
            ))}
          </>
        )
      case 'autumn':
        return (
          <>
            <motion.div
              key="autumn-gradient"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ duration: 1 }}
              style={{
                background: 'linear-gradient(to bottom, rgba(255,166,43,0) 0%, rgba(255,166,43,0.1) 100%)'
              }}
            />
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={`autumn-element-${i}`}
                initial={{
                  top: `${Math.random() * -10}%`,
                  left: `${Math.random() * 100}%`,
                  rotate: 0,
                  opacity: 0,
                  scale: Math.random() * 0.4 + 0.6
                }}
                animate={{
                  top: '100%',
                  rotate: 360 + Math.random() * 180,
                  opacity: [0, 0.8, 0],
                  x: Math.sin(i * 0.3) * 150
                }}
                transition={{
                  duration: 8 + Math.random() * 7,
                  delay: Math.random() * 5,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: 'loop',
                  ease: [0.4, 0.05, 0.1, 0.95]
                }}
              >
                {['🍂', '🍁', '🍄', '🌰', '🦊', '🍎'][i % 6]}
              </motion.div>
            ))}
          </>
        )
      case 'winter':
        return (
          <>
            <motion.div
              key="winter-gradient"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ duration: 1 }}
              style={{
                background: 'radial-gradient(ellipse at top, rgba(220,240,255,0.2) 0%, rgba(220,240,255,0) 70%)'
              }}
            />
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={`winter-element-${i}`}
                initial={{
                  top: `${Math.random() * -10}%`,
                  left: `${Math.random() * 100}%`,
                  scale: Math.random() * 0.5 + 0.3,
                  rotate: Math.random() * 180,
                  opacity: 0
                }}
                animate={{
                  top: '100%',
                  opacity: [0, 0.7, 0],
                  rotate: Math.random() * 360,
                  x: Math.sin(i * 0.2) * 100
                }}
                transition={{
                  duration: 10 + Math.random() * 10,
                  delay: Math.random() * 5,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: 'loop',
                  ease: [0, 0.71, 0.2, 1.01]
                }}
              >
                {['❄️', '❄️', '❄️', '✨', '⭐'][i % 5]}
              </motion.div>
            ))}
          </>
        )
      default:
        return null
    }
  }

  const WelcomeMessage = () => {
    const [ref, inView] = useInView({
      triggerOnce: false,
      threshold: 0.5
    })

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.span
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: 'loop' }}
        >
          {theme.emoji}
        </motion.span>

        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : { y: 10, opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h1>{theme.message}</h1>
          <p>Explore my portfolio</p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : { opacity: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: 'loop' }}>
            ↓
          </motion.div>
        </motion.div>
      </motion.div>
    )
  }

  const FloatingDecoration = ({ index = 0 }) => {
    const [ref, inView] = useInView({
      triggerOnce: false,
      threshold: 0.1
    })

    const emoji = {
      spring: ['🌸', '🌿', '🌷'],
      summer: ['☀️', '🌴', '🌊'],
      autumn: ['🍂', '🍁', '🍄'],
      winter: ['❄️', '✨', '⭐']
    }[currentSeason][index % 3]

    return (
      <motion.div
        ref={ref}
        style={{
          top: `${10 + (index % 3) * 30}%`,
          right: `${5 + (index % 2) * 10}%`,
          opacity: 0
        }}
        animate={
          inView
            ? {
                opacity: 0.7,
                x: [0, 10, 0],
                y: [0, -10, 0],
                rotate: [0, 10, 0]
              }
            : { opacity: 0 }
        }
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: 'loop',
          ease: 'easeInOut'
        }}
      >
        {emoji}
      </motion.div>
    )
  }

  if (!mounted) return null

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="welcome-overlay"
        initial={{ height: '100vh' }}
        animate={{ height: 0 }}
        exit={{ height: 0 }}
        transition={{
          duration: 0.9,
          ease: [0.76, 0, 0.24, 1],
          delay: 1.5
        }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 100%)`,
          zIndex: 999,
          overflow: 'hidden',
          backdropFilter: 'blur(10px)'
        }}
      >
        {renderSeasonalElements()}
        <motion.div
          key="welcome-message-container"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, delay: 1 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: theme.textColor,
            fontWeight: 'bold',
            textShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}
        >
          <WelcomeMessage />
        </motion.div>
      </motion.div>

      <motion.div key="main-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div key="header" style={{ opacity, y: parallaxY1 }}>
          <div>
            {theme.emoji} {theme.message}
          </div>
        </motion.div>

        <div>
          <motion.div key="home-section" style={{ y: parallaxY2 }}>
            <Home />
          </motion.div>

          <ScrollAnimationWrapper key="about-section" delay={0.1}>
            <FloatingDecoration key="floating-1" index={0} />
            <About />
          </ScrollAnimationWrapper>

          <ScrollAnimationWrapper key="experience-section" delay={0.2}>
            <FloatingDecoration key="floating-2" index={1} />
            <Experience />
          </ScrollAnimationWrapper>

          <ScrollAnimationWrapper key="skill-section" delay={0.3}>
            <FloatingDecoration key="floating-3" index={2} />
            <Skill />
          </ScrollAnimationWrapper>

          <ScrollAnimationWrapper key="qualification-section" delay={0.4}>
            <FloatingDecoration key="floating-4" index={3} />
            <Qualification />
          </ScrollAnimationWrapper>

          <ScrollAnimationWrapper key="contact-section" delay={0.5}>
            <FloatingDecoration key="floating-5" index={4} />
            <Contact />
          </ScrollAnimationWrapper>
        </div>

        <motion.div key="background-gradient" style={{ y: parallaxY3 }}>
          <div
            style={{
              background: `radial-gradient(circle at 70% 20%, ${theme.primaryColor} 0%, transparent 70%)`
            }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default Portfolio

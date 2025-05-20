import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import About from '@/components/client/about/About'
import Contact from '@/components/client/contact/Contact'
import Experience from '@/components/client/experience/Experience'
import Home from '@/components/client/home/Home'
import Qualification from '@/components/client/qualification/Qualification'
import Skill from '@/components/client/skill/Skill'

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: i * 0.1,
      ease: [0.4, 0, 0.2, 1]
    }
  })
}

const ScrollAnimationWrapper = ({ children, className = '', delay = 0 }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
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

  const parallaxY2 = useTransform(scrollY, [0, 1000], [0, -100], { clamp: true })
  const parallaxY3 = useTransform(scrollY, [0, 1000], [0, -50], { clamp: true })

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

  if (!mounted) {
    return null
  }

  return (
    <AnimatePresence>
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
        <div>
          <motion.div key="home-section" style={{ y: parallaxY2 }}>
            <Home />
          </motion.div>

          <ScrollAnimationWrapper key="about-section" delay={0.1}>
            <About />
          </ScrollAnimationWrapper>

          <ScrollAnimationWrapper key="experience-section" delay={0.2}>
            <Experience />
          </ScrollAnimationWrapper>

          <ScrollAnimationWrapper key="skill-section" delay={0.3}>
            <Skill />
          </ScrollAnimationWrapper>

          <ScrollAnimationWrapper key="qualification-section" delay={0.4}>
            <Qualification />
          </ScrollAnimationWrapper>

          <ScrollAnimationWrapper key="contact-section" delay={0.5}>
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

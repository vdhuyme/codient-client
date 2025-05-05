import { useInView } from 'react-intersection-observer'
import About from '@/components/about/About'
import Contact from '@/components/contact/Contact'
import Experience from '@/components/experience/Experience'
import Home from '@/components/home/Home'
import Qualification from '@/components/qualification/Qualification'
import Skill from '@/components/skill/Skill'
import { motion } from 'framer-motion'

const Section = ({ children }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

const Portfolio = () => {
  return (
    <>
      <Home />

      <Section>
        <About />
      </Section>

      <Section>
        <Experience />
      </Section>

      <Section>
        <Skill />
      </Section>

      <Section>
        <Qualification />
      </Section>

      <Section>
        <Contact />
      </Section>
    </>
  )
}

export default Portfolio

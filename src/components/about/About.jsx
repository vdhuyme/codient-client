import { toast } from 'sonner'
import AboutImg from '@/assets/profile.png'
import './about.css'
import { motion } from 'framer-motion'

const About = () => {
  const handleDownloadResume = () => {
    toast.warning('The resume is being updated')
  }

  const description =
    'With a strong passion for technology, I am dedicated to advancing my expertise and contributing to the development of high-performing, scalable solutions. I value collaboration and am committed to delivering impactful products that drive meaningful results.'

  return (
    <section id="about" className="about section">
      <h3 className="section__title">About Me</h3>
      <span className="section__subtitle">Get to Know Me</span>

      <div className="about__container container grid">
        <img src={AboutImg} alt="Vo Duc Huy - Software Engineer" className="about__img" />

        <div className="about__data">
          <motion.p
            className="about__description"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.05 } }
            }}
          >
            {description.split(' ').map((word, index) => (
              <motion.span
                key={index}
                style={{ display: 'inline-block', overflow: 'hidden', whiteSpace: 'nowrap' }}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0 }
                }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                {word}&nbsp;
              </motion.span>
            ))}
          </motion.p>

          <motion.a
            download
            onClick={() => handleDownloadResume()}
            title="Vo Duc Huy - Software Engineer"
            className="button button__flex"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Resume
          </motion.a>
        </div>
      </div>
    </section>
  )
}

export default About

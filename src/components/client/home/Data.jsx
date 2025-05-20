import { motion } from 'framer-motion'

const Data = () => {
  const description =
    'I’m a Junior Software Engineer with a strong passion for web development. Always eager to learn and take on new challenges, I aim to contribute to projects that make a real difference.'
  const words = description.split(' ')

  return (
    <motion.div className="home__data" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <motion.h1 className="home__title" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
        Vo Duc Huy
      </motion.h1>
      <motion.h3
        className="home__subtitle"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        Software Engineer
      </motion.h3>
      <motion.p
        className="home__description"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.05 } }
        }}
      >
        {words.map((word, index) => (
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

      <motion.a href="#contact" className="button button__flex" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        Message
      </motion.a>
    </motion.div>
  )
}

export default Data

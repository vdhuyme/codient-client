import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, Phone, MapPin, Heart } from 'lucide-react'
import avatar from '@/assets/profile.png'

const ResumePage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-950 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(79,70,229,0.3),rgba(15,23,42,0.9))]" />
      </div>

      {/* Subtle particles */}
      <div className="absolute inset-0 z-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-white"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.3 + 0.2,
              opacity: Math.random() * 0.3 + 0.1
            }}
            animate={{
              y: [null, Math.random() * -100 - 50],
              opacity: [null, 0]
            }}
            transition={{
              duration: Math.random() * 15 + 15,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'linear'
            }}
            style={{
              boxShadow: `0 0 ${Math.random() * 5 + 2}px ${Math.random() * 1 + 0.5}px rgba(79, 70, 229, 0.3)`
            }}
          />
        ))}
      </div>

      <div className="container relative z-10 mx-auto max-w-4xl px-4 py-12">
        {/* Header Section */}
        <header className="mb-12 border-b border-slate-800/30 pb-8">
          <div className="flex flex-col-reverse items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="flex-1">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-2 text-4xl font-bold text-white"
              >
                Vo Duc Huy
              </motion.h1>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-4 text-xl font-medium text-indigo-400"
              >
                Software Engineer
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-6 max-w-2xl text-gray-300"
              >
                I am dedicated to advancing my expertise and contributing to the development of high-performing, scalable solutions. I value
                collaboration and am committed to delivering impactful products that drive meaningful results.
              </motion.p>

              <div className="flex flex-wrap gap-6">
                <ContactItem icon={<Mail className="h-4 w-4" />} value="voduchuy2001@gmail.com" />
                <ContactItem icon={<Phone className="h-4 w-4" />} value="+84 962 785 101" />
                <ContactItem icon={<MapPin className="h-4 w-4" />} value="Can Tho City, Vietnam" />
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col items-center"
            >
              <div className="relative h-36 w-36">
                {/* Subtle animated glow */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-indigo-500/10 blur-xl"
                  animate={{ opacity: [0.15, 0.3, 0.15], scale: [1, 1.1, 1] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    repeatType: 'reverse'
                  }}
                />

                {/* Avatar image with slight float */}
                <motion.div
                  className="absolute inset-0 rounded-full overflow-hidden border border-white/10"
                  animate={{
                    y: ['0%', '-2%', '0%', '2%', '0%'],
                    x: ['0%', '1%', '0%', '-1%', '0%']
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    repeatType: 'loop'
                  }}
                >
                  <img src={avatar} alt="Vo Duc Huy" className="h-full w-full object-cover" />
                </motion.div>
              </div>

              <div className="mt-4 flex space-x-3">
                <SocialLink icon={<Github className="h-4 w-4" />} href="https://github.com/vdhuyme" />
                <SocialLink icon={<Linkedin className="h-4 w-4" />} href="https://www.linkedin.com/in/vdhme" />
                <SocialLink icon={<Mail className="h-4 w-4" />} href="mailto:voduchuy2001@gmail.com" />
              </div>
            </motion.div>
          </div>
        </header>

        {/* Main Content */}
        <div className="space-y-12">
          {/* Experience Section */}
          <Section title="Work Experience">
            <div className="space-y-8">
              <ExperienceItem
                title="Software Engineer"
                company="CAN THO WATER SUPPLY - SEWERAGE JOINT STOCK COMPANY"
                period="03/2025 - Present"
                location="Can Tho City, Vietnam"
                description="Led the development of full-stack web and geospatial applications using modern frameworks and databases. Focused on building scalable backend services, intelligent search systems, and rich data visualizations."
                achievements={[
                  'Developed and maintained web applications using React, Node.js, FastAPI (Python), and MongoDB',
                  'Built and optimized RESTful APIs and backend services using Node.js, FastAPI, .NET, and MSSQL',
                  'Designed and implemented Retrieval-Augmented Generation (RAG) systems to improve intelligent search and knowledge access',
                  'Created WebGIS applications for geospatial data visualization, analysis, and interactive mapping',
                  'Optimized complex database queries and introduced caching strategies to enhance system performance and scalability',
                  'Collaborated closely with cross-functional teams to improve user experience and system reliability',
                  'Participated in code reviews, design discussions, and mentored junior developers to maintain code quality and promote best practices'
                ]}
              />

              <ExperienceItem
                title="NodeJs Backend Developer"
                company="KATEC TECHNOLOGY JOIN STOCK COMPANY"
                period="03/2024 - 04/2025"
                location="Can Tho City, Vietnam"
                description="Contributed to the full-stack development of scalable web applications using modern JavaScript technologies. Focused on designing robust backend services, optimizing API performance, and delivering responsive frontend experiences."
                achievements={[
                  'Designed and developed scalable backend services using Node.js, Express.js, and MySQL',
                  'Architected and optimized RESTful APIs with integration of MySQL and MongoDB for both mobile and web applications',
                  'Implemented real-time features using WebSocket for chat and notification systems',
                  'Integrated Firebase services for push notifications and cloud data management',
                  'Built secure authentication and authorization flows with JWT and role-based access control',
                  'Applied caching strategies (Redis, in-memory) to significantly improve API response times and reduce load',
                  'Utilized Docker for consistent development environments and streamlined deployment processes',
                  'Built reusable and responsive UI components with React.js to ensure smooth user experience across devices',
                  'Integrated multiple payment gateways (e.g., VietinBank, HDBank, VNPay) to enable secure and seamless payment processing',
                  'Developed and maintained electronic invoicing systems compliant with local regulations and standards'
                ]}
              />

              <ExperienceItem
                title="Intern/Fresher"
                company="ARCHI ELITE TECHNOLOGY JOINT STOCK COMPANY"
                period="05/2023 - 07/2023"
                location="Ho Chi Minh City, Vietnam"
                description="Developed and maintained web applications using the Laravel PHP framework with a focus on clean architecture and maintainability. Collaborated with cross-functional teams to deliver responsive and performant solutions."
                achievements={[
                  'Built and maintained backend features using Laravel, ensuring scalable and secure codebases',
                  'Worked with MySQL databases for efficient data storage, retrieval, and optimization',
                  'Integrated and customized Botble CMS to streamline content management workflows',
                  'Used Git for version control, supporting team collaboration and continuous integration'
                ]}
              />
            </div>
          </Section>

          {/* Skills Section */}
          <Section title="Skills">
            <div className="space-y-6">
              <SkillCategory
                title="Frontend Development"
                skills={[
                  { name: 'React' },
                  { name: 'Vue.js' },
                  { name: 'JavaScript/TypeScript' },
                  { name: 'HTML/CSS' },
                  { name: 'Tailwind CSS' },
                  { name: 'Bootstrap 5' }
                ]}
              />

              <SkillCategory
                title="Backend Development"
                skills={[
                  { name: 'Node.js' },
                  { name: 'Express' },
                  { name: 'DotNET' },
                  { name: 'Python' },
                  { name: 'FastAPI' },
                  { name: 'PHP' },
                  { name: 'Laravel' },
                  { name: 'RESTful APIs' },
                  { name: 'MongoDB' },
                  { name: 'PostgreSQL' },
                  { name: 'SQL Server' }
                ]}
              />

              <SkillCategory title="Tools" skills={[{ name: 'Git/GitHub' }, { name: 'Docker' }, { name: 'Redis' }, { name: 'Ngnix' }]} />

              <div>
                <h3 className="mb-3 text-lg font-medium text-white">Additional Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {['Swagger', 'GitHub Actions', 'VPS', 'Hosting', 'OpenAI API', 'LangChain', 'RAG (Retrieval-Augmented Generation)'].map(
                    (skill, index) => (
                      <motion.span
                        key={skill}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.03 }}
                        className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/5 px-3 py-1 text-sm font-medium text-indigo-200 backdrop-blur-sm"
                      >
                        {skill}
                      </motion.span>
                    )
                  )}
                </div>
              </div>
            </div>
          </Section>

          {/* Education Section */}
          <Section title="Education">
            <div className="space-y-6">
              <EducationItem
                degree="Information Technology Engineers"
                institution="Can Tho University"
                period="09/2019 - 05/2024"
                location="Can tho City, Vietnam"
                description="Graduated with honors in Software Engineering, specializing in web technologies and algorithm design. Achieved a GPA of 3.24."
                courses={[
                  'Data Structures and Algorithms',
                  'Object-Oriented Programming',
                  'Database Systems',
                  'Web Development',
                  'Software Engineering'
                ]}
              />
            </div>
          </Section>

          {/* Languages Section */}
          <Section title="Languages & Interests">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="mb-3 text-lg font-medium text-white">Languages</h3>
                <div className="space-y-3 text-gray-300">
                  <div className="flex justify-between">
                    <span>Vietnamese</span>
                    <span className="font-medium text-indigo-300">Native</span>
                  </div>
                  <div className="flex justify-between">
                    <span>English</span>
                    <span className="font-medium text-indigo-300">TOEIC 600</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-lg font-medium text-white">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {['Traveling', 'Reading', 'Listening to music', 'Having coffee with friends', 'Playing football', 'Exploring new technologies'].map(
                    (interest, index) => (
                      <motion.span
                        key={interest}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/5 px-3 py-1 text-sm font-medium text-indigo-200 backdrop-blur-sm"
                      >
                        <Heart className="mr-1.5 h-3 w-3 text-pink-400" />
                        {interest}
                      </motion.span>
                    )
                  )}
                </div>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  )
}

// Components
const ContactItem = ({ icon, value }) => (
  <div className="flex items-center text-gray-300">
    <span className="mr-2 text-indigo-400">{icon}</span>
    <span>{value}</span>
  </div>
)

const SocialLink = ({ icon, href }) => (
  <motion.a
    href={href}
    className="flex h-8 w-8 items-center justify-center rounded-full border border-indigo-500/20 bg-indigo-500/5 text-gray-300 backdrop-blur-sm transition-all hover:border-indigo-500/40 hover:text-white"
    whileHover={{
      y: -2,
      transition: { type: 'spring', stiffness: 400, damping: 17 }
    }}
    whileTap={{ scale: 0.97 }}
  >
    {icon}
  </motion.a>
)

const Section = ({ title, children }) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="border-b border-slate-800/30 pb-8"
  >
    <h2 className="mb-6 text-2xl font-bold text-white">{title}</h2>
    {children}
  </motion.section>
)

const ExperienceItem = ({ title, company, period, location, description, achievements }) => (
  <div className="border-l-2 border-indigo-500/20 pl-4">
    <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
      <div>
        <h3 className="text-xl font-medium text-white">{title}</h3>
        <div className="text-indigo-400">{company}</div>
      </div>
      <div className="text-right">
        <div className="text-sm text-gray-400">{period}</div>
        <div className="text-xs text-gray-500">{location}</div>
      </div>
    </div>
    <p className="mb-3 text-gray-300">{description}</p>
    <div>
      <h4 className="mb-2 text-sm font-medium text-white">Key Achievements:</h4>
      <ul className="space-y-1 text-sm text-gray-300">
        {achievements.map((achievement, index) => (
          <li key={index} className="flex items-start">
            <span className="mr-2 text-indigo-400">•</span>
            <span>{achievement}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
)

const SkillCategory = ({ title, skills }) => (
  <div>
    <h3 className="mb-3 text-lg font-medium text-white">{title}</h3>
    <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
      {skills.map((skill, index) => (
        <div key={index} className="text-gray-300">
          {skill.name}
        </div>
      ))}
    </div>
  </div>
)

const EducationItem = ({ degree, institution, period, location, description, courses }) => (
  <div className="border-l-2 border-indigo-500/20 pl-4">
    <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
      <div>
        <h3 className="text-xl font-medium text-white">{degree}</h3>
        <div className="text-indigo-400">{institution}</div>
      </div>
      <div className="text-right">
        <div className="text-sm text-gray-400">{period}</div>
        <div className="text-xs text-gray-500">{location}</div>
      </div>
    </div>
    <p className="mb-3 text-gray-300">{description}</p>
    <div>
      <h4 className="mb-2 text-sm font-medium text-white">Relevant Courses:</h4>
      <div className="flex flex-wrap gap-2">
        {courses.map((course, index) => (
          <span
            key={index}
            className="rounded-full border border-indigo-500/30 bg-indigo-500/5 px-3 py-1 text-xs font-medium text-indigo-200 backdrop-blur-sm"
          >
            {course}
          </span>
        ))}
      </div>
    </div>
  </div>
)

export default ResumePage

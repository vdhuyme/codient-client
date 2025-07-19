import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, Phone, MapPin, Plane, Book, Music, Coffee, Code, Volleyball, Download, Loader, ChevronLeft } from 'lucide-react'
import avatar from '@/assets/profile.png'
import React from 'react'
import { Link } from 'react-router-dom'

const ResumePage = () => {
  return (
    <React.Fragment>
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

        <div className="relative z-10 container mx-auto max-w-4xl px-4 py-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="mb-8">
            <Link to={'/'} className="inline-flex items-center text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to Home
            </Link>
          </motion.div>

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
                    className="absolute inset-0 overflow-hidden rounded-full border border-white/10"
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
                  location="On site / Can Tho City, Vietnam"
                  description="Led the development of full-stack web and geospatial applications using modern frameworks and databases. Focused on building scalable backend services, intelligent search systems, and rich data visualizations."
                  techStack={['Node.js', 'FastAPI (Python)', '.NET', 'MSSQL', 'MongoDB', 'Redis', 'WebGIS']}
                  achievements={[
                    'Designed and maintained scalable backend systems using FastAPI (Python), .NET, and Node.js,',
                    'Developed robust RESTful APIs and microservices for internal and external system integration',
                    'Implemented RAG-based backend services to enhance semantic search and knowledge retrieval',
                    'Worked with relational and NoSQL databases (MSSQL, MongoDB, Redis), focusing on data modeling and query optimization',
                    'Built WebGIS backend services to handle spatial data processing, tile serving, and API endpoints for frontend mapping layers'
                  ]}
                />

                <ExperienceItem
                  title="NodeJs Backend Developer"
                  company="KATEC TECHNOLOGY JOIN STOCK COMPANY"
                  period="03/2024 - 04/2025"
                  location="On site / Can Tho City, Vietnam"
                  description="Contributed to the full-stack development of scalable web applications using modern JavaScript technologies. Focused on designing robust backend services, optimizing API performance, and delivering responsive frontend experiences."
                  techStack={[
                    'Node.js',
                    'Express.js',
                    'MySQL',
                    'MongoDB',
                    'WebSocket',
                    'Firebase',
                    'JWT',
                    'Redis',
                    'Docker',
                    'React.js',
                    'Payment gateways'
                  ]}
                  achievements={[
                    'Designed and developed scalable backend services using Node.js, Express.js, and MySQL',
                    'Architected and optimized RESTful APIs integrated with MySQL and MongoDB for mobile and web platforms',
                    'Implemented real-time communication using WebSocket for chat and notification systems',
                    'Integrated Firebase services for push notifications and backend event handling',
                    'Built secure authentication and authorization systems using JWT and role-based access control',
                    'Applied Redis and in-memory caching strategies to reduce latency and improve API performance',
                    'Containerized backend services using Docker for consistent development and deployment environments',
                    'Integrated multiple payment gateways (e.g., VietinBank, HDBank, VNPay) with transaction validation and error handling',
                    'Integrated and maintained e-invoicing systems in compliance with Vietnamese government regulations, including successful implementation with Viettel and VNPT platforms',
                    'Collaborated with frontend teams to deliver reliable, secure, and performant systems',
                    'Conducted code reviews, wrote technical documentation, and enforced backend coding standards and best practices'
                  ]}
                />

                <ExperienceItem
                  title="Freelance Full-Stack Developer"
                  company="Self-employed"
                  period="2023 - Present"
                  location="Remote / Can Tho City, Vietnam"
                  description="Worked independently with clients to design, develop, and deploy full-stack web applications using Laravel, React.js, and MySQL. Delivered user-centric solutions with a strong focus on performance, scalability, and usability."
                  techStack={['Laravel', 'Inertia.js', 'React.js', 'Tailwind CSS', 'MySQL', 'Git', 'CI/CD']}
                  achievements={[
                    'Built and maintained full-stack web applications using Laravel, Inertia.js, and React, enabling seamless server-driven SPA architecture',
                    'Designed interactive and responsive frontend with React.js and Tailwind CSS, following component-based best practices',
                    'Implemented authentication, form validation, and flash messaging using Laravel’s backend logic and Inertia-based frontend rendering',
                    'Deployed and maintained applications on shared and VPS hosting environments with Git-based CI/CD pipelines'
                  ]}
                />

                <ExperienceItem
                  title="Intern/Fresher"
                  company="ARCHI ELITE TECHNOLOGY JOINT STOCK COMPANY"
                  period="05/2023 - 07/2023"
                  location="On site / Ho Chi Minh City, Vietnam"
                  description="Developed and maintained web applications using the Laravel PHP framework with a focus on clean architecture and maintainability. Collaborated with cross-functional teams to deliver responsive and performant solutions."
                  techStack={['Laravel', 'MySQL', 'Botble CMS', 'Git']}
                  achievements={[
                    'Developed and maintained backend services using Laravel, focusing on scalability, maintainability, and security',
                    'Designed and optimized MySQL database schemas for high-performance data access and consistency',
                    'Integrated and extended Botble CMS to support custom content workflows and admin features'
                  ]}
                />
              </div>
            </Section>

            {/* Skills Section */}
            <Section title="Skills">
              <div className="space-y-6">
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
                          whileHover={{ scale: 1.05 }}
                          transition={{
                            duration: 0.3,
                            delay: index * 0.03,
                            type: 'spring',
                            stiffness: 300,
                            damping: 15
                          }}
                          className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/5 px-3 py-1 text-sm font-medium text-indigo-200 backdrop-blur-sm transition-all duration-300 hover:border-indigo-400 hover:bg-indigo-500/10 hover:text-indigo-100"
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
                  courses={['Data Structures and Algorithms', 'Object-Oriented Programming', 'Database Systems', 'Web Development']}
                />
              </div>
            </Section>

            {/* Languages Section */}
            <Section title="Languages">
              <div className="grid gap-8">
                <div className="space-y-3 text-gray-300">
                  <div className="flex justify-between">
                    <span>Vietnamese</span>
                    <span className="font-medium text-indigo-300">Native</span>
                  </div>
                  <div className="flex justify-between">
                    <span>English</span>
                    <span className="font-medium text-indigo-300">TOEIC 600 (01/2024 - 01/2026)</span>
                  </div>
                </div>
              </div>
            </Section>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

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

const ExperienceItem = ({ title, company, period, location, description, achievements, techStack }) => (
  <div className="border-l-2 border-indigo-500/20 pl-4">
    <div className="mb-2 flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
      <div>
        <h3 className="text-xl font-medium text-white">{title}</h3>
        <div className="text-indigo-400">{company}</div>
      </div>

      <div className="text-start md:text-end">
        <div className="text-sm text-gray-400">{period}</div>
        <div className="text-xs text-gray-500">{location}</div>
      </div>
    </div>

    <p className="mb-2 text-gray-300">{description}</p>

    {/* Tech Stack */}
    {techStack && techStack.length > 0 && (
      <div className="mb-4">
        <h4 className="mb-2 text-sm font-medium text-white">Tech Stack:</h4>
        <div className="flex flex-wrap gap-2">
          {techStack.map((tech, index) => (
            <motion.span
              key={`skill-${tech}-${index}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className="inline-flex cursor-context-menu items-center rounded-full border border-indigo-500/30 bg-indigo-500/5 px-3 py-1 text-sm font-medium text-indigo-200 backdrop-blur-sm transition-all duration-300 hover:border-indigo-400 hover:bg-indigo-500/10 hover:text-indigo-100"
            >
              {tech}
            </motion.span>
          ))}
        </div>
      </div>
    )}

    <div>
      <h4 className="mb-2 text-sm font-medium text-white">Key Achievements:</h4>
      <ul className="space-y-1 text-gray-300">
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
            className="rounded-full border border-indigo-500/30 bg-indigo-500/5 px-3 py-1 text-sm font-medium text-indigo-200 backdrop-blur-sm"
          >
            {course}
          </span>
        ))}
      </div>
    </div>
  </div>
)

export default ResumePage

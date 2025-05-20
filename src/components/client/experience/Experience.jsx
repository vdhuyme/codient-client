import './experience.css'
import Modal from '@/components/ui/modal.jsx'
import { useState } from 'react'

const Experience = () => {
  const experiences = [
    {
      id: 1,
      company: 'CAN THO WATER SUPPLY - SEWERAGE JOINT STOCK COMPANY',
      position: 'Software Engineer',
      startDate: '2025-03-31',
      endDate: null,
      details: [
        'Developed and maintained web applications using React, Node.js, FastAPI, and MongoDB',
        'Built and optimized RESTful APIs and backend services using Node.js, FastAPI (Python), .NET, and MSSQL',
        'Designed and implemented RAG (Retrieval-Augmented Generation) systems to enhance search and knowledge management',
        'Developed WebGIS applications integrating geospatial data visualization and analysis',
        'Optimized database queries, applied caching strategies, and improved overall system scalability',
        'Collaborated with cross-functional teams to enhance system performance and user experience',
        'Participated in code reviews, technical discussions, and mentored junior developers'
      ]
    },
    {
      id: 2,
      company: 'KATEC TECHNOLOGY JOIN STOCK COMPANY',
      position: 'NodeJs Backend Developer',
      startDate: '2024-03-01',
      endDate: '2025-04-01',
      details: [
        'Designed and developed scalable backend services using Node.js, Express.js, and MySQL',
        'Architected and optimized RESTful APIs for mobile and web applications with MySQL and MongoDB integration',
        'Implemented real-time communication features leveraging WebSocket technology',
        'Integrated Firebase services for cloud notifications and data storage',
        'Developed authentication and authorization flows using JWT',
        'Applied advanced caching strategies to enhance API performance and scalability',
        'Worked with Docker containers to streamline application deployment and development workflows',
        'Built responsive and reusable frontend components using React.js'
      ]
    },
    {
      id: 3,
      company: 'ARCHI ELITE TECHNOLOGY JOINT STOCK COMPANY',
      position: 'Intern/Fresher',
      startDate: '2023-05-01',
      endDate: '2023-07-31',
      details: [
        'Developed and maintained web applications using Laravel PHP framework',
        'Worked with MySQL databases for data storage and retrieval',
        'Gained experience with Botble CMS for content management',
        'Used Git for version control and collaborative development'
      ]
    }
  ]

  const calculateMonthsWorked = (fromDate, toDate = null) => {
    const start = new Date(fromDate)
    const end = toDate ? new Date(toDate) : new Date()

    const diffInMs = end - start
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24)
    const oneMonthLater = new Date(start)
    oneMonthLater.setMonth(start.getMonth() + 1)

    if (end < oneMonthLater) {
      return `(${Math.floor(diffInDays)} day${Math.floor(diffInDays) !== 1 ? 's' : ''})`
    }

    const rawMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
    const totalMonths = end.getDate() < start.getDate() ? rawMonths - 1 : rawMonths

    return totalMonths <= 12
      ? `(${totalMonths} mos)`
      : (() => {
          const years = Math.floor(totalMonths / 12)
          const months = totalMonths % 12
          const yearStr = `${years} yr${years > 1 ? 's' : ''}`
          const monthStr = months ? ` ${months} mos` : ''
          return `(${yearStr}${monthStr})`
        })()
  }

  const [selectedExperience, setSelectedExperience] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = (experience) => {
    setSelectedExperience(experience)
    setIsModalOpen(true)
  }

  const closeModal = () => setIsModalOpen(false)

  const formatDate = (dateString) => {
    if (!dateString) {
      return 'Present'
    }
    const date = new Date(dateString)
    return `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`
  }

  return (
    <section id="experience" className="experience section">
      <h2 className="section__title">Experience</h2>
      <span className="section__subtitle">Work experience</span>

      <div className="experience__container container">
        <div className="experience__section">
          {experiences.map((exp, index) => (
            <div className="experience__data" key={exp.id}>
              {index % 2 !== 0 ? (
                <>
                  <div onClick={() => openModal(exp)} className="experience__content">
                    <h3 className="experience__title">{exp.company}</h3>
                    <span className="experience__subtitle">{exp.position}</span>
                    <div className="experience__calender">
                      <i className="uil uil-calendar-alt"></i> {formatDate(exp.startDate)} - {formatDate(exp.endDate)}{' '}
                      {calculateMonthsWorked(exp.startDate, exp.endDate)}
                    </div>
                  </div>

                  <div>
                    <span className="experience__rounder"></span>
                    <div className="experience__line"></div>
                  </div>

                  <div></div>
                </>
              ) : (
                <>
                  <div></div>

                  <div>
                    <span className="experience__rounder"></span>
                    <span className="experience__line"></span>
                  </div>

                  <div onClick={() => openModal(exp)} className="experience__content">
                    <h3 className="experience__title">{exp.company}</h3>
                    <span className="experience__subtitle">{exp.position}</span>
                    <div className="experience__calender">
                      <i className="uil uil-calendar-alt"></i> {formatDate(exp.startDate)} - {formatDate(exp.endDate)}{' '}
                      {calculateMonthsWorked(exp.startDate, exp.endDate)}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {selectedExperience && (
        <Modal isOpen={isModalOpen} onClose={closeModal} title={selectedExperience.company} size="large">
          <div className="experience-modal">
            <h4 className="experience-modal__position">{selectedExperience.position}</h4>
            <p className="experience-modal__period">
              {formatDate(selectedExperience.startDate)} - {formatDate(selectedExperience.endDate)}{' '}
              {calculateMonthsWorked(selectedExperience.startDate, selectedExperience.endDate)}
            </p>

            <h5 className="experience-modal__subtitle">Responsibilities &amp; Achievements</h5>
            <ul className="experience-modal__details">
              {selectedExperience.details.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
          </div>
        </Modal>
      )}
    </section>
  )
}

export default Experience

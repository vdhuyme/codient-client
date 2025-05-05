import { useState } from 'react'
import './qualification.css'

const Qualification = () => {
  const [activeQualification, setActiveQualification] = useState('education')

  return (
    <section id="qualification" className="qualification section">
      <h2 className="section__title">What I&apos;ve Achieved</h2>
      <span className="section__subtitle">The Road So Far</span>

      <div className="qualification__container container">
        <div className="qualification__tab">
          <div
            onClick={() => setActiveQualification('education')}
            className={
              activeQualification === 'education' ? 'qualification__button qualification__active button__flex' : 'qualification__button button__flex'
            }
          >
            <i className="uil uil-graduation-cap qualification__icon"></i>
            Education
          </div>

          <div
            onClick={() => setActiveQualification('certificate')}
            className={
              activeQualification === 'certificate'
                ? 'qualification__button qualification__active button__flex'
                : 'qualification__button button__flex'
            }
          >
            <i className="uil uil-award qualification__icon"></i>
            Certificate
          </div>
        </div>

        <div className="qualification__section">
          <div className={activeQualification === 'education' ? 'qualification__content qualification__content__active' : 'qualification__content'}>
            <div className="qualification__data">
              <div>
                <h3 className="qualification__title">Information Technology Engineers</h3>
                <span className="qualification__subtitle">Can Tho University - GPA 3.24</span>
                <div className="qualification__calender">
                  <i className="uil uil-calendar-alt"></i> 09/2019 - 05/2024
                </div>
              </div>

              <div>
                <span className="qualification__rounder"></span>
                <span className="qualification__line"></span>
              </div>
            </div>
          </div>
        </div>

        <div className="qualification__section">
          <div className={activeQualification === 'certificate' ? 'qualification__content qualification__content__active' : 'qualification__content'}>
            <div className="qualification__data">
              <div></div>

              <div>
                <span className="qualification__rounder"></span>
                <span className="qualification__line"></span>
              </div>

              <div>
                <h3 className="qualification__title">TOEIC 600</h3>
                <span className="qualification__subtitle">(ETS – Educational Testing Service)</span>
                <div className="qualification__calender">
                  <i className="uil uil-calendar-alt"></i> 01/2024 - 01/2026
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Qualification

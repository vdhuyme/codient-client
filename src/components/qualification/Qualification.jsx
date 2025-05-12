import './qualification.css'

const Qualification = () => {
  const qualifications = [
    {
      id: 1,
      category: 'Education',
      icon: 'uil-graduation-cap',
      title: 'Information Technology Engineers',
      subtitle: 'Can Tho University - GPA 3.24',
      date: '09/2019 - 05/2024',
      position: 'left'
    },
    {
      id: 2,
      category: 'Certificate',
      icon: 'uil-award',
      title: 'TOEIC 600',
      subtitle: '(ETS – Educational Testing Service)',
      date: '01/2024 - 01/2026',
      position: 'right'
    }
  ]

  return (
    <section id="qualification" className="qualification section">
      <h2 className="section__title">What I&apos;ve Achieved</h2>
      <span className="section__subtitle">The Road So Far</span>

      <div className="qualification__container container">
        <div className="qualification__timeline">
          {qualifications.map((qualification) => (
            <div key={qualification.id} className={`qualification__item ${qualification.position}`}>
              <div className="qualification__content-box">
                <div className="qualification__header">
                  <i className={`uil ${qualification.icon} qualification__icon`}></i>
                  <span className="qualification__category">{qualification.category}</span>
                </div>
                <h3 className="qualification__title">{qualification.title}</h3>
                <span className="qualification__subtitle">{qualification.subtitle}</span>
                <div className="qualification__calender">
                  <i className="uil uil-calendar-alt"></i> {qualification.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Qualification

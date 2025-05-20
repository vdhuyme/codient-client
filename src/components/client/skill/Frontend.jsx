const Frontend = () => {
  const skills = [
    {
      group: ['HTML', 'Javascript', 'React', 'Vue 3']
    },
    {
      group: ['CSS', 'Redux', 'TailwindCSS', 'Bootstrap 5']
    }
  ]

  return (
    <div className="skill__content">
      <h3 className="skill__title">Frontend</h3>

      <div className="skill__box">
        {skills.map((group, index) => (
          <div className="skill__group" key={index}>
            {group.group.map((skill, idx) => (
              <div className="skill__data" key={idx}>
                <i className="bx bx-badge-check skill__icon"></i>
                <div>
                  <h3 className="skill__name">{skill}</h3>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Frontend

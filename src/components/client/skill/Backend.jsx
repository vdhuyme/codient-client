const Backend = () => {
  const skills = [
    {
      group: ['NodeJs', 'PHP', 'SQL', 'NoSQL', 'C# .NET', 'Python']
    },
    {
      group: ['ExpressJs', 'Laravel', 'MySQL', 'MongoDB', 'SQL Server', 'FastAPI']
    }
  ]

  return (
    <div className="skill__content">
      <h3 className="skill__title">Backend</h3>

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

export default Backend

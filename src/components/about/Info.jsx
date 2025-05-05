const Info = () => {
  const data = [
    {
      icon: 'bx bx-award',
      title: 'Experience',
      subtitle: 'Over 1 Year'
    },
    {
      icon: 'bx bx-briefcase-alt',
      title: 'Projects Completed',
      subtitle: '10+ Successfully Delivered'
    },
    {
      icon: 'bx bx-support',
      title: 'Customer Support',
      subtitle: 'Available 24/7'
    }
  ]

  return (
    <div className="about__info grid">
      {data.map((item, index) => (
        <div className="about__box" key={index}>
          <i className={`${item.icon} about__icon`}></i>
          <h3 className="about__title">{item.title}</h3>
          <span className="about__subtitle">{item.subtitle}</span>
        </div>
      ))}
    </div>
  )
}

export default Info

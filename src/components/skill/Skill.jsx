import Backend from './Backend'
import Frontend from './Frontend'
import './skill.css'

const Skill = () => {
  return (
    <section id="skill" className="skill section">
      <h2 className="section__title">Skills</h2>
      <span className="section__subtitle">Technical</span>

      <div className="skill__container container grid">
        <Backend />
        <Frontend />
      </div>
    </section>
  )
}

export default Skill

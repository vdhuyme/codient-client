import Data from './Data'
import './home.css'
import Social from './Social'
import profile from '../../assets/profile.png'

const Home = () => {
  return (
    <section id="home" className="home section">
      <div className="home__container container grid">
        <div className="home__content grid">
          <Social />

          <img src={profile} className="home__img" alt="Vo Duc Huy" />

          <Data />
        </div>
      </div>
    </section>
  )
}

export default Home

import { useState } from 'react'
import './header.css'
import ThemeSwitch from '../theme-switch/theme-switch'
import { Link } from 'react-router-dom'

const Header = () => {
  const [toggle, setToggle] = useState(false)

  return (
    <header className="header">
      <nav className="nav container">
        <Link to={'/'} className="nav__logo">
          Vo Duc Huy
        </Link>

        <div className={toggle ? 'nav__menu show__menu' : 'nav__menu'}>
          <ul className="nav__list">
            <li className="nav__item">
              <a href="#home" className="nav__link">
                <i className="uil uil-estate nav__icon"></i> Home
              </a>
            </li>

            <li className="nav__item">
              <a href="#about" className="nav__link">
                <i className="uil uil-user nav__icon"></i> About
              </a>
            </li>

            <li className="nav__item">
              <a href="#experience" className="nav__link">
                <i className="uil uil-shield-check nav__icon"></i> Experience
              </a>
            </li>

            <li className="nav__item">
              <a href="#skill" className="nav__link">
                <i className="uil uil-file-alt nav__icon"></i> Skills
              </a>
            </li>

            <li className="nav__item">
              <a href="#qualification" className="nav__link">
                <i className="uil uil-check-circle nav__icon"></i>
                Qualifications
              </a>
            </li>

            <li className="nav__item">
              <a href="#contact" className="nav__link">
                <i className="uil uil-message nav__icon"></i> Contact
              </a>
            </li>

            <ThemeSwitch />
          </ul>

          <i className="uil uil-times nav__close" onClick={() => setToggle(false)}></i>
        </div>

        <div className="nav__toggle" onClick={() => setToggle(true)}>
          <i className="uil uil-apps"></i>
        </div>
      </nav>
    </header>
  )
}

export default Header

import { useState } from 'react'
import './header.css'
import ThemeSwitch from '../theme-switch/theme-switch'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/auth'

const Header = () => {
  const [toggle, setToggle] = useState(false)
  const { isAuthenticated } = useAuth()

  const navItems = [
    { label: 'Home', icon: 'uil-house-user', link: '#home' },
    { label: 'About', icon: 'uil-user-circle', link: '#about' },
    { label: 'Experience', icon: 'uil-briefcase', link: '#experience' },
    { label: 'Skills', icon: 'uil-brackets-curly', link: '#skill' },
    { label: 'Qualifications', icon: 'uil-award', link: '#qualification' },
    { label: 'Contact', icon: 'uil-comment-message', link: '#contact' }
  ]

  return (
    <header className="header">
      <nav className="nav container">
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="nav__logo">
          Vo Duc Huy
        </Link>

        <div className={toggle ? 'nav__menu show__menu' : 'nav__menu'}>
          <ul className="nav__list">
            {navItems.map((item, index) => (
              <li key={index} className="nav__item">
                <a href={item.link} className="nav__link">
                  <i className={`uil ${item.icon} nav__icon`}></i> {item.label}
                </a>
              </li>
            ))}
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

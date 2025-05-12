import { useEffect, useState } from 'react'
import './theme-switch.css'

const ThemeSwitch = () => {
  const themes = {
    light: {
      icon: 'sun',
      title: 'Light'
    },
    dark: {
      icon: 'moon',
      title: 'Dark'
    },
    system: {
      icon: 'adjust-half',
      title: 'System'
    }
  }

  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      return savedTheme
    }
    return 'system'
  }

  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    if (theme === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      document.documentElement.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light')
    } else {
      document.documentElement.setAttribute('data-theme', theme)
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      switch (prevTheme) {
        case 'light':
          return 'dark'
        case 'dark':
          return 'system'
        default:
          return 'light'
      }
    })
  }

  return (
    <li className="toggle__theme nav__item" onClick={toggleTheme}>
      <a className="nav__link" title={themes[theme].title}>
        <i className={`uil uil-${themes[theme].icon} nav__icon`}></i>
        <span className="theme-text">{themes[theme].title}</span>
      </a>
    </li>
  )
}

export default ThemeSwitch

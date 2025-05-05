import { useEffect, useState } from 'react'
import './theme-provider.css'

const ThemeProvider = () => {
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      return savedTheme
    }
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    return systemPrefersDark ? 'dark' : 'light'
  }

  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <li className="toggle__theme nav__item" onClick={toggleTheme}>
      <a className="nav__link">
        <i className={`uil uil-${theme === 'light' ? 'sun' : 'moon'} nav__icon`}></i>
        {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
      </a>
    </li>
  )
}

export default ThemeProvider

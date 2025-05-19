import { useEffect, useState } from 'react'
import './dashboard-layout.css'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/auth'
import { getStatusLabel } from '@/utils/base-status'

const menuItems = [
  { label: 'Dashboard', icon: 'bx bx-chart', path: '/dashboard' },
  { label: 'Categories', icon: 'bx bx-category', path: 'categories' },
  { label: 'Posts', icon: 'bx bx-message-square-detail', path: 'posts' },
  { label: 'Users', icon: 'bx bx-user', path: 'users' },
  { label: 'Licenses', icon: 'bx bx-key', path: 'licenses' },
  { label: 'Logs', icon: 'bx bx-terminal', path: 'logs' }
]

const DashboardLayout = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 576)
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem('sidebar_collapsed') === 'true'
  })
  const [isSidebarMobileOpen, setSidebarMobileOpen] = useState(false)

  const { logout, authUser } = useAuth()
  const navigate = useNavigate()
  const currentYear = new Date().getFullYear()

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarMobileOpen((prev) => !prev)
    } else {
      setSidebarCollapsed((prev) => {
        localStorage.setItem('sidebar_collapsed', String(!prev))
        return !prev
      })
    }
  }

  const handleThemeChange = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    if (newTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
    localStorage.setItem('theme', newTheme)
  }

  useEffect(() => {
    const handleResize = () => {
      const isNowMobile = window.innerWidth <= 576
      setIsMobile(isNowMobile)

      if (isNowMobile) {
        setSidebarCollapsed(false)
        setSidebarMobileOpen(false)
        localStorage.removeItem('sidebar_collapsed')
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMobile && !e.composedPath().some((el) => el?.classList?.contains('sidebar') || el?.classList?.contains('mobile-menu-btn'))) {
        setSidebarMobileOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isMobile])

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
  }, [theme])

  const goToWebsite = () => navigate('/')

  return (
    <div className={`dashboard ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Overlay (only for mobile + open sidebar) */}
      {isMobile && isSidebarMobileOpen && <div className="sidebar-overlay active" onClick={() => setSidebarMobileOpen(false)}></div>}

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''} ${isSidebarMobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar__logo">
          <h2>Admin</h2>
          <button className="sidebar__toggle" onClick={toggleSidebar}>
            <i className={`bx bx-${isSidebarMobileOpen ? 'x' : 'menu'}`}></i>
          </button>
        </div>

        <div className="sidebar__user">
          <img
            src={authUser?.avatar ?? `https://ui-avatars.com/api/?background=0D8ABC&color=fff&&name=${authUser?.name}`}
            alt="User"
            className="sidebar__user-img"
          />
          <div className="sidebar__user-info">
            <h3>{authUser?.name}</h3>
            <span className="badge badge--success">{getStatusLabel(authUser?.status)}</span>
          </div>
        </div>

        <nav className="sidebar__menu">
          <ul>
            {menuItems.map((item, index) => (
              <li key={index} className="sidebar__item" onClick={() => setSidebarMobileOpen(false)}>
                <NavLink to={item.path} className={({ isActive }) => `sidebar__link ${isActive ? 'active' : ''}`}>
                  <i className={item.icon}></i>
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar__footer">
          <div onClick={() => logout()} className="sidebar__logout">
            <i className="bx bx-log-out"></i>
            <span>Logout</span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="main__content">
        <header className="nav__header">
          {isMobile && (
            <button className="mobile-menu-btn" onClick={toggleSidebar} type="button">
              <i className="bx bx-menu"></i>
            </button>
          )}

          <div className="header__search">
            <i className="bx bx-search"></i>
            <input type="text" placeholder="Search..." />
          </div>

          <div className="header__actions">
            <div className="header__website" onClick={goToWebsite}>
              <i className="bx bx-world"></i>
            </div>
            <div className="header__theme" onClick={handleThemeChange}>
              <i className={`bx ${theme === 'dark' ? 'bx-sun' : 'bx-moon'}`}></i>
            </div>
            <div className="header__notification">
              <i className="bx bx-bell"></i>
              <span className="header__badge">5</span>
            </div>
            <div className="header__message">
              <i className="bx bx-envelope"></i>
              <span className="header__badge">3</span>
            </div>
            <div className="header__profile">
              <img src={authUser?.avatar ?? `https://ui-avatars.com/api/?background=0D8ABC&color=fff&&name=${authUser?.name}`} alt="Profile" />
            </div>
          </div>
        </header>

        <div className="content">
          <Outlet />
        </div>

        <footer className="footer">
          <p>&copy; {currentYear} Vo Duc Huy. All rights reserved.</p>
          <div className="footer__links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </footer>
      </main>
    </div>
  )
}

export default DashboardLayout

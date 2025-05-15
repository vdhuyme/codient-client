import { useEffect, useState } from 'react'
import './dashboard.css'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/auth'

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
    const stored = localStorage.getItem('sidebar_collapsed')
    return stored === 'true'
  })
  const [isSidebarMobileOpen, setSidebarMobileOpen] = useState(false)
  const [isOverlayActive, setOverlayActive] = useState(false)

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarMobileOpen((prev) => !prev)
      setOverlayActive((prev) => !prev)
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
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
      localStorage.setItem('theme', 'light')
    }
  }

  // Set trạng thái mobile và xử lý lần đầu
  useEffect(() => {
    const isMobileView = window.innerWidth <= 576
    setIsMobile(isMobileView)

    if (isMobileView) {
      setSidebarCollapsed(false)
      setSidebarMobileOpen(false)
      setOverlayActive(false)
      localStorage.removeItem('sidebar_collapsed')
    }
  }, [])

  // Theo dõi resize để cập nhật isMobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 576)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Đóng sidebar mobile khi click ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMobile && !e.composedPath().some((el) => el?.classList?.contains('sidebar') || el?.classList?.contains('mobile-menu-btn'))) {
        setSidebarMobileOpen(false)
        setOverlayActive(false)
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

  const navigate = useNavigate()
  const goToWebsite = () => {
    navigate('/')
  }

  const { logout } = useAuth()

  return (
    <div className={`dashboard ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Sidebar overlay for mobile */}
      <div
        className={`sidebar-overlay ${isOverlayActive ? 'active' : ''}`}
        onClick={() => {
          setSidebarMobileOpen(false)
          setOverlayActive(false)
        }}
      ></div>

      <aside className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''} ${isSidebarMobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar__logo">
          <h2>Admin</h2>
          <button className="sidebar__toggle" onClick={toggleSidebar}>
            <i className={`bx bx-${isSidebarMobileOpen ? 'x' : 'menu'}`}></i>
          </button>
        </div>

        <div className="sidebar__user">
          <img src="http://localhost:3009/src/assets/profile.png" alt="User" className="sidebar__user-img" />
          <div className="sidebar__user-info">
            <h3>John Doe</h3>
            <span>Administrator</span>
          </div>
        </div>

        <nav className="sidebar__menu">
          <ul>
            {menuItems.map((item, index) => (
              <li key={index} className="sidebar__item">
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
              <img src="http://localhost:3009/src/assets/profile.png" alt="Profile" />
            </div>
          </div>
        </header>

        <div className="content">
          <Outlet />
        </div>

        <footer className="footer">
          <p>&copy; 2023 Admin Dashboard. All rights reserved.</p>
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

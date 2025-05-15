import { Toaster } from 'react-hot-toast'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Portfolio from './views/portfolio/Portfolio'
import NotFound from './components/not-found/NotFound'
import Login from './views/login/Login'
import PrivateRoute from './routes/private'
import MainLayout from './components/layouts/Main'
import DashboardLayout from './components/layouts/Dashboard'
import DashboardIndex from './views/dashboard/Index'
import CategoryIndex from './views/category/Index'
import PostIndex from './views/post/Index'
import UserIndex from './views/user/Index'
import LicenseIndex from './views/license/Index'
import LogIndex from './views/log/Index'
import PublicRoute from './routes/public'

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>

          <Route path="/" element={<Portfolio />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardIndex />} />
            <Route path="/categories" element={<CategoryIndex />} />
            <Route path="/posts" element={<PostIndex />} />
            <Route path="/users" element={<UserIndex />} />
            <Route path="/licenses" element={<LicenseIndex />} />
            <Route path="/logs" element={<LogIndex />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Toaster position="top-right" />
    </Router>
  )
}

export default App

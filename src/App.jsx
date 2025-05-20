import { Toaster } from 'react-hot-toast'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Portfolio from './views/client/portfolio/Portfolio'
import NotFound from './components/not-found/NotFound'
import Login from './views/auth/login/Login'
import PrivateRoute from './routes/private'
import MainLayout from './components/layouts/Main'
import DashboardLayout from './components/layouts/Dashboard'
import DashboardIndex from './views/admin/dashboard/Index'
import CategoryIndex from './views/admin/categories/Index'
import PostIndex from './views/admin/posts/Index'
import PostCreate from './views/admin/posts/Create'
import PostEdit from './views/admin/posts/Edit'
import UserIndex from './views/admin/users/Index'
import LicenseIndex from './views/admin/licenses/Index'
import LogIndex from './views/admin/logs/Index'
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
            <Route path="/posts/create" element={<PostCreate />} />
            <Route path="/posts/edit/:id" element={<PostEdit />} />

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

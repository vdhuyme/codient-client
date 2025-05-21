import { Toaster } from 'react-hot-toast'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PrivateRoute from './routes/private'
import PublicRoute from './routes/public'
import AuthLayout from '@/components/layouts/auth.layout'
import DashboardLayout from '@/components/layouts/dashboard.layout'
import ClientLayout from '@/components/layouts/client.layout'
import NotFoundPage from '@/pages/error/not.found.page'
import HomePage from '@/pages/client/home.page'
import LoginPage from '@/pages/auth/login.page'
import ResumePage from '@/pages/client/resume.page'
import BlogPage from '@/pages/client/blog.page'
import BlogDetailPage from '@/pages/client/blog.detail.page'

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>
        </Route>

        <Route element={<PrivateRoute />}>
          <Route element={<DashboardLayout />}></Route>
        </Route>

        <Route element={<ClientLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/resume" element={<ResumePage />} />
          <Route path="/posts" element={<BlogPage />} />
          <Route path="/posts/:slug" element={<BlogDetailPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Toaster position="top-right" />
    </Router>
  )
}

export default App

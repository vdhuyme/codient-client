import { Toaster } from 'react-hot-toast'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PrivateRoute from './routes/private'
import PublicRoute from './routes/public'
import AuthLayout from '@/components/layouts/auth.layout'
import AdminLayout from '@/components/layouts/admin.layout'
import ClientLayout from '@/components/layouts/client.layout'
import NotFoundPage from '@/pages/error/not.found.page'
import HomePage from '@/pages/client/home.page'
import LoginPage from '@/pages/auth/login.page'
import ResumePage from '@/pages/client/resume.page'
import BlogPage from '@/pages/client/blog.page'
import BlogDetailPage from '@/pages/client/blog.detail.page'
import RegisterPage from '@/pages/auth/register.page'
import ForgotPasswordPage from '@/pages/auth/forgot.password.page'
import ScrollToTop from '@/components/customs/scroll.to.top'
import StatsPage from '@/pages/dashboard/stats.page'
import PostsPage from '@/pages/dashboard/posts.page'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Route>
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<StatsPage />} />
            <Route path="posts" element={<PostsPage />} />
          </Route>
        </Route>

        <Route element={<ClientLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/resume" element={<ResumePage />} />
          <Route path="/posts" element={<BlogPage />} />
          <Route path="/posts/:slug" element={<BlogDetailPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <ScrollToTop />

      <Toaster position="top-right" />
    </Router>
  )
}

export default App

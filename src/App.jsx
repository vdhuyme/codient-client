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
import CategoriesPage from '@/pages/dashboard/categories.page'
import CommentsPage from '@/pages/dashboard/comments.page'
import ProfilePage from '@/pages/dashboard/profile.page'
import TagsPage from '@/pages/dashboard/tags.page'
import UserPage from '@/pages/dashboard/users.page'
import GoogleCallback from '@/pages/auth/google.callback'
import ScrollProgressBar from '@/components/customs/scroll-progress-bar'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/auth/google/callback" element={<GoogleCallback />} />
          </Route>
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="stats" element={<StatsPage />} />
            <Route path="posts" element={<PostsPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="comments" element={<CommentsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="tags" element={<TagsPage />} />
            <Route path="users" element={<UserPage />} />
          </Route>
        </Route>

        <Route element={<ClientLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/resume" element={<ResumePage />} />
          <Route path="/posts" element={<BlogPage />} />
          <Route path="/posts/:id/:slug" element={<BlogDetailPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <ScrollToTop />
      <ScrollProgressBar />
      <Toaster position="top-right" />
    </Router>
  )
}

export default App

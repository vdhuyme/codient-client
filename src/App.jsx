import { Toaster } from 'react-hot-toast'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Portfolio from './views/portfolio/Portfolio'
import NotFound from './components/not-found/NotFound'
import Login from './views/login/Login'
import PrivateRoute from './routes/private'
import MainLayout from './components/layouts/main'
import DashboardLayout from './components/layouts/Dashboard'
import Index from './views/dashboard'
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
            <Route path="/dashboard" element={<Index />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Toaster position="top-right" />
    </Router>
  )
}

export default App

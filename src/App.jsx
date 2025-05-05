import { Toaster } from 'sonner'
import Footer from './components/footer/Footer'
import Header from './components/header/Header'
import ScrollTop from './components/scroll-top/ScrollTop'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Portfolio from './views/portfolio/Portfolio'
import NotFound from './components/not-found/NotFound'

function App() {
  return (
    <Router>
      <Header />

      <main className="main">
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />

      <ScrollTop />

      <Toaster
        richColors
        toastOptions={{
          className: 'toast'
        }}
      />
    </Router>
  )
}

export default App

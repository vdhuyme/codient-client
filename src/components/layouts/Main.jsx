import Header from '@/components/header/Header'
import Footer from '@/components/footer/Footer'
import ScrollTop from '@/components/scroll-top/ScrollTop'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <>
      <Header />
      <main className="main">
        <Outlet />
      </main>
      <ScrollTop />
      <Footer />
    </>
  )
}

export default MainLayout

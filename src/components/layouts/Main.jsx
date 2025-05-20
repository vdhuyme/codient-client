import Header from '@/components/client/header/Header'
import Footer from '@/components/client/footer/Footer'
import ScrollTop from '@/components/client/scroll-top/ScrollTop'
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

import { useEffect, useState } from 'react'

const ScrollProgressBar = () => {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY
      const winHeight = window.innerHeight
      const docHeight = document.body.scrollHeight
      const totalScroll = (scrollTop / (docHeight - winHeight)) * 100
      setScrollProgress(totalScroll)
    }

    window.addEventListener('scroll', updateScrollProgress)
    return () => window.removeEventListener('scroll', updateScrollProgress)
  }, [])

  return (
    scrollProgress < 99.9 && (
      <div className="fixed top-0 left-0 z-50 h-1 bg-cyan-500 transition-all duration-200 ease-out" style={{ width: `${scrollProgress}%` }} />
    )
  )
}

export default ScrollProgressBar

import './scroll-top.css'

const ScrollTop = () => {
  window.addEventListener('scroll', function () {
    const scrollTop = document.querySelector('.scroll__top')
    if (scrollTop) {
      scrollY >= 560 ? scrollTop.classList.add('show__scroll') : scrollTop.classList.remove('show__scroll')
    }
  })

  return (
    <a href="#" className="scroll__top">
      <i className="uil uil-arrow-up scroll__top__icon"></i>
    </a>
  )
}

export default ScrollTop

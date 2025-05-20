import './footer.css'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer__container container">
        <h1 className="footer__title">Vo Duc Huy</h1>

        <ul className="footer__list">
          <li>
            <a href="#home" className="footer__link">
              Home
            </a>
          </li>

          <li>
            <a href="#about" className="footer__link">
              About
            </a>
          </li>

          <li>
            <a href="#experience" className="footer__link">
              Experience
            </a>
          </li>

          <li>
            <a href="#skill" className="footer__link">
              Skills
            </a>
          </li>

          <li>
            <a href="#qualification" className="footer__link">
              Qualifications
            </a>
          </li>

          <li>
            <a href="#contact" className="footer__link">
              Contact
            </a>
          </li>
        </ul>

        <div className="footer__social">
          <a href="https://www.facebook.com/VDH.me" className="home__social__icon" target="_blank">
            <i className="bx bxl-facebook"></i>
          </a>

          <a href="https://github.com/vdhuyme" className="home__social__icon" target="_blank">
            <i className="bx bxl-github"></i>
          </a>

          <a href="https://www.instagram.com/vd.huy" className="home__social__icon" target="_blank">
            <i className="bx bxl-instagram"></i>
          </a>

          <a href="https://www.linkedin.com/in/vdhme" className="home__social__icon" target="_blank">
            <i className="bx bxl-linkedin"></i>
          </a>
        </div>

        <span className="footer__copy">&#169; {currentYear} Made by Vo Duc Huy ❤. All rights reserved</span>
      </div>
    </footer>
  )
}

export default Footer

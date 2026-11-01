import { Link } from "react-router-dom";
import { HiOutlineHeart } from "react-icons/hi2";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-main">
          <div className="footer-brand">
            <a className="brand brand--footer" href="#home">
              <span className="brand-mark"><HiOutlineHeart aria-hidden="true" /></span>
              <span className="brand-copy"><strong>ayra</strong><small>HOSPITAL</small></span>
            </a>
            <p>Care for every chapter. Thoughtful healthcare, close to home, for you and the people you love.</p>
            <div className="social-links" aria-label="Social media">
              <a href="https://www.facebook.com/" aria-label="Facebook"><FaFacebookF /></a>
              <a href="https://www.instagram.com/" aria-label="Instagram"><FaInstagram /></a>
              <a href="https://www.linkedin.com/" aria-label="LinkedIn"><FaLinkedinIn /></a>
            </div>
          </div>
          <div className="footer-column"><h3>Explore</h3><a href="#about">About Ayra</a><a href="#services">Our services</a><a href="#doctors">Find a doctor</a><a href="#testimonials">Patient stories</a></div>
          <div className="footer-column"><h3>Care & support</h3><a href="#appointment">Request an appointment</a><a href="#contact">Contact us</a><a href="#departments">Departments</a><Link to="/register">Patient registration</Link></div>
          <div className="footer-column footer-contact"><h3>Get in touch</h3><a href="tel:+912240001234">+91 22 4000 1234</a><a href="mailto:hello@ayrahospital.example">hello@ayrahospital.example</a><p>18 Riverside Avenue<br />Pune, Maharashtra 411001</p></div>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} Ayra Hospital. All rights reserved.</span><span>Made with care, for better days.</span></div>
      </div>
    </footer>
  );
}

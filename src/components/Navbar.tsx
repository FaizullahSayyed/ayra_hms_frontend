import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { HiBars3, HiOutlineHeart, HiOutlineMoon, HiOutlineSun, HiXMark } from "react-icons/hi2";
import { useTheme } from "../context/ThemeContext";

const links = [
  ["Home", "home"],
  ["About", "about"],
  ["Services", "services"],
  ["Doctors", "doctors"],
  ["Departments", "departments"],
  ["Contact", "contact"],
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const reduceMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 18);
    const sections = links.map(([, id]) => document.getElementById(id)).filter((section): section is HTMLElement => section !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.15, 0.4] },
    );
    sections.forEach((section) => observer.observe(section));
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <motion.header
      className={`navbar${scrolled ? " navbar--scrolled" : ""}`}
      initial={reduceMotion ? false : { opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.45 }}
    >
      <nav className="nav-wrap container" aria-label="Main navigation">
        <a className="brand" href="#home" onClick={closeMenu} aria-label="Ayra Hospital home">
          <span className="brand-mark"><HiOutlineHeart aria-hidden="true" /></span>
          <span className="brand-copy"><strong>ayra</strong><small>HOSPITAL</small></span>
        </a>
        <div className="nav-links">
          {links.map(([label, id]) => (
            <a key={id} href={`#${id}`} className={active === id ? "nav-link nav-link--active" : "nav-link"}>
              {label}
              {active === id && <motion.span layoutId="nav-indicator" className="nav-indicator" transition={{ duration: reduceMotion ? 0 : 0.25 }} />}
            </a>
          ))}
        </div>
        <div className="nav-actions">
          <button className="theme-toggle icon-button" type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>
            {theme === "light" ? <HiOutlineMoon /> : <HiOutlineSun />}
          </button>
          <Link className="nav-login" to="/login">Log in</Link>
          <a className="button button--primary button--small nav-book" href="#appointment">Request a visit <span aria-hidden="true">↗</span></a>
          <button className="menu-toggle icon-button" type="button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen}>
            {menuOpen ? <HiXMark /> : <HiBars3 />}
          </button>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.div className="mobile-menu" initial={reduceMotion ? false : { opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: reduceMotion ? 0 : 0.2 }}>
              {links.map(([label, id]) => <a key={id} href={`#${id}`} onClick={closeMenu} className={active === id ? "mobile-link mobile-link--active" : "mobile-link"}>{label}</a>)}
              <Link className="mobile-link" to="/login" onClick={closeMenu}>Log in</Link>
              <a className="button button--primary mobile-book" href="#appointment" onClick={closeMenu}>Request a visit <span aria-hidden="true">↗</span></a>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}

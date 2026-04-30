import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/#projects', label: 'Projects' },
  { path: '/#team', label: 'Team' },
  { path: '/terms', label: 'Terms' },
  { path: '/privacy', label: 'Privacy' },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isScrolled } = useScrollPosition();
  const location = useLocation();

  const isHome = location.pathname === '/';

  const handleNavClick = (path: string) => {
    setMenuOpen(false);
    if (path.startsWith('/#') && isHome) {
      const id = path.replace('/#', '');
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-corolas-bg/95 backdrop-blur-xl'
            : 'bg-corolas-bg/80 backdrop-blur-md'
        }`}
        style={{ borderBottom: '1px solid rgba(212, 175, 55, 0.12)' }}
      >
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/corolas-logo-white.png"
              alt="Corolas"
              className="h-10 w-auto"
              style={{ filter: 'brightness(1.1)' }}
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive =
                link.path === '/'
                  ? location.pathname === '/'
                  : location.pathname === link.path;
              const isHash = link.path.startsWith('/#');

              return isHash ? (
                <button
                  key={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className={`relative text-sm font-medium transition-colors duration-300 ${
                    isActive && isHome
                      ? 'text-corolas-gold'
                      : 'text-corolas-text-secondary hover:text-corolas-gold'
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-[1px] bg-corolas-gold transition-all duration-300 ${
                      isActive && isHome ? 'w-full' : 'w-0'
                    }`}
                  />
                </button>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={`relative text-sm font-medium transition-colors duration-300 ${
                    isActive
                      ? 'text-corolas-gold'
                      : 'text-corolas-text-secondary hover:text-corolas-gold'
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-[1px] bg-corolas-gold transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-corolas-text-secondary hover:text-corolas-gold transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-corolas-bg/98 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {navLinks.map((link, i) => {
              const isHash = link.path.startsWith('/#');
              return isHash ? (
                <motion.button
                  key={link.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => handleNavClick(link.path)}
                  className="text-2xl font-display font-medium text-corolas-text hover:text-corolas-gold transition-colors"
                >
                  {link.label}
                </motion.button>
              ) : (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    className="text-2xl font-display font-medium text-corolas-text hover:text-corolas-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

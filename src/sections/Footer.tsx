import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer
      className="bg-corolas-bg py-16"
      style={{ borderTop: '1px solid rgba(212, 175, 55, 0.12)' }}
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand Column */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img
                src="/corolas-logo-white.png"
                alt="Corolas"
                className="h-8 w-auto"
                style={{ filter: 'brightness(1.1)' }}
              />
            </Link>
            <p className="text-corolas-text-muted text-sm">
              Investigate. Imagine. Innovate.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-corolas-text text-sm uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-corolas-text-secondary text-sm hover:text-corolas-gold transition-colors duration-300 relative group"
                >
                  Home
                  <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-corolas-gold transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
              <li>
                <a
                  href="/#projects"
                  className="text-corolas-text-secondary text-sm hover:text-corolas-gold transition-colors duration-300 relative group"
                >
                  Projects
                  <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-corolas-gold transition-all duration-300 group-hover:w-full" />
                </a>
              </li>
              <li>
                <a
                  href="/#team"
                  className="text-corolas-text-secondary text-sm hover:text-corolas-gold transition-colors duration-300 relative group"
                >
                  Team
                  <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-corolas-gold transition-all duration-300 group-hover:w-full" />
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-display font-semibold text-corolas-text text-sm uppercase tracking-wider mb-4">
              Legal
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/terms"
                  className="text-corolas-text-secondary text-sm hover:text-corolas-gold transition-colors duration-300 relative group"
                >
                  Terms of Service
                  <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-corolas-gold transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-corolas-text-secondary text-sm hover:text-corolas-gold transition-colors duration-300 relative group"
                >
                  Privacy Policy
                  <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-corolas-gold transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(212, 175, 55, 0.08)' }}
        >
          <p className="text-corolas-text-muted text-xs">
            &copy; 2025 Corolas. All rights reserved.
          </p>
          <p className="text-corolas-text-muted text-xs">www.corolas.top</p>
        </div>
      </div>
    </footer>
  );
}

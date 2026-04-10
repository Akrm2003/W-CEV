import { Link, useLocation } from 'react-router-dom';
import { Layers, Github } from 'lucide-react';
import '../styles/Navbar.css';

function Navbar() {
  const location = useLocation();
  const isEditor = location.pathname.startsWith('/editor');

  return (
    <nav className="navbar glass-panel">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <Layers className="brand-icon" />
          <span className="brand-text">W-CEV</span>
        </Link>
        
        <div className="navbar-links">
          {!isEditor && (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/editor/new" className="btn btn-primary">New Component</Link>
            </>
          )}
          {isEditor && (
            <Link to="/dashboard" className="btn btn-secondary">Exit Editor</Link>
          )}
          <a href="https://github.com/Akrm2003/W-CEV" target="_blank" rel="noopener noreferrer" className="btn-icon">
            <Github size={20} />
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

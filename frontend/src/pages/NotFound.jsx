import { Link } from 'react-router-dom';
import { Ghost } from 'lucide-react';

function NotFound() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
      <Ghost size={64} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>404</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.2rem' }}>
        The component or page you are looking for does not exist.
      </p>
      <Link to="/" className="btn btn-primary">
        Return Home
      </Link>
    </div>
  );
}

export default NotFound;

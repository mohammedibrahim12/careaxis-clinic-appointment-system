import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export default function PublicHeader() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="public-header">
      <Link to="/" className="brand">
        <span className="brand-mark">CA</span>
        <span>
          <strong>CareAxis</strong>
          <small>Clinic Appointment System</small>
        </span>
      </Link>

      <nav className="public-nav">
        <NavLink to="/" className="public-link">Home</NavLink>
        <NavLink to="/doctors" className="public-link">Doctors</NavLink>
        {isAuthenticated ? (
          <>
            <NavLink to="/dashboard" className="public-link">Dashboard</NavLink>
            <button type="button" className="ghost-button" onClick={logout}>Sign Out</button>
          </>
        ) : (
          <NavLink to="/auth" className="primary-button compact">
            Sign In
          </NavLink>
        )}
        {isAuthenticated ? <span className="role-chip role-mini">{user.role}</span> : null}
      </nav>
    </header>
  );
}

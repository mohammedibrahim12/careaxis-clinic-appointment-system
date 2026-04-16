import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const navigationByRole = {
  patient: [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/appointments', label: 'Appointments' },
    { to: '/doctors', label: 'Doctors' },
  ],
  doctor: [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/appointments', label: 'Appointments' },
    { to: '/doctors', label: 'Doctors' },
  ],
  admin: [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/appointments', label: 'Appointments' },
    { to: '/manage-doctors', label: 'Manage Doctors' },
    { to: '/doctors', label: 'Doctors' },
  ],
};

export default function AppShell({
  title,
  subtitle,
  actions,
  children,
}) {
  const { user, logout } = useAuth();
  const navigation = navigationByRole[user.role] || [];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link to="/" className="brand">
          <span className="brand-mark">CA</span>
          <span>
            <strong>CareAxis</strong>
            <small>Clinic Appointment System</small>
          </span>
        </Link>

        <div className="sidebar-profile">
          <p className="eyebrow">Signed in as</p>
          <h3>{user.name}</h3>
          <span className={`role-chip role-${user.role}`}>{user.role}</span>
        </div>

        <nav className="sidebar-nav">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button type="button" className="ghost-button full-width" onClick={logout}>
          Sign Out
        </button>
      </aside>

      <main className="page-shell">
        <header className="page-header">
          <div>
            <p className="eyebrow">CareAxis Workspace</p>
            <h1>{title}</h1>
            {subtitle ? <p className="page-subtitle">{subtitle}</p> : null}
          </div>

          {actions ? <div className="page-actions">{actions}</div> : null}
        </header>

        {children}
      </main>
    </div>
  );
}

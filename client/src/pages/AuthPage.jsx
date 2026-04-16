import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import PublicHeader from '../components/PublicHeader';
import { useAuth } from '../context/useAuth';

const initialRegisterState = {
  name: '',
  email: '',
  password: '',
  phone: '',
  gender: '',
  age: '',
};

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, login, register } = useAuth();

  const [mode, setMode] = useState('login');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState(initialRegisterState);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextPath = location.state?.from?.pathname || '/dashboard';

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedback('');

    try {
      await login(loginForm);
      navigate(nextPath, { replace: true });
    } catch (error) {
      setFeedback(error.response?.data?.message || 'Unable to sign in right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedback('');

    try {
      await register({
        ...registerForm,
        age: registerForm.age ? Number(registerForm.age) : null,
      });
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setFeedback(error.response?.data?.message || 'Unable to create account right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="public-page">
      <PublicHeader />

      <section className="auth-layout">
        <div className="auth-panel warm-panel">
          <p className="eyebrow">Project Demo Access</p>
          <h1>Use the app as a patient, doctor, or admin.</h1>
          <p>
            The server creates a default admin on first run. If you load demo data with
            <code> npm run seed</code>, you also get prebuilt doctor and patient accounts.
          </p>

          <div className="demo-grid">
            <article className="demo-card">
              <h3>Admin</h3>
              <p><strong>Email:</strong> admin@careaxis.local</p>
              <p><strong>Password:</strong> Admin@123</p>
            </article>
            <article className="demo-card">
              <h3>Seeded Doctor</h3>
              <p><strong>Email:</strong> asha@careaxis.local</p>
              <p><strong>Password:</strong> Pass@123</p>
            </article>
            <article className="demo-card">
              <h3>Seeded Patient</h3>
              <p><strong>Email:</strong> riya@careaxis.local</p>
              <p><strong>Password:</strong> Pass@123</p>
            </article>
          </div>
        </div>

        <div className="auth-panel form-panel">
          <div className="tab-row">
            <button
              type="button"
              className={mode === 'login' ? 'tab-button active' : 'tab-button'}
              onClick={() => setMode('login')}
            >
              Sign In
            </button>
            <button
              type="button"
              className={mode === 'register' ? 'tab-button active' : 'tab-button'}
              onClick={() => setMode('register')}
            >
              Register
            </button>
          </div>

          {mode === 'login' ? (
            <form className="stack-form" onSubmit={handleLogin}>
              <label>
                Email
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(event) => setLoginForm((current) => ({ ...current, email: event.target.value }))}
                  required
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))}
                  required
                />
              </label>
              <button type="submit" className="primary-button" disabled={isSubmitting}>
                {isSubmitting ? 'Signing In...' : 'Access Dashboard'}
              </button>
            </form>
          ) : (
            <form className="stack-form" onSubmit={handleRegister}>
              <label>
                Full name
                <input
                  type="text"
                  value={registerForm.name}
                  onChange={(event) => setRegisterForm((current) => ({ ...current, name: event.target.value }))}
                  required
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  value={registerForm.email}
                  onChange={(event) => setRegisterForm((current) => ({ ...current, email: event.target.value }))}
                  required
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  value={registerForm.password}
                  onChange={(event) => setRegisterForm((current) => ({ ...current, password: event.target.value }))}
                  required
                />
              </label>
              <label>
                Phone
                <input
                  type="text"
                  value={registerForm.phone}
                  onChange={(event) => setRegisterForm((current) => ({ ...current, phone: event.target.value }))}
                />
              </label>
              <div className="form-split">
                <label>
                  Gender
                  <select
                    value={registerForm.gender}
                    onChange={(event) => setRegisterForm((current) => ({ ...current, gender: event.target.value }))}
                  >
                    <option value="">Select</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                  </select>
                </label>
                <label>
                  Age
                  <input
                    type="number"
                    min="0"
                    value={registerForm.age}
                    onChange={(event) => setRegisterForm((current) => ({ ...current, age: event.target.value }))}
                  />
                </label>
              </div>
              <button type="submit" className="primary-button" disabled={isSubmitting}>
                {isSubmitting ? 'Creating Account...' : 'Create Patient Account'}
              </button>
            </form>
          )}

          {feedback ? <p className="form-feedback">{feedback}</p> : null}
        </div>
      </section>
    </div>
  );
}

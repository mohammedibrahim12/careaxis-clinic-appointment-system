import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const DoctorsPage = lazy(() => import('./pages/DoctorsPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const AppointmentsPage = lazy(() => import('./pages/AppointmentsPage'));
const ManageDoctorsPage = lazy(() => import('./pages/ManageDoctorsPage'));

export default function App() {
  return (
    <Suspense fallback={<div className="loading-screen"><div className="spinner" /><p>Loading page...</p></div>}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/doctors" element={<DoctorsPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
        </Route>

        <Route element={<ProtectedRoute roles={['admin']} />}>
          <Route path="/manage-doctors" element={<ManageDoctorsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

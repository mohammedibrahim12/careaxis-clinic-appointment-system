import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import PublicHeader from '../components/PublicHeader';
import { formatCurrency } from '../utils/format';

export default function LandingPage() {
  const [featuredDoctors, setFeaturedDoctors] = useState([]);

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const { data } = await api.get('/doctors');
        setFeaturedDoctors(data.doctors.slice(0, 3));
      } catch {
        setFeaturedDoctors([]);
      }
    };

    loadDoctors();
  }, []);

  return (
    <div className="public-page">
      <PublicHeader />

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Zero-cost MERN project</p>
          <h1>Modern clinic scheduling for patients, doctors, and admins.</h1>
          <p className="hero-text">
            CareAxis digitizes appointments, tracks doctor availability, and gives every role
            a dashboard that feels like a real clinic operations tool.
          </p>

          <div className="hero-actions">
            <Link to="/auth" className="primary-button">Launch Workspace</Link>
            <Link to="/doctors" className="secondary-button">Browse Doctors</Link>
          </div>

          <div className="hero-stats">
            <article>
              <strong>3 roles</strong>
              <span>Admin, doctor, patient</span>
            </article>
            <article>
              <strong>Live booking flow</strong>
              <span>Validated against doctor schedule</span>
            </article>
            <article>
              <strong>Zero cost</strong>
              <span>Runs fully on localhost</span>
            </article>
          </div>
        </div>

        <div className="hero-panel">
          <div className="panel-card accent-panel">
            <p className="eyebrow">What this project demonstrates</p>
            <ul className="check-list">
              <li>JWT authentication and role-based access</li>
              <li>Doctor availability management</li>
              <li>Appointment creation, updates, and cancellation</li>
              <li>Admin analytics with charts and recent activity</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="public-section">
        <div className="section-heading">
          <p className="eyebrow">Core Modules</p>
          <h2>Built to look like a real clinic operations platform</h2>
        </div>

        <div className="feature-grid">
          <article className="feature-card">
            <h3>Patient Portal</h3>
            <p>Register, browse doctors, book appointments, and track visit history from one place.</p>
          </article>
          <article className="feature-card">
            <h3>Doctor Workspace</h3>
            <p>Review the queue, update appointment statuses, and work with a clear weekly workload view.</p>
          </article>
          <article className="feature-card">
            <h3>Admin Control Room</h3>
            <p>Create doctor accounts, monitor totals, and inspect appointment trends through dashboards.</p>
          </article>
        </div>
      </section>

      <section className="public-section">
        <div className="section-heading">
          <p className="eyebrow">Featured Specialists</p>
          <h2>Example doctors already supported by the platform</h2>
        </div>

        <div className="doctor-grid">
          {featuredDoctors.map((doctor) => (
            <article key={doctor.id} className="doctor-card">
              <div className="doctor-avatar">{doctor.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div>
              <div>
                <h3>{doctor.name}</h3>
                <p className="muted-text">{doctor.specialization}</p>
              </div>
              <p>{doctor.bio}</p>
              <div className="doctor-meta">
                <span>{doctor.experienceYears} years experience</span>
                <span>{formatCurrency(doctor.consultationFee)}</span>
              </div>
              <span className="info-chip">{doctor.location}</span>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

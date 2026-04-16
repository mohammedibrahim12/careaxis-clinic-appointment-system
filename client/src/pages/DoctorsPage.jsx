import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import PublicHeader from '../components/PublicHeader';
import { useAuth } from '../context/useAuth';
import { formatCurrency } from '../utils/format';

export default function DoctorsPage() {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const { data } = await api.get('/doctors');
        setDoctors(data.doctors);
      } finally {
        setLoading(false);
      }
    };

    loadDoctors();
  }, []);

  const visibleDoctors = doctors.filter((doctor) => (
    `${doctor.name} ${doctor.specialization} ${doctor.location} ${doctor.qualifications}`
      .toLowerCase()
      .includes(search.toLowerCase())
  ));

  return (
    <div className="public-page">
      <PublicHeader />

      <section className="list-hero">
        <div>
          <p className="eyebrow">Doctor Directory</p>
          <h1>Browse specialists, schedules, and consultation details.</h1>
        </div>

        <label className="search-box">
          <span>Search</span>
          <input
            type="text"
            placeholder="Search by doctor, specialty, or clinic"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
      </section>

      {loading ? <p className="info-banner">Loading doctors...</p> : null}

      <div className="doctor-grid">
        {visibleDoctors.map((doctor) => (
          <article key={doctor.id} className="doctor-card detailed-card">
            <div className="doctor-card-header">
              <div className="doctor-avatar">{doctor.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div>
              <div>
                <h2>{doctor.name}</h2>
                <p className="muted-text">{doctor.specialization}</p>
              </div>
            </div>

            <p>{doctor.bio}</p>

            <div className="doctor-meta">
              <span>{doctor.experienceYears} years experience</span>
              <span>{formatCurrency(doctor.consultationFee)}</span>
              <span>Rating {doctor.rating}</span>
            </div>

            <div className="schedule-strip">
              {doctor.availability.slice(0, 3).map((slot) => (
                <span key={`${doctor.id}-${slot.day}`} className="info-chip">
                  {slot.day}: {slot.startTime} - {slot.endTime}
                </span>
              ))}
            </div>

            <footer className="doctor-footer">
              <span className="info-chip">{doctor.location}</span>
              {user?.role === 'patient' ? (
                <Link to={`/appointments?doctor=${doctor.id}`} className="primary-button compact">
                  Book Appointment
                </Link>
              ) : (
                <Link to={user ? '/dashboard' : '/auth'} className="secondary-button compact">
                  {user ? 'Open Dashboard' : 'Sign In to Continue'}
                </Link>
              )}
            </footer>
          </article>
        ))}
      </div>

      {!loading && visibleDoctors.length === 0 ? (
        <p className="info-banner">No doctors matched your current search.</p>
      ) : null}
    </div>
  );
}

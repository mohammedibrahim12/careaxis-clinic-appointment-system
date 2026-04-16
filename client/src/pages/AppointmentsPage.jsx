import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api/client';
import AppShell from '../components/AppShell';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/useAuth';
import { formatCurrency, formatDateTime } from '../utils/format';

export default function AppointmentsPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [notesById, setNotesById] = useState({});
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);
  const [bookingForm, setBookingForm] = useState({
    doctorId: searchParams.get('doctor') || '',
    appointmentDate: '',
    reason: '',
  });

  const selectedDoctor = doctors.find((doctor) => doctor.id === bookingForm.doctorId);

  const loadPageData = async (role) => {
    setLoading(true);
    setFeedback('');

    try {
      const requests = [api.get('/appointments')];
      if (role === 'patient') {
        requests.push(api.get('/doctors'));
      }

      const [appointmentsResponse, doctorsResponse] = await Promise.all(requests);
      setAppointments(appointmentsResponse.data.appointments);
      if (doctorsResponse) {
        setDoctors(doctorsResponse.data.doctors);
      }
    } catch (error) {
      setFeedback(error.response?.data?.message || 'Unable to load appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPageData(user.role);
  }, [user.role]);

  useEffect(() => {
    const doctorId = searchParams.get('doctor');
    if (doctorId) {
      setBookingForm((current) => ({ ...current, doctorId }));
    }
  }, [searchParams]);

  const filteredAppointments = statusFilter === 'all'
    ? appointments
    : appointments.filter((appointment) => appointment.status === statusFilter);

  const handleBookAppointment = async (event) => {
    event.preventDefault();
    setFeedback('');

    try {
      await api.post('/appointments', bookingForm);
      setBookingForm({
        doctorId: searchParams.get('doctor') || '',
        appointmentDate: '',
        reason: '',
      });
      setFeedback('Appointment requested successfully.');
      loadPageData(user.role);
    } catch (error) {
      setFeedback(error.response?.data?.message || 'Unable to create appointment.');
    }
  };

  const handleStatusUpdate = async (appointmentId, status) => {
    setFeedback('');

    try {
      await api.patch(`/appointments/${appointmentId}/status`, {
        status,
        doctorNotes: notesById[appointmentId] || '',
      });
      setFeedback(`Appointment marked as ${status}.`);
      loadPageData(user.role);
    } catch (error) {
      setFeedback(error.response?.data?.message || 'Unable to update appointment.');
    }
  };

  const handleCancel = async (appointmentId) => {
    setFeedback('');

    try {
      await api.patch(`/appointments/${appointmentId}/cancel`, {
        cancellationReason: 'Cancelled from dashboard',
      });
      setFeedback('Appointment cancelled.');
      loadPageData(user.role);
    } catch (error) {
      setFeedback(error.response?.data?.message || 'Unable to cancel appointment.');
    }
  };

  return (
    <AppShell
      title="Appointments"
      subtitle="Book consultations, manage the queue, and keep every visit organized."
      actions={<Link to="/doctors" className="secondary-button compact">Doctor Directory</Link>}
    >
      {feedback ? <p className={feedback.includes('Unable') ? 'error-banner' : 'success-banner'}>{feedback}</p> : null}
      {loading ? <p className="info-banner">Loading appointment workspace...</p> : null}

      {user.role === 'patient' ? (
        <section className="panel-card booking-layout">
          <div className="section-heading tight">
            <h2>Book a New Appointment</h2>
          </div>
          <form className="stack-form" onSubmit={handleBookAppointment}>
            <label>
              Select doctor
              <select
                value={bookingForm.doctorId}
                onChange={(event) => setBookingForm((current) => ({ ...current, doctorId: event.target.value }))}
                required
              >
                <option value="">Choose a doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name} - {doctor.specialization}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Appointment date & time
              <input
                type="datetime-local"
                value={bookingForm.appointmentDate}
                onChange={(event) => setBookingForm((current) => ({ ...current, appointmentDate: event.target.value }))}
                required
              />
            </label>
            <label>
              Reason for visit
              <textarea
                rows="4"
                value={bookingForm.reason}
                onChange={(event) => setBookingForm((current) => ({ ...current, reason: event.target.value }))}
                placeholder="Describe symptoms or the purpose of the consultation"
                required
              />
            </label>
            <button type="submit" className="primary-button">Request Appointment</button>
          </form>

          {selectedDoctor ? (
            <aside className="doctor-preview">
              <h3>{selectedDoctor.name}</h3>
              <p className="muted-text">{selectedDoctor.specialization}</p>
              <p>{selectedDoctor.bio}</p>
              <p><strong>Fee:</strong> {formatCurrency(selectedDoctor.consultationFee)}</p>
              <div className="chip-grid">
                {selectedDoctor.availability.map((slot) => (
                  <span key={`${slot.day}-${slot.startTime}`} className="info-chip">
                    {slot.day}: {slot.startTime} - {slot.endTime}
                  </span>
                ))}
              </div>
            </aside>
          ) : null}
        </section>
      ) : null}

      <section className="panel-card">
        <div className="appointments-toolbar">
          <div className="section-heading tight">
            <h2>{user.role === 'patient' ? 'Your Appointments' : 'Clinic Appointment Queue'}</h2>
          </div>
          <div className="filter-row">
            {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((item) => (
              <button
                key={item}
                type="button"
                className={statusFilter === item ? 'filter-chip active' : 'filter-chip'}
                onClick={() => setStatusFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="appointment-grid">
          {filteredAppointments.map((appointment) => {
            const counterparty = user.role === 'patient' ? appointment.doctor : appointment.patient;
            const canPatientCancel = user.role === 'patient' && ['pending', 'confirmed'].includes(appointment.status);

            return (
              <article key={appointment.id} className="appointment-card">
                <div className="feed-heading">
                  <div>
                    <h3>{counterparty?.name}</h3>
                    <p className="muted-text">
                      {appointment.doctor?.specialization || counterparty?.email}
                    </p>
                  </div>
                  <StatusBadge status={appointment.status} />
                </div>

                <p><strong>When:</strong> {formatDateTime(appointment.appointmentDate)}</p>
                <p><strong>Reason:</strong> {appointment.reason}</p>
                {appointment.doctor?.consultationFee ? (
                  <p><strong>Consultation Fee:</strong> {formatCurrency(appointment.doctor.consultationFee)}</p>
                ) : null}
                {appointment.doctorNotes ? <p><strong>Doctor Notes:</strong> {appointment.doctorNotes}</p> : null}
                {appointment.cancellationReason ? <p><strong>Cancellation:</strong> {appointment.cancellationReason}</p> : null}

                {(user.role === 'doctor' || user.role === 'admin') ? (
                  <div className="appointment-actions">
                    <textarea
                      rows="3"
                      placeholder="Doctor notes"
                      value={notesById[appointment.id] ?? appointment.doctorNotes ?? ''}
                      onChange={(event) => setNotesById((current) => ({
                        ...current,
                        [appointment.id]: event.target.value,
                      }))}
                    />
                    <div className="action-row">
                      <button type="button" className="secondary-button compact" onClick={() => handleStatusUpdate(appointment.id, 'confirmed')}>
                        Confirm
                      </button>
                      <button type="button" className="secondary-button compact" onClick={() => handleStatusUpdate(appointment.id, 'completed')}>
                        Complete
                      </button>
                      <button type="button" className="ghost-button compact" onClick={() => handleCancel(appointment.id)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : null}

                {canPatientCancel ? (
                  <button type="button" className="ghost-button compact" onClick={() => handleCancel(appointment.id)}>
                    Cancel Appointment
                  </button>
                ) : null}
              </article>
            );
          })}
        </div>

        {!loading && filteredAppointments.length === 0 ? (
          <p className="info-banner">No appointments found for this filter.</p>
        ) : null}
      </section>
    </AppShell>
  );
}

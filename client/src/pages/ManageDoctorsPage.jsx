import { useEffect, useState } from 'react';
import api from '../api/client';
import AppShell from '../components/AppShell';
import { daysOfWeek, formatCurrency } from '../utils/format';

const buildAvailabilityRow = () => ({
  day: 'Monday',
  startTime: '10:00',
  endTime: '13:00',
  slotDuration: 30,
});

const buildDoctorForm = () => ({
  name: '',
  email: '',
  password: 'Pass@123',
  phone: '',
  specialization: '',
  qualifications: '',
  experienceYears: 1,
  consultationFee: 500,
  location: '',
  clinicRoom: '',
  bio: '',
  isAvailable: true,
  availability: [buildAvailabilityRow()],
});

export default function ManageDoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [editingId, setEditingId] = useState('');
  const [form, setForm] = useState(buildDoctorForm());
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);

  const loadDoctors = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/doctors');
      setDoctors(data.doctors);
    } catch (error) {
      setFeedback(error.response?.data?.message || 'Unable to load doctors.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const resetForm = () => {
    setEditingId('');
    setForm(buildDoctorForm());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback('');

    const payload = {
      ...form,
      experienceYears: Number(form.experienceYears),
      consultationFee: Number(form.consultationFee),
      availability: form.availability.map((slot) => ({
        ...slot,
        slotDuration: Number(slot.slotDuration),
      })),
    };

    try {
      if (editingId) {
        await api.put(`/doctors/${editingId}`, payload);
        setFeedback('Doctor profile updated.');
      } else {
        await api.post('/doctors', payload);
        setFeedback('Doctor created successfully.');
      }

      resetForm();
      loadDoctors();
    } catch (error) {
      setFeedback(error.response?.data?.message || 'Unable to save doctor.');
    }
  };

  const handleEdit = (doctor) => {
    setEditingId(doctor.id);
    setForm({
      name: doctor.name,
      email: doctor.email,
      password: '',
      phone: doctor.phone || '',
      specialization: doctor.specialization,
      qualifications: doctor.qualifications,
      experienceYears: doctor.experienceYears,
      consultationFee: doctor.consultationFee,
      location: doctor.location,
      clinicRoom: doctor.clinicRoom || '',
      bio: doctor.bio || '',
      isAvailable: doctor.isAvailable,
      availability: doctor.availability?.length ? doctor.availability : [buildAvailabilityRow()],
    });
  };

  const updateAvailabilityRow = (index, field, value) => {
    setForm((current) => ({
      ...current,
      availability: current.availability.map((slot, slotIndex) => (
        slotIndex === index ? { ...slot, [field]: value } : slot
      )),
    }));
  };

  return (
    <AppShell
      title="Manage Doctors"
      subtitle="Create doctor logins, maintain their profiles, and adjust clinic schedules."
      actions={<button type="button" className="secondary-button compact" onClick={resetForm}>New Doctor</button>}
    >
      {feedback ? <p className={feedback.includes('Unable') ? 'error-banner' : 'success-banner'}>{feedback}</p> : null}
      {loading ? <p className="info-banner">Loading doctors...</p> : null}

      <section className="manage-layout">
        <section className="panel-card">
          <div className="section-heading tight">
            <h2>{editingId ? 'Edit Doctor' : 'Create Doctor'}</h2>
          </div>

          <form className="stack-form" onSubmit={handleSubmit}>
            <div className="form-split">
              <label>
                Full name
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  required
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  required
                  disabled={Boolean(editingId)}
                />
              </label>
            </div>

            {!editingId ? (
              <label>
                Temporary password
                <input
                  type="text"
                  value={form.password}
                  onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                  required
                />
              </label>
            ) : null}

            <div className="form-split">
              <label>
                Phone
                <input
                  type="text"
                  value={form.phone}
                  onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                />
              </label>
              <label>
                Specialization
                <input
                  type="text"
                  value={form.specialization}
                  onChange={(event) => setForm((current) => ({ ...current, specialization: event.target.value }))}
                  required
                />
              </label>
            </div>

            <label>
              Qualifications
              <input
                type="text"
                value={form.qualifications}
                onChange={(event) => setForm((current) => ({ ...current, qualifications: event.target.value }))}
              />
            </label>

            <div className="form-split">
              <label>
                Experience in years
                <input
                  type="number"
                  min="0"
                  value={form.experienceYears}
                  onChange={(event) => setForm((current) => ({ ...current, experienceYears: event.target.value }))}
                />
              </label>
              <label>
                Consultation fee
                <input
                  type="number"
                  min="0"
                  value={form.consultationFee}
                  onChange={(event) => setForm((current) => ({ ...current, consultationFee: event.target.value }))}
                />
              </label>
            </div>

            <div className="form-split">
              <label>
                Location
                <input
                  type="text"
                  value={form.location}
                  onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))}
                />
              </label>
              <label>
                Clinic room
                <input
                  type="text"
                  value={form.clinicRoom}
                  onChange={(event) => setForm((current) => ({ ...current, clinicRoom: event.target.value }))}
                />
              </label>
            </div>

            <label>
              Bio
              <textarea
                rows="4"
                value={form.bio}
                onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))}
              />
            </label>

            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={form.isAvailable}
                onChange={(event) => setForm((current) => ({ ...current, isAvailable: event.target.checked }))}
              />
              Available for booking
            </label>

            <div className="availability-editor">
              <div className="section-heading tight">
                <h2>Availability</h2>
                <button
                  type="button"
                  className="ghost-button compact"
                  onClick={() => setForm((current) => ({
                    ...current,
                    availability: [...current.availability, buildAvailabilityRow()],
                  }))}
                >
                  Add Slot
                </button>
              </div>

              {form.availability.map((slot, index) => (
                <div key={`${slot.day}-${index}`} className="availability-row">
                  <select value={slot.day} onChange={(event) => updateAvailabilityRow(index, 'day', event.target.value)}>
                    {daysOfWeek.map((day) => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                  <input
                    type="time"
                    value={slot.startTime}
                    onChange={(event) => updateAvailabilityRow(index, 'startTime', event.target.value)}
                  />
                  <input
                    type="time"
                    value={slot.endTime}
                    onChange={(event) => updateAvailabilityRow(index, 'endTime', event.target.value)}
                  />
                  <input
                    type="number"
                    min="15"
                    step="15"
                    value={slot.slotDuration}
                    onChange={(event) => updateAvailabilityRow(index, 'slotDuration', event.target.value)}
                  />
                  <button
                    type="button"
                    className="ghost-button compact"
                    onClick={() => setForm((current) => ({
                      ...current,
                      availability: current.availability.filter((_, slotIndex) => slotIndex !== index),
                    }))}
                    disabled={form.availability.length === 1}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="action-row">
              <button type="submit" className="primary-button">
                {editingId ? 'Update Doctor' : 'Create Doctor'}
              </button>
              {editingId ? (
                <button type="button" className="ghost-button" onClick={resetForm}>
                  Cancel Edit
                </button>
              ) : null}
            </div>
          </form>
        </section>

        <section className="panel-card">
          <div className="section-heading tight">
            <h2>Existing Doctors</h2>
          </div>
          <div className="feed-list">
            {doctors.map((doctor) => (
              <article key={doctor.id} className="feed-card doctor-management-card">
                <div className="feed-heading">
                  <div>
                    <h3>{doctor.name}</h3>
                    <p className="muted-text">{doctor.specialization}</p>
                  </div>
                  <button type="button" className="secondary-button compact" onClick={() => handleEdit(doctor)}>
                    Edit
                  </button>
                </div>
                <p>{doctor.bio}</p>
                <p><strong>Fee:</strong> {formatCurrency(doctor.consultationFee)}</p>
                <p><strong>Location:</strong> {doctor.location}</p>
                <div className="chip-grid">
                  {doctor.availability.slice(0, 3).map((slot) => (
                    <span key={`${doctor.id}-${slot.day}`} className="info-chip">
                      {slot.day}: {slot.startTime} - {slot.endTime}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </AppShell>
  );
}

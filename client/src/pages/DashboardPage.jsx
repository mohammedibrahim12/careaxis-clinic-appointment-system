import { useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import api from '../api/client';
import AppShell from '../components/AppShell';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/useAuth';
import {
  capitalize,
  formatCurrency,
  formatDateTime,
} from '../utils/format';

const chartColors = ['#0f766e', '#f97316', '#1d4ed8', '#be123c'];

function AppointmentFeed({ appointments, emptyMessage }) {
  if (!appointments?.length) {
    return <p className="info-banner">{emptyMessage}</p>;
  }

  return (
    <div className="feed-list">
      {appointments.map((appointment) => (
        <article key={appointment.id} className="feed-card">
          <div className="feed-heading">
            <div>
              <h3>{appointment.doctor?.name || appointment.patient?.name}</h3>
              <p className="muted-text">{appointment.doctor?.specialization || appointment.reason}</p>
            </div>
            <StatusBadge status={appointment.status} />
          </div>
          <p className="muted-text">{formatDateTime(appointment.appointmentDate)}</p>
          <p>{appointment.reason}</p>
        </article>
      ))}
    </div>
  );
}

function DashboardChart({ title, children }) {
  return (
    <section className="panel-card chart-card">
      <div className="section-heading tight">
        <h2>{title}</h2>
      </div>
      <div className="chart-body">{children}</div>
    </section>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = async () => {
    setLoading(true);
    setError('');

    try {
      const { data } = await api.get('/dashboard/overview');
      setDashboard(data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [user.role]);

  const titleMap = {
    admin: 'Admin Dashboard',
    doctor: 'Doctor Dashboard',
    patient: 'Patient Dashboard',
  };

  const subtitleMap = {
    admin: 'Track the clinic, manage doctor accounts, and review recent activity.',
    doctor: 'Review your queue, workload, and upcoming appointments.',
    patient: 'Keep your upcoming appointments and care team in one place.',
  };

  return (
    <AppShell
      title={titleMap[user.role]}
      subtitle={subtitleMap[user.role]}
      actions={<button type="button" className="secondary-button compact" onClick={loadDashboard}>Refresh</button>}
    >
      {loading ? <p className="info-banner">Loading dashboard data...</p> : null}
      {error ? <p className="error-banner">{error}</p> : null}

      {dashboard ? (
        <>
          <section className="stats-grid">
            {dashboard.summary.map((item, index) => (
              <StatCard
                key={item.label}
                label={item.label}
                value={item.value}
                accent={['teal', 'orange', 'blue', 'rose'][index % 4]}
              />
            ))}
          </section>

          {dashboard.role === 'admin' ? (
            <>
              <section className="dashboard-grid">
                <DashboardChart title="Appointments Over Six Months">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dashboard.monthlyTrend}>
                      <defs>
                        <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0f766e" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#0f766e" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="label" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Area type="monotone" dataKey="appointments" stroke="#0f766e" fill="url(#trendGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </DashboardChart>

                <DashboardChart title="Appointment Status Mix">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={dashboard.appointmentStatus} dataKey="value" nameKey="name" innerRadius={65} outerRadius={90}>
                        {dashboard.appointmentStatus.map((item, index) => (
                          <Cell key={item.name} fill={chartColors[index % chartColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [value, capitalize(name)]} />
                    </PieChart>
                  </ResponsiveContainer>
                </DashboardChart>
              </section>

              <section className="dashboard-grid">
                <section className="panel-card">
                  <div className="section-heading tight">
                    <h2>Top Doctors</h2>
                  </div>
                  <div className="feed-list">
                    {dashboard.topDoctors.map((doctor) => (
                      <article key={doctor.doctorId} className="feed-card">
                        <div className="feed-heading">
                          <h3>{doctor.doctorName}</h3>
                          <span className="info-chip">{doctor.bookings} bookings</span>
                        </div>
                        <p className="muted-text">{doctor.specialization}</p>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="panel-card">
                  <div className="section-heading tight">
                    <h2>Recent Appointments</h2>
                  </div>
                  <AppointmentFeed
                    appointments={dashboard.recentAppointments}
                    emptyMessage="No recent appointment activity yet."
                  />
                </section>
              </section>
            </>
          ) : null}

          {dashboard.role === 'doctor' ? (
            <>
              <section className="dashboard-grid">
                <DashboardChart title="Weekly Workload">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dashboard.weeklyLoad}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="label" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="appointments" fill="#f97316" radius={[12, 12, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </DashboardChart>

                <section className="panel-card">
                  <div className="section-heading tight">
                    <h2>Clinic Availability</h2>
                  </div>
                  <div className="chip-grid">
                    {dashboard.availability.map((slot) => (
                      <span key={`${slot.day}-${slot.startTime}`} className="info-chip">
                        {slot.day}: {slot.startTime} - {slot.endTime}
                      </span>
                    ))}
                  </div>
                  {dashboard.profile ? (
                    <div className="doctor-profile-summary">
                      <p><strong>Specialization:</strong> {dashboard.profile.specialization}</p>
                      <p><strong>Fee:</strong> {formatCurrency(dashboard.profile.consultationFee)}</p>
                      <p><strong>Location:</strong> {dashboard.profile.location}</p>
                    </div>
                  ) : null}
                </section>
              </section>

              <section className="panel-card">
                <div className="section-heading tight">
                  <h2>Upcoming Queue</h2>
                </div>
                <AppointmentFeed
                  appointments={dashboard.upcomingAppointments.map((appointment) => ({
                    ...appointment,
                    doctor: appointment.patient,
                  }))}
                  emptyMessage="No upcoming appointments are scheduled."
                />
              </section>
            </>
          ) : null}

          {dashboard.role === 'patient' ? (
            <>
              <section className="dashboard-grid">
                <DashboardChart title="Appointment Status">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={dashboard.appointmentStatus} dataKey="value" nameKey="name" outerRadius={90}>
                        {dashboard.appointmentStatus.map((item, index) => (
                          <Cell key={item.name} fill={chartColors[index % chartColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [value, capitalize(name)]} />
                    </PieChart>
                  </ResponsiveContainer>
                </DashboardChart>

                <section className="panel-card">
                  <div className="section-heading tight">
                    <h2>Your Care Team</h2>
                  </div>
                  <div className="feed-list">
                    {dashboard.careTeam.map((doctor) => (
                      <article key={doctor.id} className="feed-card">
                        <div className="feed-heading">
                          <h3>{doctor.name}</h3>
                          <span className="info-chip">{doctor.rating}</span>
                        </div>
                        <p className="muted-text">{doctor.specialization}</p>
                        <p>{doctor.location}</p>
                        <p>{formatCurrency(doctor.consultationFee)}</p>
                      </article>
                    ))}
                  </div>
                </section>
              </section>

              <section className="panel-card">
                <div className="section-heading tight">
                  <h2>Recent Appointments</h2>
                </div>
                <AppointmentFeed
                  appointments={dashboard.recentAppointments}
                  emptyMessage="You do not have any appointments yet."
                />
              </section>
            </>
          ) : null}
        </>
      ) : null}
    </AppShell>
  );
}

import Appointment from '../models/Appointment.js';
import DoctorProfile from '../models/DoctorProfile.js';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { buildDoctorProfileMap, serializeAppointment } from '../utils/appointmentUtils.js';

const monthLabel = (date) => date.toLocaleString('en-US', { month: 'short' });

const startOfDay = (date) => {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

const endOfDay = (date) => {
  const copy = new Date(date);
  copy.setHours(23, 59, 59, 999);
  return copy;
};

const buildStatusData = async (query) => {
  const counts = await Appointment.aggregate([
    { $match: query },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  return ['pending', 'confirmed', 'completed', 'cancelled'].map((status) => ({
    name: status,
    value: counts.find((item) => item._id === status)?.count || 0,
  }));
};

export const getDashboardOverview = asyncHandler(async (req, res) => {
  const now = new Date();
  const todayQuery = {
    appointmentDate: {
      $gte: startOfDay(now),
      $lte: endOfDay(now),
    },
  };

  if (req.user.role === 'admin') {
    const [doctorCount, patientCount, appointmentCount, todayCount, recentAppointments] = await Promise.all([
      User.countDocuments({ role: 'doctor' }),
      User.countDocuments({ role: 'patient' }),
      Appointment.countDocuments(),
      Appointment.countDocuments(todayQuery),
      Appointment.find()
        .populate([
          { path: 'doctor', select: 'name email phone' },
          { path: 'patient', select: 'name email phone age gender' },
        ])
        .sort({ createdAt: -1 })
        .limit(6),
    ]);

    const appointmentStatus = await buildStatusData({});

    const sixMonthTrend = [];
    for (let index = 5; index >= 0; index -= 1) {
      const period = new Date(now.getFullYear(), now.getMonth() - index, 1);
      const nextPeriod = new Date(now.getFullYear(), now.getMonth() - index + 1, 1);
      const count = await Appointment.countDocuments({
        appointmentDate: {
          $gte: period,
          $lt: nextPeriod,
        },
      });

      sixMonthTrend.push({
        label: monthLabel(period),
        appointments: count,
      });
    }

    const topDoctorStats = await Appointment.aggregate([
      { $match: { status: { $in: ['pending', 'confirmed', 'completed'] } } },
      { $group: { _id: '$doctor', bookings: { $sum: 1 } } },
      { $sort: { bookings: -1 } },
      { $limit: 5 },
    ]);

    const doctorProfiles = await DoctorProfile.find({ user: { $in: topDoctorStats.map((item) => item._id) } })
      .populate('user', 'name');
    const doctorMap = new Map(doctorProfiles.map((profile) => [profile.user._id.toString(), profile]));

    const profileMap = await buildDoctorProfileMap(recentAppointments);

    return res.json({
      role: 'admin',
      summary: [
        { label: 'Doctors', value: doctorCount },
        { label: 'Patients', value: patientCount },
        { label: 'Appointments', value: appointmentCount },
        { label: 'Today', value: todayCount },
      ],
      appointmentStatus,
      monthlyTrend: sixMonthTrend,
      recentAppointments: recentAppointments.map((appointment) => serializeAppointment(appointment, profileMap)),
      topDoctors: topDoctorStats.map((entry) => ({
        doctorId: entry._id,
        doctorName: doctorMap.get(entry._id.toString())?.user?.name || 'Unknown',
        specialization: doctorMap.get(entry._id.toString())?.specialization || 'General Medicine',
        bookings: entry.bookings,
      })),
    });
  }

  if (req.user.role === 'doctor') {
    const doctorQuery = { doctor: req.user._id };
    const [total, todayCount, pendingCount, completedCount, profile, upcomingAppointments] = await Promise.all([
      Appointment.countDocuments(doctorQuery),
      Appointment.countDocuments({ ...doctorQuery, ...todayQuery }),
      Appointment.countDocuments({ ...doctorQuery, status: 'pending' }),
      Appointment.countDocuments({ ...doctorQuery, status: 'completed' }),
      DoctorProfile.findOne({ user: req.user._id }).lean(),
      Appointment.find({
        doctor: req.user._id,
        appointmentDate: { $gte: now },
      })
        .populate([
          { path: 'doctor', select: 'name email phone' },
          { path: 'patient', select: 'name email phone age gender' },
        ])
        .sort({ appointmentDate: 1 })
        .limit(8),
    ]);

    const appointmentStatus = await buildStatusData(doctorQuery);
    const profileMap = await buildDoctorProfileMap(upcomingAppointments);

    const weeklyLoad = [];
    for (let index = 0; index < 7; index += 1) {
      const date = new Date(now);
      date.setDate(now.getDate() + index);
      const count = await Appointment.countDocuments({
        doctor: req.user._id,
        appointmentDate: {
          $gte: startOfDay(date),
          $lte: endOfDay(date),
        },
      });

      weeklyLoad.push({
        label: date.toLocaleString('en-US', { weekday: 'short' }),
        appointments: count,
      });
    }

    return res.json({
      role: 'doctor',
      summary: [
        { label: 'Total Appointments', value: total },
        { label: 'Today', value: todayCount },
        { label: 'Pending', value: pendingCount },
        { label: 'Completed', value: completedCount },
      ],
      appointmentStatus,
      weeklyLoad,
      availability: profile?.availability || [],
      profile,
      upcomingAppointments: upcomingAppointments.map((appointment) => serializeAppointment(appointment, profileMap)),
    });
  }

  const patientQuery = { patient: req.user._id };
  const [total, upcomingCount, completedCount, cancelledCount, recentAppointments] = await Promise.all([
    Appointment.countDocuments(patientQuery),
    Appointment.countDocuments({
      ...patientQuery,
      appointmentDate: { $gte: now },
      status: { $in: ['pending', 'confirmed'] },
    }),
    Appointment.countDocuments({ ...patientQuery, status: 'completed' }),
    Appointment.countDocuments({ ...patientQuery, status: 'cancelled' }),
    Appointment.find(patientQuery)
      .populate([
        { path: 'doctor', select: 'name email phone' },
        { path: 'patient', select: 'name email phone age gender' },
      ])
      .sort({ appointmentDate: -1 })
      .limit(6),
  ]);

  const appointmentStatus = await buildStatusData(patientQuery);
  const profileMap = await buildDoctorProfileMap(recentAppointments);

  const careTeamProfiles = await DoctorProfile.find().populate('user', 'name email phone').limit(4);

  res.json({
    role: 'patient',
    summary: [
      { label: 'Total Bookings', value: total },
      { label: 'Upcoming', value: upcomingCount },
      { label: 'Completed', value: completedCount },
      { label: 'Cancelled', value: cancelledCount },
    ],
    appointmentStatus,
    recentAppointments: recentAppointments.map((appointment) => serializeAppointment(appointment, profileMap)),
    careTeam: careTeamProfiles.map((profile) => ({
      id: profile.user._id,
      name: profile.user.name,
      specialization: profile.specialization,
      consultationFee: profile.consultationFee,
      location: profile.location,
      rating: profile.rating,
    })),
  });
});

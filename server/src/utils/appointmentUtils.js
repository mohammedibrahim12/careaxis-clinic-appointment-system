import DoctorProfile from '../models/DoctorProfile.js';

const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return (hours * 60) + minutes;
};

export const isDoctorSlotAvailable = (profile, appointmentDate) => {
  const dayName = DAY_NAMES[appointmentDate.getDay()];
  const slotMinutes = (appointmentDate.getHours() * 60) + appointmentDate.getMinutes();

  return profile.availability.some((slot) => {
    if (slot.day !== dayName) {
      return false;
    }

    const start = timeToMinutes(slot.startTime);
    const end = timeToMinutes(slot.endTime);
    const slotDuration = slot.slotDuration || 30;

    return slotMinutes >= start && (slotMinutes + slotDuration) <= end;
  });
};

export const buildDoctorProfileMap = async (appointments) => {
  const doctorIds = [
    ...new Set(
      appointments
        .map((appointment) => appointment.doctor?._id?.toString() || appointment.doctor?.toString())
        .filter(Boolean),
    ),
  ];

  const profiles = await DoctorProfile.find({ user: { $in: doctorIds } }).lean();
  return new Map(profiles.map((profile) => [profile.user.toString(), profile]));
};

export const serializeAppointment = (appointment, profileMap = new Map()) => {
  const doctorId = appointment.doctor?._id?.toString() || appointment.doctor?.toString();
  const profile = doctorId ? profileMap.get(doctorId) : null;

  return {
    id: appointment._id,
    appointmentDate: appointment.appointmentDate,
    status: appointment.status,
    reason: appointment.reason,
    doctorNotes: appointment.doctorNotes,
    cancellationReason: appointment.cancellationReason,
    createdAt: appointment.createdAt,
    updatedAt: appointment.updatedAt,
    doctor: appointment.doctor?._id
      ? {
          id: appointment.doctor._id,
          name: appointment.doctor.name,
          email: appointment.doctor.email,
          phone: appointment.doctor.phone,
          specialization: profile?.specialization || '',
          consultationFee: profile?.consultationFee || 0,
          location: profile?.location || '',
        }
      : null,
    patient: appointment.patient?._id
      ? {
          id: appointment.patient._id,
          name: appointment.patient.name,
          email: appointment.patient.email,
          phone: appointment.patient.phone,
          age: appointment.patient.age,
          gender: appointment.patient.gender,
        }
      : null,
  };
};

import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDb } from '../config/db.js';
import Appointment from '../models/Appointment.js';
import DoctorProfile from '../models/DoctorProfile.js';
import User from '../models/User.js';

dotenv.config();

const defaultAvailability = [
  { day: 'Monday', startTime: '10:00', endTime: '13:00', slotDuration: 30 },
  { day: 'Tuesday', startTime: '10:00', endTime: '13:00', slotDuration: 30 },
  { day: 'Wednesday', startTime: '10:00', endTime: '13:00', slotDuration: 30 },
  { day: 'Thursday', startTime: '14:00', endTime: '18:00', slotDuration: 30 },
  { day: 'Friday', startTime: '10:00', endTime: '13:00', slotDuration: 30 },
  { day: 'Saturday', startTime: '09:00', endTime: '12:00', slotDuration: 30 },
];

const addDays = (days, hours, minutes = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hours, minutes, 0, 0);
  return date;
};

const run = async () => {
  await connectDb();

  await Promise.all([
    Appointment.deleteMany({}),
    DoctorProfile.deleteMany({}),
    User.deleteMany({}),
  ]);

  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
  const demoPassword = process.env.SEED_DEFAULT_PASSWORD || 'Pass@123';
  const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);
  const hashedDemoPassword = await bcrypt.hash(demoPassword, 10);

  const [admin, doctorOne, doctorTwo, doctorThree, patientOne, patientTwo] = await User.create([
    {
      name: 'Clinic Administrator',
      email: (process.env.ADMIN_EMAIL || 'admin@careaxis.local').toLowerCase(),
      password: hashedAdminPassword,
      role: 'admin',
      phone: '+91 9876543210',
    },
    {
      name: 'Dr. Asha Menon',
      email: 'asha@careaxis.local',
      password: hashedDemoPassword,
      role: 'doctor',
      phone: '+91 9810000001',
    },
    {
      name: 'Dr. Rahul Bedi',
      email: 'rahul@careaxis.local',
      password: hashedDemoPassword,
      role: 'doctor',
      phone: '+91 9810000002',
    },
    {
      name: 'Dr. Neha Kapoor',
      email: 'neha@careaxis.local',
      password: hashedDemoPassword,
      role: 'doctor',
      phone: '+91 9810000003',
    },
    {
      name: 'Riya Sharma',
      email: 'riya@careaxis.local',
      password: hashedDemoPassword,
      role: 'patient',
      phone: '+91 9810000011',
      age: 27,
      gender: 'female',
    },
    {
      name: 'Aman Verma',
      email: 'aman@careaxis.local',
      password: hashedDemoPassword,
      role: 'patient',
      phone: '+91 9810000012',
      age: 34,
      gender: 'male',
    },
  ]);

  await DoctorProfile.create([
    {
      user: doctorOne._id,
      specialization: 'General Physician',
      qualifications: 'MBBS, MD',
      experienceYears: 9,
      consultationFee: 700,
      location: 'CareAxis Main Branch',
      clinicRoom: 'Room 201',
      bio: 'Focuses on preventive care and adult wellness planning.',
      rating: 4.8,
      availability: defaultAvailability,
    },
    {
      user: doctorTwo._id,
      specialization: 'Dermatology',
      qualifications: 'MBBS, DVD',
      experienceYears: 6,
      consultationFee: 850,
      location: 'CareAxis Skin Clinic',
      clinicRoom: 'Room 105',
      bio: 'Treats chronic skin conditions with patient-friendly care plans.',
      rating: 4.7,
      availability: defaultAvailability,
    },
    {
      user: doctorThree._id,
      specialization: 'Pediatrics',
      qualifications: 'MBBS, DCH',
      experienceYears: 11,
      consultationFee: 900,
      location: 'CareAxis Child Health Wing',
      clinicRoom: 'Room 304',
      bio: 'Supports child development, immunization, and follow-up care.',
      rating: 4.9,
      availability: defaultAvailability,
    },
  ]);

  await Appointment.create([
    {
      patient: patientOne._id,
      doctor: doctorOne._id,
      appointmentDate: addDays(1, 10, 0),
      reason: 'Recurring headache and mild fever',
      status: 'confirmed',
      doctorNotes: 'Hydration follow-up planned.',
    },
    {
      patient: patientTwo._id,
      doctor: doctorOne._id,
      appointmentDate: addDays(3, 11, 0),
      reason: 'Annual health screening',
      status: 'pending',
    },
    {
      patient: patientOne._id,
      doctor: doctorTwo._id,
      appointmentDate: addDays(5, 14, 0),
      reason: 'Skin rash consultation',
      status: 'pending',
    },
    {
      patient: patientTwo._id,
      doctor: doctorThree._id,
      appointmentDate: addDays(-5, 10, 30),
      reason: 'Child vaccination review',
      status: 'completed',
      doctorNotes: 'Vaccination complete. Review again in 6 months.',
    },
    {
      patient: patientOne._id,
      doctor: doctorThree._id,
      appointmentDate: addDays(-2, 9, 30),
      reason: 'Nutrition follow-up',
      status: 'cancelled',
      cancellationReason: 'Patient requested reschedule',
    },
  ]);

  console.log('Demo data created successfully.');
  console.log(`Admin login: ${admin.email} / ${adminPassword}`);
  console.log(`Doctor login: ${doctorOne.email} / ${demoPassword}`);
  console.log(`Patient login: ${patientOne.email} / ${demoPassword}`);

  await mongoose.connection.close();
};

run().catch(async (error) => {
  console.error(error);
  await mongoose.connection.close();
  process.exit(1);
});

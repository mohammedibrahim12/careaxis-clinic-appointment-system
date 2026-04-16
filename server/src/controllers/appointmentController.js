import Appointment from '../models/Appointment.js';
import DoctorProfile from '../models/DoctorProfile.js';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  buildDoctorProfileMap,
  isDoctorSlotAvailable,
  serializeAppointment,
} from '../utils/appointmentUtils.js';

const appointmentPopulate = [
  { path: 'doctor', select: 'name email phone' },
  { path: 'patient', select: 'name email phone age gender' },
];

export const getAppointments = asyncHandler(async (req, res) => {
  const query = {};

  if (req.user.role === 'patient') {
    query.patient = req.user._id;
  }

  if (req.user.role === 'doctor') {
    query.doctor = req.user._id;
  }

  const appointments = await Appointment.find(query)
    .populate(appointmentPopulate)
    .sort({ appointmentDate: 1 });

  const profileMap = await buildDoctorProfileMap(appointments);
  res.json({
    appointments: appointments.map((appointment) => serializeAppointment(appointment, profileMap)),
  });
});

export const createAppointment = asyncHandler(async (req, res) => {
  const { doctorId, appointmentDate, reason } = req.body;

  if (!doctorId || !appointmentDate || !reason) {
    const error = new Error('Doctor, appointment date, and reason are required');
    error.statusCode = 400;
    throw error;
  }

  const doctor = await User.findOne({ _id: doctorId, role: 'doctor' });
  const profile = await DoctorProfile.findOne({ user: doctorId });

  if (!doctor || !profile) {
    const error = new Error('Selected doctor does not exist');
    error.statusCode = 404;
    throw error;
  }

  const slot = new Date(appointmentDate);
  if (Number.isNaN(slot.getTime())) {
    const error = new Error('Invalid appointment date');
    error.statusCode = 400;
    throw error;
  }

  if (slot <= new Date()) {
    const error = new Error('Appointment must be scheduled in the future');
    error.statusCode = 400;
    throw error;
  }

  if (!isDoctorSlotAvailable(profile, slot)) {
    const error = new Error('Selected slot is outside the doctor availability window');
    error.statusCode = 400;
    throw error;
  }

  const existingAppointment = await Appointment.findOne({
    doctor: doctorId,
    appointmentDate: slot,
    status: { $in: ['pending', 'confirmed', 'completed'] },
  });

  if (existingAppointment) {
    const error = new Error('This slot is already booked');
    error.statusCode = 409;
    throw error;
  }

  const appointment = await Appointment.create({
    patient: req.user._id,
    doctor: doctorId,
    appointmentDate: slot,
    reason,
    status: 'pending',
  });

  const populatedAppointment = await Appointment.findById(appointment._id).populate(appointmentPopulate);
  const profileMap = await buildDoctorProfileMap([populatedAppointment]);

  res.status(201).json({
    appointment: serializeAppointment(populatedAppointment, profileMap),
  });
});

export const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { status, doctorNotes } = req.body;
  const appointment = await Appointment.findById(req.params.id).populate(appointmentPopulate);

  if (!appointment) {
    const error = new Error('Appointment not found');
    error.statusCode = 404;
    throw error;
  }

  if (req.user.role === 'doctor' && appointment.doctor._id.toString() !== req.user._id.toString()) {
    const error = new Error('Doctors can update only their own appointments');
    error.statusCode = 403;
    throw error;
  }

  if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
    const error = new Error('Invalid appointment status');
    error.statusCode = 400;
    throw error;
  }

  appointment.status = status;
  if (doctorNotes !== undefined) {
    appointment.doctorNotes = doctorNotes;
  }
  if (status !== 'cancelled') {
    appointment.cancellationReason = '';
  }

  await appointment.save();

  const profileMap = await buildDoctorProfileMap([appointment]);
  res.json({
    appointment: serializeAppointment(appointment, profileMap),
  });
});

export const cancelAppointment = asyncHandler(async (req, res) => {
  const { cancellationReason } = req.body;
  const appointment = await Appointment.findById(req.params.id).populate(appointmentPopulate);

  if (!appointment) {
    const error = new Error('Appointment not found');
    error.statusCode = 404;
    throw error;
  }

  const userId = req.user._id.toString();
  const isOwner = appointment.patient._id.toString() === userId;
  const isDoctorOwner = appointment.doctor._id.toString() === userId;

  if (!['admin'].includes(req.user.role) && !isOwner && !isDoctorOwner) {
    const error = new Error('You do not have permission to cancel this appointment');
    error.statusCode = 403;
    throw error;
  }

  appointment.status = 'cancelled';
  appointment.cancellationReason = cancellationReason || 'Cancelled by user';
  await appointment.save();

  const profileMap = await buildDoctorProfileMap([appointment]);
  res.json({
    appointment: serializeAppointment(appointment, profileMap),
  });
});

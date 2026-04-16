import bcrypt from 'bcryptjs';
import DoctorProfile from '../models/DoctorProfile.js';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const normalizeDoctor = (profile) => ({
  id: profile.user._id,
  name: profile.user.name,
  email: profile.user.email,
  phone: profile.user.phone,
  specialization: profile.specialization,
  qualifications: profile.qualifications,
  experienceYears: profile.experienceYears,
  consultationFee: profile.consultationFee,
  location: profile.location,
  clinicRoom: profile.clinicRoom,
  bio: profile.bio,
  rating: profile.rating,
  isAvailable: profile.isAvailable,
  availability: profile.availability,
});

export const getDoctors = asyncHandler(async (req, res) => {
  const search = (req.query.search || '').trim().toLowerCase();
  const profiles = await DoctorProfile.find()
    .populate('user', 'name email phone role')
    .sort({ createdAt: -1 });

  const doctors = profiles
    .filter((profile) => {
      if (!search) {
        return true;
      }

      const haystack = [
        profile.user.name,
        profile.specialization,
        profile.location,
        profile.qualifications,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(search);
    })
    .map(normalizeDoctor);

  res.json({ doctors });
});

export const getDoctorById = asyncHandler(async (req, res) => {
  const profile = await DoctorProfile.findOne({ user: req.params.id })
    .populate('user', 'name email phone');

  if (!profile) {
    const error = new Error('Doctor not found');
    error.statusCode = 404;
    throw error;
  }

  res.json({ doctor: normalizeDoctor(profile) });
});

export const createDoctor = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    specialization,
    qualifications,
    experienceYears,
    consultationFee,
    location,
    clinicRoom,
    bio,
    availability,
  } = req.body;

  if (!name || !email || !password || !specialization) {
    const error = new Error('Name, email, password, and specialization are required');
    error.statusCode = 400;
    throw error;
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    const error = new Error('A user with this email already exists');
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    role: 'doctor',
    phone,
  });

  const profile = await DoctorProfile.create({
    user: user._id,
    specialization,
    qualifications,
    experienceYears,
    consultationFee,
    location,
    clinicRoom,
    bio,
    availability: Array.isArray(availability) && availability.length > 0 ? availability : undefined,
  });

  const populatedProfile = await DoctorProfile.findById(profile._id).populate('user', 'name email phone');
  res.status(201).json({ doctor: normalizeDoctor(populatedProfile) });
});

export const updateDoctor = asyncHandler(async (req, res) => {
  const targetId = req.params.id;
  if (req.user.role === 'doctor' && req.user._id.toString() !== targetId) {
    const error = new Error('Doctors can only update their own profile');
    error.statusCode = 403;
    throw error;
  }

  const user = await User.findById(targetId);
  const profile = await DoctorProfile.findOne({ user: targetId });

  if (!user || !profile) {
    const error = new Error('Doctor not found');
    error.statusCode = 404;
    throw error;
  }

  const fields = [
    'specialization',
    'qualifications',
    'experienceYears',
    'consultationFee',
    'location',
    'clinicRoom',
    'bio',
    'isAvailable',
    'rating',
  ];

  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      profile[field] = req.body[field];
    }
  });

  if (Array.isArray(req.body.availability)) {
    profile.availability = req.body.availability;
  }

  ['name', 'phone'].forEach((field) => {
    if (req.body[field] !== undefined) {
      user[field] = req.body[field];
    }
  });

  await user.save();
  await profile.save();

  const populatedProfile = await DoctorProfile.findOne({ user: targetId }).populate('user', 'name email phone');
  res.json({ doctor: normalizeDoctor(populatedProfile) });
});

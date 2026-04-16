import bcrypt from 'bcryptjs';
import DoctorProfile from '../models/DoctorProfile.js';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateToken } from '../utils/generateToken.js';

const buildAuthPayload = async (user) => {
  const payload = {
    token: generateToken(user._id),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      gender: user.gender,
      age: user.age,
    },
  };

  if (user.role === 'doctor') {
    const profile = await DoctorProfile.findOne({ user: user._id }).lean();
    payload.user.profile = profile;
  }

  return payload;
};

export const registerPatient = asyncHandler(async (req, res) => {
  const {
    name, email, password, phone, gender, age,
  } = req.body;

  if (!name || !email || !password) {
    const error = new Error('Name, email, and password are required');
    error.statusCode = 400;
    throw error;
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    const error = new Error('An account with this email already exists');
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    role: 'patient',
    phone,
    gender,
    age,
  });

  res.status(201).json(await buildAuthPayload(user));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = new Error('Email and password are required');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  user.lastLoginAt = new Date();
  await user.save();

  const freshUser = await User.findById(user._id);
  res.json(await buildAuthPayload(freshUser));
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const responseUser = {
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    phone: req.user.phone,
    gender: req.user.gender,
    age: req.user.age,
  };

  if (req.user.role === 'doctor') {
    responseUser.profile = await DoctorProfile.findOne({ user: req.user._id }).lean();
  }

  res.json({ user: responseUser });
});

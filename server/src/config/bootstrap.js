import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export const ensureDefaultAdmin = async () => {
  const email = (process.env.ADMIN_EMAIL || 'admin@careaxis.local').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'Admin@123';

  const existingAdmin = await User.findOne({ email });
  if (existingAdmin) {
    return existingAdmin;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = await User.create({
    name: 'Clinic Administrator',
    email,
    password: hashedPassword,
    role: 'admin',
    phone: '+91 9876543210',
  });

  console.log(`Default admin created: ${email}`);
  return admin;
};

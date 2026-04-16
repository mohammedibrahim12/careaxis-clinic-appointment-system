import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema(
  {
    day: {
      type: String,
      required: true,
      enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    slotDuration: {
      type: Number,
      default: 30,
      min: 15,
      max: 120,
    },
  },
  { _id: false },
);

const doctorProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    specialization: {
      type: String,
      required: true,
      trim: true,
    },
    qualifications: {
      type: String,
      default: '',
      trim: true,
    },
    experienceYears: {
      type: Number,
      default: 1,
      min: 0,
    },
    consultationFee: {
      type: Number,
      default: 500,
      min: 0,
    },
    location: {
      type: String,
      default: 'Main Clinic',
      trim: true,
    },
    clinicRoom: {
      type: String,
      default: '',
      trim: true,
    },
    bio: {
      type: String,
      default: '',
      trim: true,
    },
    rating: {
      type: Number,
      default: 4.6,
      min: 0,
      max: 5,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    availability: {
      type: [availabilitySchema],
      default: [
        { day: 'Monday', startTime: '10:00', endTime: '13:00', slotDuration: 30 },
        { day: 'Tuesday', startTime: '10:00', endTime: '13:00', slotDuration: 30 },
        { day: 'Wednesday', startTime: '10:00', endTime: '13:00', slotDuration: 30 },
        { day: 'Thursday', startTime: '10:00', endTime: '13:00', slotDuration: 30 },
        { day: 'Friday', startTime: '10:00', endTime: '13:00', slotDuration: 30 },
        { day: 'Saturday', startTime: '10:00', endTime: '13:00', slotDuration: 30 },
      ],
    },
  },
  {
    timestamps: true,
  },
);

doctorProfileSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const DoctorProfile = mongoose.model('DoctorProfile', doctorProfileSchema);

export default DoctorProfile;

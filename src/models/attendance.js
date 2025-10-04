import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema({
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true
  },
  memberName: { 
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Present', 'Absent'],
    required: true,
    default: 'Absent'
  },
  notes: {
    type: String,
    default: ''
  },
  image: {           // ✅ Added image field
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export default mongoose.models.Attendance || mongoose.model('Attendance', AttendanceSchema);

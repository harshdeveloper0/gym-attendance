import mongoose from 'mongoose';

const MemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    trim: true
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  feeStatus: {
    type: String,
    enum: ['Paid', 'Pending', 'Advance Paid'],
    default: 'Pending'
  },
  note: {
    type: String,
    default: "clear"
  },
  isActive: {
    type: Boolean,
    default: true
  },
  image: {
    type: String,
    default: ""
  },
  session: {
    type: String,
    enum: ['Morning', 'Evening'],
    default: 'Morning'
  }
}, {
  timestamps: true
});

export default mongoose.models.Member || mongoose.model('Member', MemberSchema);

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
  note:{
    type:String,
    deafult:"clear",
  },
  isActive: {
    type: Boolean,
    default: true
  },
  image: {
    type: String, 
    default: ""
  }
}, {
  timestamps: true
});

export default mongoose.models.Member || mongoose.model('Member', MemberSchema);

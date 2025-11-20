import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  department: { type: String, trim: true },
  designation: { type: String, trim: true },
  salary: { type: Number, default: 0 },
  joining_date: { type: Date },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

export default mongoose.model('Employee', EmployeeSchema);

import mongoose, { Schema, type Document } from 'mongoose';

export interface IStudent extends Document {
  fullName: string;
  phone: string;
  code: string;
  faculty: string;
  semester: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const studentSchema = new Schema<IStudent>(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    code: { type: String, required: true, unique: true, trim: true },
    faculty: { type: String, required: true, trim: true },
    semester: { type: Number, required: true, min: 1, max: 12 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

studentSchema.index({ faculty: 1 });
studentSchema.index({ active: 1 });

export const StudentModel =
  mongoose.models.Student || mongoose.model<IStudent>('Student', studentSchema);

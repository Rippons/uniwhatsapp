import mongoose, { Schema, type Document } from 'mongoose';
import { ROLES } from '@shared/constants';
import type { UserRole } from '@shared/types';

export interface IAdminUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const adminUserSchema = new Schema<IAdminUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: Object.values(ROLES) },
  },
  { timestamps: true },
);

adminUserSchema.index({ email: 1 });

export const AdminUserModel =
  mongoose.models.AdminUser || mongoose.model<IAdminUser>('AdminUser', adminUserSchema);

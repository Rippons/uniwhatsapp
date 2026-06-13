import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/university_whatsapp';

const AdminUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
}, { timestamps: true });

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const AdminUser = mongoose.model('AdminUser', AdminUserSchema);

  const existing = await AdminUser.findOne({ email: 'admin@universidad.edu' });
  if (existing) {
    console.log('Seed admin already exists. Skipping.');
    await mongoose.disconnect();
    return;
  }

  const hashedPassword = await bcrypt.hash('admin123456', 12);

  await AdminUser.create({
    name: 'Super Admin',
    email: 'admin@universidad.edu',
    password: hashedPassword,
    role: 'SUPER_ADMIN',
  });

  console.log('Seed admin created:');
  console.log('  Email: admin@universidad.edu');
  console.log('  Password: admin123456');

  await mongoose.disconnect();
  console.log('Done.');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});

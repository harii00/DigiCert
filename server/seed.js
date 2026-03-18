import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Certificate from './models/Certificate.js';
import QRCode from 'qrcode';

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Certificate.deleteMany({});
    console.log('Cleared existing data');

    // Create Admin
    const admin = await User.create({
      name: 'Institutional Admin',
      email: 'admin@school.edu',
      password: 'admin123',
      role: 'admin',
      department: 'Administration',
    });

    // Create Students
    const student1 = await User.create({
      name: 'Yash Omre',
      email: 'yash@example.com',
      password: 'student123',
      role: 'student',
      department: 'Computer Science',
    });

    const student2 = await User.create({
      name: 'Sumit Kumar Ahirwar',
      email: 'sumit@example.com',
      password: 'student123',
      role: 'student',
      department: 'Information Technology',
    });

    const student3 = await User.create({
      name: 'Siddhant Gupta',
      email: 'siddhant@example.com',
      password: 'student123',
      role: 'student',
      department: 'Electronics',
    });

    console.log('Users created');

    const sampleData = [
      { student: student1, name: 'Yash Omre', event: 'Vocal Voyage 2026', email: 'yash@example.com', date: '2026-01-29' },
      { student: student1, name: 'Yash Omre', event: 'Hackathon 2026', email: 'yash@example.com', date: '2026-02-15' },
      { student: student2, name: 'Sumit Kumar Ahirwar', event: 'Vocal Voyage 2026', email: 'sumit@example.com', date: '2026-01-29' },
      { student: student3, name: 'Siddhant Gupta', event: 'Vocal Voyage 2026', email: 'siddhant@example.com', date: '2026-01-29' },
    ];

    for (const item of sampleData) {
      const certificateId = `DCS-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      const verificationUrl = `http://localhost:5173/verify/${certificateId}`;
      const qrCode = await QRCode.toDataURL(verificationUrl);

      await Certificate.create({
        certificateId,
        studentId: item.student._id,
        studentName: item.name,
        studentEmail: item.email,
        event: item.event,
        issuedDate: new Date(item.date),
        status: 'Valid',
        qrCode,
        verificationUrl,
        issuedBy: admin._id,
      });
    }

    console.log('Sample certificates seeded');
    mongoose.connection.close();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seed();

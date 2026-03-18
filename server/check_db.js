import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import User from './models/User.js';
import CompletedCourse from './models/CompletedCourse.js';

dotenv.config();

const checkDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/digital-certificate-system';
    await mongoose.connect(uri);

    const students = await User.find({ role: 'student' }).select('name roll_number email');
    const admins = await User.find({ role: 'admin' }).select('name email');
    const courses = await CompletedCourse.find();

    const output = {
      students: students.map(s => ({ 
        name: s.name, 
        roll: s.roll_number, 
        email: s.email 
      })),
      admins: admins.map(a => ({
        name: a.name,
        email: a.email
      })),
      courses: courses.map(c => ({ 
        roll: c.roll_number, 
        course: c.course_name, 
        level: c.level, 
        completed: c.completed 
      }))
    };

    fs.writeFileSync('db_status.json', JSON.stringify(output, null, 2));
    console.log('Output written to db_status.json');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkDB();

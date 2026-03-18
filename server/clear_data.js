import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CompletedCourse from './models/CompletedCourse.js';

dotenv.config();

const clearDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/digital-certificate-system';
    await mongoose.connect(uri);
    console.log('Connected to DB');

    const result = await CompletedCourse.deleteMany({});
    console.log(`Cleared ${result.deletedCount} corrupted course records`);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

clearDB();

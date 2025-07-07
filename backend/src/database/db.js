import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL);
    console.log('✅ MongoDB connected successfully', conn.connection.name);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}
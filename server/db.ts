import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error(
    "MONGODB_URI must be set. Please provide your MongoDB Atlas connection string.",
  );
}

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 30000,
      retryWrites: true,
    });
    console.log('MongoDB Atlas connected successfully');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.log('Note: You may need to whitelist Replit\'s IP addresses in MongoDB Atlas Network Access settings.');
    console.log('Continuing without database connection for development...');
    return false;
  }
};

export { connectDB };
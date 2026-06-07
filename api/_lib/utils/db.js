import mongoose from 'mongoose';

let cached = global._mongooseCache;
if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is required');
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri).then((m) => {
      console.log('Connected to MongoDB Atlas');
      return m;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default mongoose;

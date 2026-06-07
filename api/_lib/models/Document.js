import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  cloudinaryUrl: { type: String, required: true },
  extractedText: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Document', documentSchema);

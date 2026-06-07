import Document from '../models/Document.js';
import Conversation from '../models/Conversation.js';
import { extractTextFromBuffer } from '../utils/extractText.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

export async function uploadDocument(req, res) {
  try {
    const file = req.file || req.body?.file;
    let buffer, originalName;

    if (req.file) {
      buffer = req.file.buffer;
      originalName = req.file.originalname;
    } else if (req.body?.file) {
      const base64 = req.body.file.split(',').pop();
      buffer = Buffer.from(base64, 'base64');
      originalName = req.body.filename || 'document.txt';
    } else {
      return res.status(400).json({ error: 'No file provided' });
    }

    const extractedText = await extractTextFromBuffer(buffer, originalName);

    const cloudinaryResult = await uploadToCloudinary(buffer, `${Date.now()}-${originalName}`);

    const doc = await Document.create({
      userId: req.userId,
      filename: cloudinaryResult.public_id,
      originalName,
      cloudinaryUrl: cloudinaryResult.secure_url,
      extractedText,
    });

    const { extractedText: _, ...safeDoc } = doc.toObject();
    res.status(201).json(safeDoc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function listDocuments(req, res) {
  try {
    const docs = await Document.find({ userId: req.userId })
      .select('-extractedText')
      .sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function deleteDocument(req, res) {
  try {
    const doc = await Document.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!doc) {
      return res.status(404).json({ error: 'Document not found' });
    }

    await Conversation.deleteMany({ documentId: req.params.id });
    res.json({ message: 'Document deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

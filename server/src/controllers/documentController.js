import {
  createDocument,
  findDocumentsByUser,
  findDocumentByIdAndUser,
  removeDocument,
} from '../models/Document.js';
import { removeConversationsByDocument } from '../models/Conversation.js';
import { extractTextFromFile } from '../utils/extractText.js';

export async function uploadDocument(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const extractedText = await extractTextFromFile(req.file.path);

    const doc = await createDocument({
      userId: req.userId,
      filename: req.file.filename,
      originalName: req.file.originalname,
      extractedText,
    });

    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function listDocuments(req, res) {
  try {
    const docs = await findDocumentsByUser(req.userId);
    const sanitized = docs.map(({ extractedText, ...rest }) => rest);
    res.json(sanitized);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function deleteDocument(req, res) {
  try {
    const removed = await removeDocument(req.params.id, req.userId);
    if (!removed) {
      return res.status(404).json({ error: 'Document not found' });
    }
    await removeConversationsByDocument(req.params.id);
    res.json({ message: 'Document deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

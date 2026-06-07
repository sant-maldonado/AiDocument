let _impl;

export async function initDocumentModel() {
  const { nedbDocuments } = await import('../utils/db.js');
  _impl = nedbDocuments;
}

export async function createDocument({ userId, filename, originalName, extractedText }) {
  return _impl.insert({ userId, filename, originalName, extractedText, createdAt: new Date() });
}

export async function findDocumentsByUser(userId) {
  return _impl.find({ userId }).sort({ createdAt: -1 });
}

export async function findDocumentByIdAndUser(id, userId) {
  return _impl.findOne({ _id: id, userId });
}

export async function removeDocument(id, userId) {
  return _impl.remove({ _id: id, userId }, {});
}

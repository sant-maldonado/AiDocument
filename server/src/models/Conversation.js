let _impl;

export async function initConversationModel() {
  const { nedbConversations } = await import('../utils/db.js');
  _impl = nedbConversations;
}

export async function createConversation({ userId, documentId, title }) {
  return _impl.insert({
    userId, documentId, title,
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

export async function findConversationsByUserAndDoc(userId, documentId) {
  return _impl.find({ userId, documentId }).sort({ updatedAt: -1 });
}

export async function findConversationByIdAndUser(id, userId) {
  return _impl.findOne({ _id: id, userId });
}

export async function updateConversationMessages(id, messages) {
  return _impl.update(
    { _id: id },
    { $set: { messages, updatedAt: new Date() } }
  );
}

export async function removeConversationsByDocument(documentId) {
  return _impl.remove({ documentId }, { multi: true });
}

export async function removeConversation(id, userId) {
  return _impl.remove({ _id: id, userId }, {});
}

import { findDocumentByIdAndUser } from '../models/Document.js';
import {
  createConversation,
  findConversationsByUserAndDoc,
  findConversationByIdAndUser,
  updateConversationMessages,
  removeConversation,
} from '../models/Conversation.js';
import { streamChat } from '../utils/openai.js';

export async function handleChat(req, res) {
  try {
    const { documentId, message, conversationId } = req.body;
    const userId = req.userId;

    const doc = await findDocumentByIdAndUser(documentId, userId);
    if (!doc) {
      return res.status(404).json({ error: 'Document not found' });
    }

    let conversation;
    if (conversationId) {
      conversation = await findConversationByIdAndUser(conversationId, userId);
      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
      }
    } else {
      conversation = await createConversation({
        userId,
        documentId,
        title: message.slice(0, 80),
      });
    }

    const messages = conversation.messages || [];
    messages.push({ role: 'user', content: message, timestamp: new Date() });

    const systemMessage = {
      role: 'system',
      content: `You are a helpful assistant. Answer questions based on the following document content:\n\n${doc.extractedText}`,
    };

    const history = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const openaiMessages = [systemMessage, ...history];

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    });

    let fullResponse = '';

    await streamChat(openaiMessages, (chunk) => {
      fullResponse += chunk;
      res.write(`data: ${JSON.stringify({ content: chunk, conversationId: conversation._id })}\n\n`);
    });

    res.write(`data: ${JSON.stringify({ content: '', conversationId: conversation._id, done: true })}\n\n`);
    res.end();

    messages.push({ role: 'assistant', content: fullResponse, timestamp: new Date() });
    await updateConversationMessages(conversation._id, messages);
  } catch (err) {
    if (res.headersSent) {
      res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
      res.end();
    } else {
      res.status(500).json({ error: err.message });
    }
  }
}

export async function listConversations(req, res) {
  try {
    const { documentId } = req.query;
    const conversations = await findConversationsByUserAndDoc(req.userId, documentId);
    const sanitized = conversations.map(({ messages, ...rest }) => rest);
    res.json(sanitized);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getConversation(req, res) {
  try {
    const conversation = await findConversationByIdAndUser(req.params.id, req.userId);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    res.json(conversation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function deleteConversation(req, res) {
  try {
    const removed = await removeConversation(req.params.id, req.userId);
    if (!removed) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    res.json({ message: 'Conversation deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

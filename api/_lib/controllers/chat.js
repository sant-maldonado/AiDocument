import Document from '../models/Document.js';
import Conversation from '../models/Conversation.js';
import { streamChat } from '../utils/groq.js';

export async function handleChat(req, res) {
  try {
    const { documentId, message, conversationId } = req.body;
    const userId = req.userId;

    const doc = await Document.findOne({ _id: documentId, userId });
    if (!doc) {
      return res.status(404).json({ error: 'Document not found' });
    }

    let conversation;
    if (conversationId) {
      conversation = await Conversation.findOne({ _id: conversationId, userId });
      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
      }
    } else {
      conversation = await Conversation.create({
        userId,
        documentId,
        title: message.slice(0, 80),
        messages: [],
      });
    }

    conversation.messages.push({ role: 'user', content: message });

    const systemMessage = {
      role: 'system',
      content: `You are a helpful assistant. Answer questions based on the following document content:\n\n${doc.extractedText}`,
    };

    const history = conversation.messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const messages = [systemMessage, ...history];

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    });

    let fullResponse = '';

    await streamChat(messages, (chunk) => {
      fullResponse += chunk;
      res.write(`data: ${JSON.stringify({ content: chunk, conversationId: conversation._id })}\n\n`);
    });

    res.write(`data: ${JSON.stringify({ content: '', conversationId: conversation._id, done: true })}\n\n`);
    res.end();

    conversation.messages.push({ role: 'assistant', content: fullResponse });
    await conversation.save();
  } catch (err) {
    console.error('Chat error:', err.message, err.stack);
    const message = err.message || 'Error interno del servidor';
    if (res.headersSent) {
      res.write(`data: ${JSON.stringify({ error: message })}\n\n`);
      res.end();
    } else {
      res.status(500).json({ error: message });
    }
  }
}

export async function listConversations(req, res) {
  try {
    const { documentId } = req.query;
    const filter = { userId: req.userId };
    if (documentId) filter.documentId = documentId;

    const conversations = await Conversation.find(filter)
      .select('title documentId createdAt updatedAt')
      .sort({ updatedAt: -1 });
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getConversation(req, res) {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      userId: req.userId,
    });
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
    const conversation = await Conversation.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    res.json({ message: 'Conversation deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

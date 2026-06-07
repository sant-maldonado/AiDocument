import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  handleChat,
  listConversations,
  getConversation,
  deleteConversation,
} from '../controllers/chat.js';

const router = Router();

router.use(authMiddleware);
router.post('/', handleChat);
router.get('/conversations', listConversations);
router.get('/conversations/:id', getConversation);
router.delete('/conversations/:id', deleteConversation);

export default router;

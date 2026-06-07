import { Router } from 'express';
import multer from 'multer';
import { authMiddleware } from '../middleware/auth.js';
import { uploadDocument, listDocuments, deleteDocument } from '../controllers/document.js';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const router = Router();

router.use(authMiddleware);
router.post('/upload', upload.single('document'), uploadDocument);
router.get('/', listDocuments);
router.delete('/:id', deleteDocument);

export default router;

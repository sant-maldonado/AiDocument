import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { uploadDocument, listDocuments, deleteDocument } from '../controllers/documentController.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.txt'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and TXT files are allowed'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 },
});

const router = Router();

router.use(authMiddleware);
router.post('/upload', upload.single('document'), uploadDocument);
router.get('/', listDocuments);
router.delete('/:id', deleteDocument);

export default router;

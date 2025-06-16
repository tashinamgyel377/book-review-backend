// routes/bookRoutes.ts
import express from 'express';
import { authenticate } from '../middleware/authMiddleware'
import { createBook, deleteBook, getBookById, getBooks, updateBook } from '../controllers/bookController'

const router = express.Router();

// Public routes
router.get('/',authenticate, getBooks);
router.get('/:id',authenticate,  getBookById);
router.post('/', authenticate, createBook);
router.put('/:id', authenticate, updateBook);
router.delete('/:id', authenticate, deleteBook);

export default router;
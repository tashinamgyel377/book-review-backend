import { Request, Response } from 'express';
import {Book} from '../models/booksModel'
import { handleError } from '../utlis/authUtils';

// Create a new book
export const createBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, author, description, publishedYear, genre } = req.body;
    const createdBy = req.user?._id;

    if (!title || !author) {
      res.status(400).json({ message: 'Title and author are required' });
      return;
    }

    if (!createdBy) {
      res.status(401).json({ message: 'Unauthorized: missing user ID' });
      return;
    }

    const newBook = await Book.create({
      title,
      author,
      description,
      genre,
      publishedYear,
      createdBy,
    });

    const populatedBook = await newBook.populate('createdBy', 'username');

    res.status(201).json({
      message: 'Book created successfully',
      data: populatedBook,
    });
  } catch (error) {
    handleError(res, error, 400);
  }
};

// Get all books
export const getBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const books = await Book.find()
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Books fetched successfully',
      data: books,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Get book by ID
export const getBookById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id).populate('createdBy', 'username');

    if (!book) {
      res.status(404).json({ message: 'Book not found' });
      return;
    }

    res.status(200).json({
      message: 'Book fetched successfully',
      data: book,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Update a book by ID
export const updateBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized: missing user ID' });
      return;
    }

    const book = await Book.findById(id);
    if (!book) {
      res.status(404).json({ message: 'Book not found' });
      return;
    }

    if (book.createdBy.toString() !== userId.toString()) {
      res.status(403).json({ message: 'Forbidden: not your book' });
      return;
    }

    const { title, author, description, publishedYear, genre } = req.body;
    if (title !== undefined) book.title = title;
    if (author !== undefined) book.author = author;
    if (description !== undefined) book.description = description;
    if (publishedYear !== undefined) book.publishedYear = publishedYear;
    if (genre !== undefined) book.genre = genre;

    const updatedBook = await book.save();

    const populatedBook = await updatedBook.populate('createdBy', 'username');

    res.status(200).json({
      message: 'Book updated successfully',
      data: populatedBook,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Delete a book by ID
export const deleteBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized: missing user ID' });
      return;
    }

    const book = await Book.findById(id);
    if (!book) {
      res.status(404).json({ message: 'Book not found' });
      return;
    }

    if (book.createdBy.toString() !== userId.toString()) {
      res.status(403).json({ message: 'Forbidden: not your book' });
      return;
    }

    await Book.findByIdAndDelete(id);

    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    handleError(res, error);
  }
};
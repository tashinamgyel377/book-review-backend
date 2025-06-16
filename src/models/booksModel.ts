// models/Book.ts
import { Schema, model, Types } from 'mongoose';
import { IBook } from '../types/authTypes';


const BookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String, required: true },
    genre: { type: [String], required: true },
    publishedYear: { type: Date, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
 
  },
  { timestamps: true }
);

export const Book = model<IBook>('Book', BookSchema);